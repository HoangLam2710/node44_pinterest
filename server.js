import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rootRoutes from "./src/routers/root.router.js";

dotenv.config();

const port = 3001;

const app = express();

app.use(
  cors({
    origin: process.env.API_FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use(rootRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
