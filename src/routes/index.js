import { Router } from "express";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRoutes.js";
import { productRoutes } from "./productRoutes.js";
import customerRoutes from "./customerRoutes.js";

const routes = Router();

routes.use("/orders", orderRoutes);
routes.use("/users", userRoutes);
routes.use("/products", productRoutes)
routes.use("/customers", customerRoutes)
export default routes;
