import bcrypt from "bcryptjs";
import { findOneUser, postUser } from "../services/userService.js";
import { errorResponse, successResponse } from "../utils/returnResponse.js";

import { generateAccessToken, generateRefreshToken } from "./../utils/jwt.js";
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config()

const {REFRESH_TOKEN_SECRET} = process.env
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

    const data = { _id: user._id, role: user.role, name: user.name };

    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });

    successResponse(res, 200, { accessToken, user: data });
  } catch (error) {
    console.log(error);
    errorResponse(res, 500, "Có lỗi xảy ra, vui lòng thử lại sau");
  }
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return errorResponse(res, 401, "Chưa xác thực");

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken({ 
      _id: user._id,
      role: user.role,
      name: user.name,
    });



    successResponse(res, 200, { accessToken});
  });
};
