import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
import cookieParser from "cookie-parser";
dotenv.config()

const {PORT} = process.env

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Domain frontend
    credentials: true, // Cho phép gửi cookie
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser());

app.use(express.json());

connectDB();

app.use("/v1/api", routes);

app.listen(PORT, () => {
  console.log("Server is running on port 8888");
});
