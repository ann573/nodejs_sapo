import mongoose from "mongoose";
import Order from "../models/order.js";
import { AddOrder } from "./userService.js";

export const postOrder = async (body) => {
  try {
    const data = (await Order.create(body)).populate("customer");

    await AddOrder(data.employee,data._id)
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fetchOrder = async (limit, skip, idUser = "") => {
  try {

    const data = await Order.find(idUser === "" ? {} : { employee: new mongoose.Types.ObjectId(idUser) }).limit(limit).skip(skip);
    return data
  } catch (error) {
    console.log(error);
  }
};

