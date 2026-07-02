/**
 * @file company_register.routes.js
 * @description Routes definition for company_register feature.
 */
import { Router } from "express";
import companyRegisterController from "./company_register.controller.js";
import { uploadMemory } from "../../middleware/upload.js";

const router = Router();

router.get("/", companyRegisterController.getCompanyRegister);
router.put(
  "/",
  uploadMemory.single("logo"),
  companyRegisterController.updateCompanyRegister,
);

export default router;
