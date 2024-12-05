import { StatusCodes } from "http-status-codes";

import User from "../models/UserModel.js";

import { UnauthenticatedError } from "../errors/customErrors.js";

import { createJWT } from "../utils/tokenUtils.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";

const ONE_DAY = 1000 * 60 * 60 * 24;

export const register = async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await hashPassword(password);

  await User.create({
    username,
    password: hashedPassword,
    role: "user",
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Registration successful. Please log in.",
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  user.lastLogin = new Date();
  await user.save();

  const token = createJWT({
    userId: user._id,
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(StatusCodes.OK).json({
    msg: "Login successful",
  });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(StatusCodes.OK).json({
    msg: "Logout successful",
  });
};
