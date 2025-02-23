import { endOfDay, startOfDay } from "date-fns";
import User from "../models/user.js";
import { findAllUser } from "../services/userService.js";
import { errorResponse, successResponse } from "../utils/returnResponse.js";

export const getUser = async (req, res) => {
  if (req.role !== "boss") {
    errorResponse(res, 400, "Bạn không có quyền thực hiện");
  }

  try {
    const user = await findAllUser();
    user.password = undefined
    successResponse(res, 200, user, "Lấy danh sách nhân viên thành công");
  } catch (error) {
    errorResponse(res, 500, "Có lỗi xảy ra");
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
