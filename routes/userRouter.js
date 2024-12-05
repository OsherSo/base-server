import { Router } from "express";

import {
  validateUpdateUserInput,
  validatePasswordUpdate,
} from "../validation/userValidation.js";
import {
  getCurrentUser,
  updateUser,
  updatePassword,
} from "../controllers/userController.js";

const router = Router();

router.get("/current-user", getCurrentUser);
router.patch("/update-user", validateUpdateUserInput, updateUser);
router.patch("/update-password", validatePasswordUpdate, updatePassword);

export default router;
