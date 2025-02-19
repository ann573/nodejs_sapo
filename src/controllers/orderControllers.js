import moment from "moment";
import Order from "../models/order.js";
import { postOrder, fetchOrder } from "../services/orderService.js";
import { errorResponse, successResponse } from "./../utils/returnResponse.js";
import mongoose from "mongoose";

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

export const getOrderById = async (req, res) => {
  try {
    let {id} = req.params

    id = new mongoose.Types.ObjectId(id)
    const data = await Order.findById(id).populate([
      { path: "customer",
        select: "name telephone"
       },
      { path: "employee",
        select: "name role"
       }
    ]).lean();
    

    return successResponse(res, 200, data)
  } catch (error) {
    console.log(error);
    errorResponse(res, 500);
  }
}

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
        $addFields: {
          productsArray: { $ifNull: ["$products", []] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: {
              $sum: {
                $map: {
                  input: "$productsArray",
                  as: "product",
                  in: {
                    $multiply: ["$$product.price", "$$product.quantity"],
                  },
                },
              },
            },
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
    const totalOrders = await Order.countDocuments(req.role === "boss" ? {} : {employee: req.id});
    return successResponse(res, 200, totalOrders)
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra khi lấy thông tin");
  }
};
