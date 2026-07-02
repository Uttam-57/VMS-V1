/**
 * @file purpose.routes.js
 * @description Routes definition for purpose feature.
 */
import { Router } from "express";
import purposeController from "./purpose.controller.js";

const router = Router();

router.get("/", purposeController.getPurpose);
router.post("/", purposeController.createPurpose);
router.put("/:id", purposeController.updatePurpose);
router.delete("/:id", purposeController.deletePurpose);

export default router;
