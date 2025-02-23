import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import crypto from "crypto"; 
import { findOneUser, postUser } from "../services/userService.js";
import { errorResponse, successResponse } from "../utils/returnResponse.js";

import { generateAccessToken, generateRefreshToken } from "./../utils/jwt.js";

import dotenv from "dotenv";
dotenv.config();

const { REFRESH_TOKEN_SECRET, EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: "Gmail", // Sử dụng Gmail, có thể thay đổi dịch vụ khác
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const otpStore =  {};
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

    successResponse(res, 200, { accessToken });
  });
};

// Cấu hình Nodemailer


// API Gửi OTP qua Email
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Vui lòng cung cấp email hợp lệ." });
  }

  // Tạo mã OTP ngẫu nhiên gồm 6 chữ số
  const otp = crypto.randomInt(100000, 999999).toString();

  // Lưu OTP vào bộ nhớ tạm
  otpStore[email] = otp;

  // Thiết lập nội dung email
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Mã OTP xác thực",
    text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
  };

  try {
    // Gửi email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Mã OTP đã được gửi tới email của bạn." });
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    res.status(500).json({ message: "Không thể gửi OTP, vui lòng thử lại." });
  }
};

// API Xác thực OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email]; // Xóa OTP sau khi xác thực thành công
    res.status(200).json({ message: "Xác thực OTP thành công." });
  } else {
    res
      .status(400)
      .json({ message: "Mã OTP không chính xác hoặc đã hết hạn." });
  }
};
