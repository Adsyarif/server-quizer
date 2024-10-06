import express, { Application } from "express";
import connectDB from "./database/connection";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config({ path: "config.env" });

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 8080;

connectDB();

app.use(bodyParser.json());

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
