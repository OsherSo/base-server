import { StatusCodes } from "http-status-codes";

import User from "../models/UserModel.js";

import { UnauthenticatedError } from "../errors/customErrors.js";

import { createJWT } from "../utils/tokenUtils.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";

const ONE_DAY = 1000 * 60 * 60 * 24;

export const register = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  await User.create(req.body);

  res.status(StatusCodes.CREATED).json({ msg: "User created successfully" });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));

  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");

  const token = createJWT({ userId: user._id, role: user.role });

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
    secure: process.env.NODE_ENV === "production",
  });

  res.status(StatusCodes.OK).json({ msg: "User logged in" });
};

export const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};