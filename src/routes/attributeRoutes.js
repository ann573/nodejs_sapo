import { Router } from "express";
import { checkUser } from './../middleware/checkUer.js';
import {
  getAllAttribute,
  getAttributeById,
  createAttribute,
} from "../controllers/attributeControllers.js";

const attributeRoutes = Router();

attributeRoutes.use("*", checkUser)

attributeRoutes.get("/", getAllAttribute);
attributeRoutes.post("/", createAttribute);

attributeRoutes.get("/:id", getAttributeById);

export default attributeRoutes;
