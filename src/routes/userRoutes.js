import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  sendOTP,
  verifyOTP,
  verifyEmail,
} from "../controllers/authControllers.js";
import { checkUser } from "../middleware/checkUer.js";
import { getUser, getOrderEmployee,changePassword, editUser, deleteUser } from "./../controllers/userController.js";

const userRoutes = Router();

userRoutes.post("/login", login);
userRoutes.post("/refresh-token", refreshToken);

userRoutes.get("/verify-email", verifyEmail);
userRoutes.patch("/change_password", changePassword);


userRoutes.post("/send-otp", sendOTP);
userRoutes.post("/verify-otp", verifyOTP);

userRoutes.use("*", checkUser);

userRoutes.post("/register", register);

userRoutes.get("/employee", getUser);

userRoutes.get("/order-employee", getOrderEmployee);
userRoutes.delete("/:id", deleteUser);
userRoutes.patch("/:id", editUser);


export default userRoutes;
