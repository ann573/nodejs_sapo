import { Router } from "express";
import { checkUser } from './../middleware/checkUer.js';
import {
  getProductVariant,
  createVariant,
  updateVariant
} from "../controllers/variantControllers.js";

const variantRoutes = Router();

variantRoutes.use("*", checkUser)

variantRoutes.get("/:productId", getProductVariant);

variantRoutes.post("/", createVariant);
variantRoutes.patch("/update/:productId", updateVariant);
variantRoutes.post("/", createVariant);

export default variantRoutes;
