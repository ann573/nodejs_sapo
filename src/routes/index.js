import { Router } from "express";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRoutes.js";
import { productRoutes } from "./productRoutes.js";
import customerRoutes from "./customerRoutes.js";
import attributeRoutes from "./attributeRoutes.js";
import AttributeValueRoutes from "./attributeValueRoutes.js";
import variantRoutes from "./variantRoutes.js";
import messageRoutes from "./messageRoutes.js";

const routes = Router();

routes.use("/orders", orderRoutes);
routes.use("/users", userRoutes);
routes.use("/products", productRoutes);
routes.use("/customers", customerRoutes);
routes.use("/attributes", attributeRoutes);
routes.use("/attribute_value", AttributeValueRoutes);
routes.use("/variants", variantRoutes);
routes.use("/messages", messageRoutes);

export default routes;
