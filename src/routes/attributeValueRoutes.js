import { Router } from "express";
import {
  getAllAttributeValue,
  createAttributeValue,
  removeAttributeValue
} from "../controllers/attributeValueControllers.js";

const AttributeValueRoutes = Router();

AttributeValueRoutes.get("/", getAllAttributeValue);
AttributeValueRoutes.post("/", createAttributeValue);

AttributeValueRoutes.delete("/:id", removeAttributeValue);

export default AttributeValueRoutes
