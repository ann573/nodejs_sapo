import { Router } from "express";
import {
  getProductVariant,
  createVariant,
} from "../controllers/variantControllers.js";

const variantRoutes = Router();

variantRoutes.get("/:productId", getProductVariant);

variantRoutes.post("/", createVariant);

export default variantRoutes;
