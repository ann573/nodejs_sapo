import { Router } from "express";
import { createOrder, getOrder,getOrdersToday } from "./../controllers/orderControllers.js";
import { checkUser } from "./../middleware/checkUer.js";

const orderRoutes = Router();

orderRoutes.use("*", checkUser);

orderRoutes.post("/", createOrder);
orderRoutes.get("/", getOrder);
orderRoutes.get("/today", getOrdersToday);

export default orderRoutes;
