import mongoose from "mongoose";
import User from "./../models/user.js";
import dotenv from "dotenv";
dotenv.config();
export const findOneUser = async (query) => {
  try {
    return await User.findOne(query);
  } catch (error) {
    console.log(error);
  }
};

export const postUser = async (body) => {
  try {
    return await User.create(body);
  } catch (error) {
    console.log(error);
  }
};

export const findAllUser = async () => {
  try {
    return await User.find({ role: { $ne: "boss" } });
  } catch (error) {
    console.log(error);
  }
};

export const AddOrder = async (idUser, idOrder) => {
  try {
    const objectId = new mongoose.Types.ObjectId(process.env.BOSS);
    await User.findByIdAndUpdate(idUser, {
      $addToSet: { orders: idOrder },
    });
    await User.findByIdAndUpdate(objectId, {
      $addToSet: { orders: idOrder },
    });
  } catch (error) {
    console.log(error);
  }
};
