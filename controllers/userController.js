import { StatusCodes } from "http-status-codes";

import User from "../models/UserModel.js";
import { UnauthorizedError } from "../errors/customErrors.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userWithoutPassword = user.toJSON();

  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const updateUser = async (req, res) => {
  const { username } = req.body;

  const user = await User.findById(req.user.userId);
  if (username) user.username = username;
  await user.save();
  const userWithoutPassword = user.toJSON();

  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.userId);

  const isPasswordCorrect = await comparePassword(
    currentPassword,
    user.password,
  );
  if (!isPasswordCorrect) {
    throw new UnauthorizedError("Invalid current password");
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};
