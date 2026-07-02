/**
 * @file user.routes.js
 * @description Routes definition for user feature.
 */
import express from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserApprovals,
  assignUserApprovals,
  migrateUserApprovals,
  checkEmail,
} from "./user.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/permission.middleware.js";

const router = express.Router();

router.use(protect); // Ensure user is authenticated
router.use(requirePermission("user_management")); // Ensure user has permission

router.get("/check-email", checkEmail);
router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

router.route("/:id/approvals").get(getUserApprovals).post(assignUserApprovals);

router.post("/:id/migrate-approvals", migrateUserApprovals);

export default router;
