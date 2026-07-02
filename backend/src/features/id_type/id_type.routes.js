/**
 * @file id_type.routes.js
 * @description Routes definition for id_type feature.
 */
import { Router } from "express";
import idTypeController from "./id_type.controller.js";

const router = Router();

router.get("/", idTypeController.getIdType);
router.post("/", idTypeController.createIdType);
router.put("/:id", idTypeController.updateIdType);
router.delete("/:id", idTypeController.deleteIdType);

export default router;
