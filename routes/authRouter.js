import { Router } from "express";
import rateLimiter from "express-rate-limit";

import { login, logout, register } from "../controllers/authController.js";

import {
  validateRegisterInput,
  validateLoginInput,
} from "../validation/userValidation.js";

const router = Router();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    msg: "Too many requests from this IP. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", apiLimiter, validateRegisterInput, register);

router.post("/login", apiLimiter, validateLoginInput, login);

router.get("/logout", logout);

export default router;
