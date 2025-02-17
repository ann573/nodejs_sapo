import { Router } from "express";
import {
  createProducts,
  getAllProduct,
  updateProducts,
  removeProducts,
  searchProducts,
  getProductByID
} from "../controllers/productController.js";
import { checkUser } from "./../middleware/checkUer.js";
import { getProductVariant } from "../controllers/variantControllers.js";

export const productRoutes = Router();

productRoutes.get("/", getAllProduct);

productRoutes.use("*", checkUser);
productRoutes.post("/", createProducts);
productRoutes.patch("/:id", updateProducts);
productRoutes.delete("/:id", removeProducts);
productRoutes.get("/search", searchProducts);
productRoutes.get("/:productId", getProductVariant);
