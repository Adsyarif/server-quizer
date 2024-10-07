import { Router } from "express";
import { register } from "../controller/user";

const userRoute = Router();

userRoute.post("/api/register", register);

export default userRoute;
