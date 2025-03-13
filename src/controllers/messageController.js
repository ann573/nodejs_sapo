import { errorResponse, successResponse } from "../utils/returnResponse.js";
import User from "./../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "./../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } });
    successResponse(res, 200, filteredUsers);
  } catch (error) {
    errorResponse(res, 500, "Có lỗi!!!!!!!!!!!");

    console.log(error);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const senderId = req.id;

    const message = await Message.find({
      $or: [
        { senderId: senderId, receiverId: id },
        { senderId: id, receiverId: senderId },
      ],
    });
    return successResponse(res, 200, message);
  } catch (error) {
    errorResponse(res, 500, "Có lỗi!!!!!!!!!!!");
    console.log(error);
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;

    const senderId = req.id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // realtime function
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    successResponse(res, 201, newMessage);
  } catch (error) {
    console.log(error);
  }
};
