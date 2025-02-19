import mongoose from "mongoose";
import Order from "../models/order.js";
import { AddOrder } from "./userService.js";

export const postOrder = async (body) => {
  try {
    const data = await Order.create(body).populate([
      { path: "customer" },
      { path: "employee" }
    ])

    await AddOrder(data.employee,data._id)
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchOrder = async (limit, skip, idUser = "") => {
  try {

    const data = await Order.find(idUser === "" ? {} : { employee: new mongoose.Types.ObjectId(idUser) }).limit(limit).skip(skip).populate([
      { path: "customer" ,
        select: "name telephone"
      },
      { path: "employee",
        select: "name"
       }
    ]);
    return data
  } catch (error) {
    console.log(error);
  }
};
