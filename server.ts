import express, { Application } from "express";
import connectDB from "./src/database/connection";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import userRoute from "./src/routes/user";

dotenv.config({ path: "config.env" });

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 8080;

connectDB();

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(userRoute);

const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
