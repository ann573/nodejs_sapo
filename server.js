import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
dotenv.config()

const {PORT} = process.env

const app = express();

app.use(cors());

app.use(express.json());

connectDB();

app.use("/v1/api", routes);

app.listen(PORT, () => {
  console.log("Server is running on port 8888");
});
