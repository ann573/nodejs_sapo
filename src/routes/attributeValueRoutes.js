import { Router } from "express";
import {
  getAllAttributeValue,
  createAttributeValue,
  removeAttributeValue,
  getAttributeValueById,
  editAttributeValueById
} from "../controllers/attributeValueControllers.js";
import { checkUser } from "../middleware/checkUer.js";

const AttributeValueRoutes = Router();

AttributeValueRoutes.use("*", checkUser)


AttributeValueRoutes.get("/", getAllAttributeValue);
AttributeValueRoutes.post("/", createAttributeValue);

AttributeValueRoutes.get("/:id", getAttributeValueById);
AttributeValueRoutes.patch("/:id", editAttributeValueById);
AttributeValueRoutes.delete("/:id", removeAttributeValue);

export default AttributeValueRoutes
