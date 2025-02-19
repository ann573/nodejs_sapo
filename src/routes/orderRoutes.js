import { Router } from "express";
import { createOrder, getOrder,getOrdersToday,getTotal,getOrderById } from "./../controllers/orderControllers.js";
import { checkUser } from "./../middleware/checkUer.js";

const orderRoutes = Router();

orderRoutes.use("*", checkUser);


orderRoutes.post("/", createOrder);
orderRoutes.get("/", getOrder);

orderRoutes.get("/:id", getOrderById);

orderRoutes.get("/total", getTotal);
orderRoutes.get("/today", getOrdersToday);
 
export default orderRoutes;
 