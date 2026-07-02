/**
 * @file carry_with.controller.js
 * @description Controller for carry_with feature.
 */
import carryWithService from "./carry_with.service.js";
import logger from "../../utils/logger.utils.js";

export const getCarryWith = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{carry_with.controller} getCarryWith → request received",
    );
    const carryWithItems = await carryWithService.getCarryWithService();
    res.status(200).json({
      success: true,
      message: "Carry-with items fetched successfully",
      data: {
        carryWithItems,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createCarryWith = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{carry_with.controller} createCarryWith → request received",
    );
    const carryWithItem = await carryWithService.createCarryWithService(
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Carry-with item created successfully",
      data: {
        carryWithItem,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateCarryWith = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{carry_with.controller} updateCarryWith → request received for ID: ${id}`,
    );
    const carryWithItem = await carryWithService.updateCarryWithService(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Carry-with item updated successfully",
      data: {
        carryWithItem,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCarryWith = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{carry_with.controller} deleteCarryWith → request received for ID: ${id}`,
    );
    const carryWithItem = await carryWithService.deleteCarryWithService(id);
    res.status(200).json({
      success: true,
      message: "Carry-with item deleted successfully",
      data: {
        carryWithItem,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getCarryWith,
  createCarryWith,
  updateCarryWith,
  deleteCarryWith,
};
