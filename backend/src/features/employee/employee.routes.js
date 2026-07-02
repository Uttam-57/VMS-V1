/**
 * @file employee.routes.js
 * @description Routes definition for employee feature.
 */
import { Router } from "express";
import employeeController from "./employee.controller.js";

const router = Router();

router.get("/check-email", employeeController.checkEmail);
router.get("/", employeeController.getEmployee);
router.post("/", employeeController.createEmployee);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

export default router;
