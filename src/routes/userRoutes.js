import { Router } from "express";
import { register, login, refreshToken, sendOTP,verifyOTP } from "../controllers/authControllers.js";
import { checkUser } from "../middleware/checkUer.js";
import { getUser, getOrderEmployee } from './../controllers/userController.js';

const userRoutes = Router();

userRoutes.post("/login", login);
userRoutes.post("/refresh-token", refreshToken);

userRoutes.use("*", checkUser)

userRoutes.post("/register", register);

userRoutes.get("/employee", getUser);  

userRoutes.get("/order-employee", getOrderEmployee);

userRoutes.post("/send-otp", sendOTP)
userRoutes.post("/verify-otp", verifyOTP)

export default userRoutes;
