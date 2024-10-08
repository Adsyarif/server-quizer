import { Router } from "express";
import { register, login } from "../controller/user";

const userRoute = Router();

userRoute.post("/api/register", register);
userRoute.post("/api/login", login);

export default userRoute;
