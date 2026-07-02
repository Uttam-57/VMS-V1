/**
 * @file visitor_type.routes.js
 * @description Routes definition for visitor_type feature.
 */
import { Router } from "express";
import visitorTypeController from "./visitor_type.controller.js";

const router = Router();

router.get("/", visitorTypeController.getVisitorType);
router.post("/", visitorTypeController.createVisitorType);
router.put("/:id", visitorTypeController.updateVisitorType);
router.delete("/:id", visitorTypeController.deleteVisitorType);

export default router;
