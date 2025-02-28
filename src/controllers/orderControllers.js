import moment from "moment";
import { startOfDay, endOfDay, subDays } from "date-fns";

import Order from "../models/order.js";
import { postOrder, fetchOrder } from "../services/orderService.js";
import { errorResponse, successResponse } from "./../utils/returnResponse.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {
    const order = { ...req.body, employee: req.id };
    const data = await postOrder(order);
    return successResponse(res, 201, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500);
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
    return errorResponse(res, 500);
  }
};

export const getOrderById = async (req, res) => {
  try {
    let { id } = req.params;

    id = new mongoose.Types.ObjectId(id);
    const data = await Order.findById(id)
      .populate([
        { path: "customer", select: "name telephone" },
        { path: "employee", select: "name role" },
      ])
      .lean();

    return successResponse(res, 200, data);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500);
  }
};

export const getOrdersToday = async (req, res) => {
  const startOfDay = moment().startOf("day").toDate();
  const endOfDay = moment().endOf("day").toDate();
  const employeeId = new mongoose.Types.ObjectId(req.id);
  try {
    const summary = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          ...(req.role === "boss" ? {} : { employee: employeeId }),
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$total",
          },
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
      return successResponse(res, 200, { totalAmount: 0, totalOrders: 0 });
    }

    return successResponse(res, 200, summary[0]);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Có lỗi xảy ra khi lấy thông tin");
  }
};

export const getTotal = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments(
      req.role === "boss" ? {} : { employee: req.id }
    );
    return successResponse(res, 200, totalOrders);
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra khi lấy thông tin");
  }
};

export const getOrderWeek = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 6);
    const endOfToday = endOfDay(new Date());

    const idEmployee = new mongoose.Types.ObjectId(req.id);
    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lte: endOfToday },
          ...(req.role === "boss" ? {} : { employee: idEmployee }),
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
          totalRevenue: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          totalRevenue: 1,
          orderCount: 1,
          _id: 0,
        },
      },
    ]);

    // Tạo mảng các ngày trong 7 ngày gần nhất
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, 6 - i); // Sử dụng subDays để tính toán ngày
      const formattedDate = `${String(date.getDate()).padStart(
        2,
        "0"
      )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
      dates.push(formattedDate);
    }

    const resultMap = result.reduce((acc, item) => {
      acc[item.date] = item;
      return acc;
    }, {});

    const filledResult = dates.map((date) => {
      const dayData = resultMap[date] || {
        date,
        totalRevenue: 0,
        orderCount: 0,
      };
      return dayData;
    });

    return successResponse(res, 200, filledResult);
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTopProducts = async (req, res) => {
  try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const topProducts = await Order.aggregate([
          { 
              $match: { 
                  createdAt: { $gte: oneWeekAgo } 
              } 
          },
          { 
              $unwind: "$products" 
          },
          { 
              $group: {
                  _id: "$products.name",
                  totalSold: { $sum: "$products.quantity" }
              } 
          },
          { 
              $sort: { totalSold: -1 } 
          },
          { 
              $limit: 3
          }
      ]);

      return successResponse(res, 200, topProducts)
  } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
  }
};

