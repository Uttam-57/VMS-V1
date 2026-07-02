/**
 * @file visitor_type.controller.js
 * @description Controller for visitor_type feature.
 */
import visitorTypeService from "./visitor_type.service.js";
import logger from "../../utils/logger.utils.js";

export const getVisitorType = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{visitor_type.controller} getVisitorType → request received",
    );
    const visitorTypes = await visitorTypeService.getVisitorTypeService();
    res.status(200).json({
      success: true,
      message: "Visitor types fetched successfully",
      data: {
        visitorTypes,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createVisitorType = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{visitor_type.controller} createVisitorType → request received",
    );
    const visitorType = await visitorTypeService.createVisitorTypeService(
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Visitor type created successfully",
      data: {
        visitorType,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateVisitorType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{visitor_type.controller} updateVisitorType → request received for ID: ${id}`,
    );
    const visitorType = await visitorTypeService.updateVisitorTypeService(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Visitor type updated successfully",
      data: {
        visitorType,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVisitorType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{visitor_type.controller} deleteVisitorType → request received for ID: ${id}`,
    );
    const visitorType = await visitorTypeService.deleteVisitorTypeService(id);
    res.status(200).json({
      success: true,
      message: "Visitor type deleted successfully",
      data: {
        visitorType,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getVisitorType,
  createVisitorType,
  updateVisitorType,
  deleteVisitorType,
};
