/**
 * @file report.routes.js
 * @description Routes definition for report feature.
 */
import { Router } from "express";
import reportController from "./report.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/permission.middleware.js";

const router = Router();

router.use(protect);
router.use(requirePermission("reports"));

router.get("/", reportController.getReport);

export default router;
