import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

import { findOneUser, postUser } from "../services/userService.js";
import { errorResponse, successResponse } from "../utils/returnResponse.js";

import { generateAccessToken, generateRefreshToken } from "./../utils/jwt.js";

import { emailHtml, emailOTP } from "../lib/constant.js";
dotenv.config();

const {
  REFRESH_TOKEN_SECRET,
  EMAIL_USER,
  EMAIL_PASS,
  URL_FRONTEND,
  EMAIL_TOKEN_SECRET,
} = process.env;

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const otpStore = {};
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const isExist = await findOneUser({ email });
    if (isExist) return errorResponse(res, 400, "Email đã tồn tại");

    const hashedPassword = bcrypt.hashSync(password, 8);

    const emailToken = jwt.sign(
      { name, email, password: hashedPassword },
      EMAIL_TOKEN_SECRET,
      { expiresIn: "5m" } //
    );

    const verificationLink = `${URL_FRONTEND}/verify-email/${emailToken}`;

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: "Xác thực tài khoản",
      html: emailHtml(verificationLink),
    };

    await transporter.sendMail(mailOptions);
    return successResponse(
      res,
      200,
      {},
      "Vui lòng kiểm tra email để xác thực tài khoản."
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Có lỗi xảy ra vui lòng thử lại sau.");
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

    return successResponse(res, 200, { accessToken, user });
  } catch (error) {
    console.log(error);
    return errorResponse(res, 500, "Có lỗi xảy ra, vui lòng thử lại sau");
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

    const data = { _id: user._id, role: user.role, name: user.name };

    successResponse(res, 200, { accessToken, user: data });
  });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    if (!token) return errorResponse(res, 400, "Token không hợp lệ");

    // Giải mã token
    const decoded = jwt.verify(token, EMAIL_TOKEN_SECRET);

    // Kiểm tra nếu tài khoản đã tồn tại
    const isExist = await findOneUser({ email: decoded.email });
    if (isExist) return errorResponse(res, 400, "Email đã tồn tại");

    // Tạo tài khoản mới trong DB
    const user = await postUser({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
    });

    return successResponse(
      res,
      200,
      user,
      "Tài khoản đã được xác thực thành công."
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 400, "Link xác thực đã hết hạn.");
    }
    console.error(error);
    return errorResponse(res, 500, "Có lỗi xảy ra, vui lòng thử lại sau.");
  }
};

// API Gửi OTP qua Email
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Vui lòng cung cấp email hợp lệ." });
  }

  const isExist = await findOneUser({ email });
  if (!isExist) return errorResponse(res, 400, "Email không tồn tại");

  const otp = crypto.randomInt(100000, 999999).toString();

  otpStore[email] = otp;

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Mã OTP xác thực",
    html: emailOTP(otp),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Mã OTP đã được gửi tới email của bạn." });
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
    res.status(500).json({ message: "Không thể gửi OTP, vui lòng thử lại." });
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    return successResponse(res, 200, {}, "Xác thực OTP thành công");
  } else {
    return errorResponse(res, 400, "Mã OTP không chính xác hoặc đã hết hạn.");
  }
};
