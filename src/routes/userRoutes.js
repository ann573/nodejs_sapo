import { Router } from "express";
import { register, login } from "../controllers/authControllers.js";
import { checkUser } from "../middleware/checkUer.js";
import { getUser } from './../controllers/userController.js';

const userRoutes = Router();

userRoutes.post("/login", login);

userRoutes.use("*", checkUser)

userRoutes.post("/register", register);
userRoutes.get("/employee", getUser);

export default userRoutes;
