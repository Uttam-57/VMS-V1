/**
 * @file validation.middleware.js
 * @description Middleware for middleware feature.
 */
import { z } from "zod";
import appError from "../utils/appError.js";
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof zod.ZodError) {
        const errorMessages = error.errors.map(
          (issue) => `${issue.path.join(".")} is ${issue.message}`,
        );
        return next(
          new appError(
            `Validation Error: ${errorMessages.join(", ")}`,
            400,
            "VALIDAION_ERROR",
          ),
        );
      }
      return next(new appError("Internal Server Error", 500, "SERVER_ERROR"));
    }
  };
};

export default { validate };

export { validate };
