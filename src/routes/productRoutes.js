import { Router } from "express";
import {
  createProducts,
  getAllProduct,
  updateProducts,
  removeProducts,
  searchProducts,
  getProductByID,
  getTotalProducts
} from "../controllers/productController.js";
import { checkUser } from "./../middleware/checkUer.js";
import { getProductVariant } from "../controllers/variantControllers.js";

export const productRoutes = Router();

productRoutes.get("/", getAllProduct);

productRoutes.use("*", checkUser);
productRoutes.get("/total", getTotalProducts);
productRoutes.post("/", createProducts);
productRoutes.patch("/:id", updateProducts);
productRoutes.delete("/:id", removeProducts);
productRoutes.get("/search", searchProducts);
productRoutes.get("/single/:id", getProductByID);
productRoutes.get("/:productId", getProductVariant);
