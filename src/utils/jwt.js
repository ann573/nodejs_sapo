import jwt from "jsonwebtoken";

import  dotenv  from 'dotenv';
dotenv.config()

const {PRIVATE_KEY, REFRESH_TOKEN_SECRET} = process.env


export const generateAccessToken = (payload) => {
  return jwt.sign(payload, PRIVATE_KEY, { expiresIn: "1h" });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};