import moment from "moment";
import Order from "../models/order.js";
import { postOrder, fetchOrder } from "../services/orderService.js";
import { errorResponse, successResponse } from "./../utils/returnResponse.js";

export const createOrder = async (req, res) => {
  try {
    const order = { ...req.body, employee: req.id };
    const data = await postOrder(order);
    successResponse(res, 201, data);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};

export const getOrder = async (req, res) => {
  try {
    const limit = parseInt(req.query?.limit) || 10;
    const skip = parseInt(req.query?.skip) || 0;
    const orderList = await fetchOrder(
      limit,
      skip,
      req.role === "boss" ? undefined : req.id
    );
    return successResponse(res, 200, orderList);
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
};

export const getOrdersToday = async (req, res) => {
  if (req.role !== "boss") {
    return errorResponse(res, 400, "Bạn không có quyền thao tác");
  }

  const startOfDay = moment().startOf("day").toDate();
  const endOfDay = moment().endOf("day").toDate();

  try {
    const summary = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, 
          totalAmount: 1,
          totalOrders: 1,
        },
      },
    ]);

    if (summary.length === 0) {
      return res.status(200).json({ totalAmount: 0, totalOrders: 0 });
    }

    return successResponse(res, 200, summary[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Có lỗi xảy ra khi lấy thông tin" });
  }
};
