/**
 * @file gp.routes.js
 * @description Routes definition for gate_pass feature.
 */
// import { Router } from "express";
// import multer from "multer";
// import { handleFormSubmission } from "../capture/formcontroller.js";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule
      ? mod
      : {
          default: mod,
        };
  };

// const router = Router();
// // Configure Multer for Memory Storage (provides file.buffer)
// const upload = multer({
//   storage: multer.memoryStorage(),
//   // limits: { fileSize: 10 * 1024 * 1024 } // Optional: 5MB limit
// });
// // Use 'photo' as the field name to match your frontend
// router.post('/upload', upload.single('photo'), handleFormSubmission);
// export default router;
import express from "express";
import multer from "multer";
import gp_controller from "../gate_pass/gp.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
const router = express.Router();
// Memory storage — file.buffer is available in the controller/service
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  }, // 10 MB per file
});
/**
 * Accept:
 *   - "photo"         — the single webcam capture (required)
 *   - "aadharFile_N"  — one file per person (optional, up to 20 persons)
 *
 * Using upload.fields() so multer collects all files into req.files (an object),
 * while req.body still carries every text/JSON field.
 */
router.post(
  "/upload",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    ...Array.from(
      {
        length: 20,
      },
      (_, i) => ({
        name: `aadharFile_${i}`,
        maxCount: 1,
      }),
    ),
  ]),
  gp_controller.handleFormSubmission,
);

import { requirePermission } from "../../middleware/permission.middleware.js";

router.get(
  "/dashboard/data",
  protect,
  requirePermission("dashboard"),
  gp_controller.getDashboardData,
);
router.get(
  "/dashboard/stream",
  protect,
  requirePermission("dashboard"),
  gp_controller.getDashboardStream,
);
router.get("/visitor/:mobileNo", protect, gp_controller.getVisitorByMobile);
router.get(
  "/",
  protect,
  requirePermission("dashboard"),
  gp_controller.getPasses,
);
router.get("/:id", protect, gp_controller.getPassById);
router.patch(
  "/:id/status",
  protect,
  requirePermission("dashboard"),
  gp_controller.updatePassStatus,
);
router.delete(
  "/:id",
  protect,
  requirePermission("dashboard"),
  gp_controller.deletePass,
);

export default router;
