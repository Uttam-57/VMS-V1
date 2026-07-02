/**
 * @file role.routes.js
 * @description Routes definition for role feature.
 */
import express from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "./role.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/permission.middleware.js";

const router = express.Router();

router.use(protect); // Ensure user is authenticated
router.use(requirePermission("user_management")); // Ensure user has permission
router.route("/").get(getRoles).post(createRole);

router.route("/:id").get(getRoleById).put(updateRole).delete(deleteRole);

export default router;
