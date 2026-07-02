/**
 * @file auth.routes.js
 * @description Routes definition for auth feature.
 */
import express from "express";
import authController from "./auth.controller.js";
import validation_middleware from "../../middleware/validation.middleware.js";
import auth_schema from "./auth.schema.js";
import auth_middleware from "../../middleware/auth.middleware.js";
import ratelimit_middleware from "../../middleware/ratelimit.middleware.js";
const router = express.Router();
router.post(
  "/register",
  ratelimit_middleware.authLimiter,
  validation_middleware.validate(auth_schema.registerSchema),
  authController.register,
);
router.post(
  "/login",
  ratelimit_middleware.authLimiter,
  validation_middleware.validate(auth_schema.loginSchema),
  authController.login,
);
router.get("/me", auth_middleware.protect, authController.getMe);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
export default router;
