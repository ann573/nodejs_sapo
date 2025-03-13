import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const { PORT, URL_FRONTEND } = process.env;

const app = express();


app.use(
  cors({
    origin: URL_FRONTEND, // Domain frontend
    credentials: true, // Cho phép gửi cookie
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  })
);

app.use(cookieParser())

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", URL_FRONTEND || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

connectDB();

app.use("/v1/api", routes);

app.listen(PORT, () => {
  console.log("Server is running on port 8888");
});
