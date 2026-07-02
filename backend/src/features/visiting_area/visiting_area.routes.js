/**
 * @file visiting_area.routes.js
 * @description Routes definition for visiting_area feature.
 */
import { Router } from "express";
import visitingAreaController from "./visiting_area.controller.js";

const router = Router();

router.get("/", visitingAreaController.getVisitingArea);
router.post("/", visitingAreaController.createVisitingArea);
router.put("/:id", visitingAreaController.updateVisitingArea);
router.delete("/:id", visitingAreaController.deleteVisitingArea);

export default router;
