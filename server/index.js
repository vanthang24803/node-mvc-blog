import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

config();
const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.get("/api/v1", (request, response) => {
  response.status(200).json("Hello World");
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database Connected !");
  } catch (error) {
    console.log(error);
  }
};

connect();

app.listen(port, () => {
  console.log(`Server listing in port ${port}`);
});
