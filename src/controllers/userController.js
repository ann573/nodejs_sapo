import bcrypt from "bcryptjs";
import { endOfDay, startOfDay } from "date-fns";
import dotenv from "dotenv";
import Order from "../models/order.js";
import User from "../models/user.js";
import { findAllUser } from "../services/userService.js";
import { errorResponse, successResponse } from "../utils/returnResponse.js";
dotenv.config();

export const getUser = async (req, res) => {
  if (req.role !== "boss") {
    return errorResponse(res, 400, "Bạn không có quyền thực hiện");
  }

  try {
    const user = await findAllUser();
    user.password = undefined;
    return successResponse(
      res,
      200,
      user,
      "Lấy danh sách nhân viên thành công"
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const getOrderEmployee = async (req, res) => {
  // Xác định thời gian bắt đầu và kết thúc của ngày hôm nay
  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  const revenueData = await User.aggregate([
    {
      $lookup: {
        from: "orders", // Tên collection Order
        localField: "orders", // Mảng chứa ID đơn hàng trong Employee
        foreignField: "_id", // Trường _id trong Order
        as: "orderDetails", // Tên trường mới chứa chi tiết đơn hàng
        pipeline: [
          {
            $match: {
              createdAt: { $gte: start, $lte: end },
            },
          },
        ],
      },
    },
    {
      $addFields: {
        totalRevenue: { $sum: "$orderDetails.total" },
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        totalRevenue: 1,
      },
    },
  ]).sort({ totalRevenue: -1 });

  return successResponse(res, 200, revenueData);
};

export const changePassword = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const data = await User.findOneAndUpdate(
      { email: req.body.email },
      { password: hashedPassword },
      { new: true }
    );

    if (data) {
      return successResponse(res, 200, data);
    }
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra");
  }
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true }
    );
    data.password = undefined;
    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.role !== "boss") {
      return errorResponse(res, 201, "Bạn không có quyền làm tác vụ này");
    }
    const { id } = req.params;

    const user = await User.findOne({_id: id});
    if (user.orders.length !== 0) {
      // Cập nhật orders của Boss
      await User.findByIdAndUpdate(
        process.env.BOSS,
        {
          $addToSet: {
            orders: { $each: user.orders }, // Thêm tất cả orders của user vào mảng orders của Boss
          },
        },
        { new: true } // Trả về tài liệu mới sau khi cập nhật
      );

      // Cập nhật trường employee trong từng order từ user._id thành process.env.BOSS
      await Order.updateMany(
        { _id: { $in: user.orders }, employee: user._id }, // Tìm các order có id trong mảng user.orders và employee là user._id
        { $set: { employee: process.env.BOSS } } // Cập nhật employee thành process.env.BOSS
      );
    }

    const data = await User.findByIdAndDelete(id);

    if (data) {
      return successResponse(res, 200, data, "Xóa thành công");
    }
  } catch (error) {
    console.log(error);
  }
};
