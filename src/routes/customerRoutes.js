import { Router } from "express";
import {
  getAllCustomer,
  getCustomerById,
  createCustomer,
  updateCustomer,
  searchCustomer
} from "../controllers/customerControllers.js";

const customerRoutes = Router();

customerRoutes.get("/", getAllCustomer);
customerRoutes.get("/search", searchCustomer);
customerRoutes.get("/:id", getCustomerById);
customerRoutes.post("/", createCustomer);
customerRoutes.patch("/:id", updateCustomer);

export default customerRoutes;
