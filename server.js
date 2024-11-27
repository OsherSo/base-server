import "express-async-errors";
import * as dotenv from "dotenv";

import { fileURLToPath } from "url";
import path, { dirname } from "path";

import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import mongoSanitize from "express-mongo-sanitize";

import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

import { authenticateUser } from "./middleware/authMiddleware.js";

const BASE_PORT = 5100;
const FAIL_STATUS = 1;

dotenv.config();
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: "Not Found!" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || BASE_PORT;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}...`);
  });
} catch (error) {
  console.error(error);
  process.exit(FAIL_STATUS);
}
