import { Router } from "express";
import {
  createVariant,
  getProductVariant,
  updateVariant
} from "../controllers/variantControllers.js";
import { checkUser } from "./../middleware/checkUer.js";

const variantRoutes = Router();

variantRoutes.use("*", checkUser);

variantRoutes.get("/:productId", getProductVariant);

variantRoutes.post("/", createVariant);
variantRoutes.patch("/update/:productId", updateVariant);
variantRoutes.post("/", createVariant);

export default variantRoutes;
