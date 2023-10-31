import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connect from "./config/db.js";
import configureCloudinary from "./config/cloudinary.js";

import userRouter from "./router/userRouter.js";
import postRouter from "./router/postRouter.js";

config();
const app = express();
app.use(express.json());
app.use(cookieParser());
connect();

// Set up CORS options
const corsOptions = {
  origin: `${process.env.URL_CLIENT}`,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
configureCloudinary();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listing in port ${port}`);
});

app.get("/", (request, response) => {
  response.status(200).json("Hello World");
});

app.use(userRouter);
app.use(postRouter);
