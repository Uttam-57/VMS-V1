/**
 * @file employee.controller.js
 * @description Controller for employee feature.
 */
import employeeService from "./employee.service.js";
import logger from "../../utils/logger.utils.js";

export const getEmployee = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{employee.controller} getEmployee → request received",
    );
    const employees = await employeeService.getEmployeeService();
    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: {
        employees,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{employee.controller} createEmployee → request received",
    );
    const employee = await employeeService.createEmployeeService(req.body);
    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: {
        employee,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{employee.controller} updateEmployee → request received for ID: ${id}`,
    );
    const employee = await employeeService.updateEmployeeService(id, req.body);
    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: {
        employee,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{employee.controller} deleteEmployee → request received for ID: ${id}`,
    );
    const employee = await employeeService.deleteEmployeeService(id);
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: {
        employee,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const checkEmail = async (req, res, next) => {
  try {
    const { email, excludeId } = req.query;
    const exists = await employeeService.checkEmailService(email, excludeId);
    res.status(200).json({
      success: true,
      data: { exists }
    });
  } catch (err) {
    next(err);
  }
};

export default { getEmployee, createEmployee, updateEmployee, deleteEmployee, checkEmail };
