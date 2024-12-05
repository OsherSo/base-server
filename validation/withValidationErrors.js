import { validationResult } from "express-validator";

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";

const withValidationErrors = (validateValues) => [
  validateValues,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      if (errorMessages[0].startsWith("no job")) {
        throw new NotFoundError(errorMessages);
      }
      if (errorMessages[0].startsWith("not authorized")) {
        throw new UnauthorizedError("not authorized to access this route");
      }
      throw new BadRequestError(errorMessages);
    }
    next();
  },
];

export default withValidationErrors;
