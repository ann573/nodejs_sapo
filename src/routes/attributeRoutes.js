import { Router } from "express";
import {
  getAllAttribute,
  getAttributeById,
  createAttribute,
} from "../controllers/attributeControllers.js";

const attributeRoutes = Router();

attributeRoutes.get("/", getAllAttribute);
attributeRoutes.post("/", createAttribute);

attributeRoutes.get("/:id", getAttributeById);

export default attributeRoutes;
