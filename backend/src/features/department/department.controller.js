/**
 * @file department.controller.js
 * @description Controller for department feature.
 */
import departmentService from "./department.service.js";
import logger from "../../utils/logger.utils.js";

export const getDepartment = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{department.controller} getDepartment → request received",
    );
    const department = await departmentService.getDepartmentService();
    res.status(200).json({
      success: true,
      message: "Department fetched successfully",
      data: {
        department,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{department.controller} createDepartment → request received",
    );
    const department = await departmentService.createDepartmentService(
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: {
        department,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{department.controller} updateDepartment → request received for ID: ${id}`,
    );
    const department = await departmentService.updateDepartmentService(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: {
        department,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{department.controller} deleteDepartment → request received for ID: ${id}`,
    );
    const department = await departmentService.deleteDepartmentService(id);
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
      data: {
        department,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
