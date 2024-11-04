import bcrypt from "bcryptjs";

const ROUNDS = 10;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);

  return isMatch;
};
