import { Router } from "express";
import { createOrder, getOrder, getOrderById, getOrdersToday, getOrderWeek, getTopProducts, getTotal } from "./../controllers/orderControllers.js";
import { checkUser } from "./../middleware/checkUer.js";

const orderRoutes = Router();

orderRoutes.use("*", checkUser);


orderRoutes.post("/", createOrder);
orderRoutes.get("/", getOrder);


orderRoutes.get("/total", getTotal);
orderRoutes.get("/today", getOrdersToday);
orderRoutes.get("/week", getOrderWeek);
orderRoutes.get("/top", getTopProducts);


orderRoutes.get("/:id", getOrderById);
 

export default orderRoutes;
 