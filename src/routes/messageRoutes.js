import express from "express";
import { getUserForSidebar, getMessages, sendMessages } from "../controllers/messageController.js";
import { checkUser } from "./../middleware/checkUer.js";

const messageRoutes = express.Router();

messageRoutes.get("/users", checkUser, getUserForSidebar);
messageRoutes.get("/:id", checkUser, getMessages);

messageRoutes.post("/send/:id", checkUser, sendMessages);
export default messageRoutes;
