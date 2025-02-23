import { Router } from "express";
import { checkUser } from './../middleware/checkUer.js';
import {
  getProductVariant,
  createVariant,
} from "../controllers/variantControllers.js";

const variantRoutes = Router();

variantRoutes.use("*", checkUser)

variantRoutes.get("/:productId", getProductVariant);

variantRoutes.post("/", createVariant);

export default variantRoutes;
