import { Router } from "express";
import { checkUser } from './../middleware/checkUer.js';
import {
  getAllAttribute,
  getAttributeById,
  createAttribute,
  deleteAttribute,
} from "../controllers/attributeControllers.js";

const attributeRoutes = Router();

attributeRoutes.use("*", checkUser)

attributeRoutes.get("/", getAllAttribute);
attributeRoutes.post("/", createAttribute);

attributeRoutes.get("/:id", getAttributeById);
attributeRoutes.delete("/:id", deleteAttribute);

export default attributeRoutes;
