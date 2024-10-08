// src/controller/user.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { IUser } from "../model/user";
import apiResponse from "../utils/apiResponse";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const login: any = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      apiResponse(res, 404, "User does not exist");
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      apiResponse(res, 401, "Invalid credentials");
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    apiResponse(res, 200, "Login successful", {
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        age: user.age,
      },
    });
  } catch (error: any) {
    apiResponse(res, 500, "An error occurred while logging in", {
      error: error.message,
    });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const validatePassword = (password: string): boolean => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*]/.test(password);
    const isLengthValid = password.length >= 8;

    return (
      hasLowerCase && hasUpperCase && hasNumber && hasSymbol && isLengthValid
    );
  };

  const { username, age, email, password } = req.body;

  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      apiResponse(res, 400, "Email is already registered.");
      return;
    }

    if (age <= 0) {
      apiResponse(res, 400, "Wrong put age.");
      return;
    }

    const checkPassword = validatePassword(password);
    if (!checkPassword) {
      apiResponse(
        res,
        400,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long."
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      age,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    apiResponse(res, 201, "User registered successfully.");
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const validationErrors: { [key: string]: string } = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      apiResponse(res, 400, "Validation error.", validationErrors);
      return;
    }
    console.error("Registration error: ", error);
    apiResponse(res, 500, "Internal server error.");
  }
};
