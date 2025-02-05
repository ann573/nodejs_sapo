import { findOneUser, postUser } from "../services/userService.js";
import { errorResponse, successResponse } from "../utils/returnResponse.js";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const register = async (req, res) => {
  try {
    let { email, password, name } = req.body;
    const isExist = await findOneUser({ email });
    if (isExist) {
      return errorResponse(res, 400, "Tài khoản đã tồn tại");
    } else {
      password = bcrypt.hashSync(password, 8);

      const data = await postUser({ email, password, name });
      if (data) return successResponse(res, 200, data);
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Có lỗi xảy ra vui lòng thử lại sau");
  }
};

export const login = async (req, res) => {
  try {
    const user = await findOneUser({ email: req.body.email });
    if (!user) {
      return errorResponse(res, 404, "Email không tồn tại");
    }
    const result = bcrypt.compareSync(req.body.password, user.password);
    if (!result) {
      return errorResponse(res, 400, "Mật khẩu không đúng");
    }

    user.password = undefined;

    const accessToken = jwt.sign(
      { _id: user._id, role: user.role, name: user.name },
      process.env.PRIVATE_KEY,
      { expiresIn: "1d" }
    );

    successResponse(res, 200, { accessToken, user });
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Có lỗi xảy ra, vui lòng thử lại sau");
  }
};
