/**
 * @file visiting_area.controller.js
 * @description Controller for visiting_area feature.
 */
import visitingAreaService from "./visiting_area.service.js";
import logger from "../../utils/logger.utils.js";

export const getVisitingArea = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{visiting_area.controller} getVisitingArea → request received",
    );
    const visitingAreas = await visitingAreaService.getVisitingAreaService();
    res.status(200).json({
      success: true,
      message: "Visiting areas fetched successfully",
      data: {
        visitingAreas,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createVisitingArea = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{visiting_area.controller} createVisitingArea → request received",
    );
    const visitingArea = await visitingAreaService.createVisitingAreaService(
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Visiting area created successfully",
      data: {
        visitingArea,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateVisitingArea = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{visiting_area.controller} updateVisitingArea → request received for ID: ${id}`,
    );
    const visitingArea = await visitingAreaService.updateVisitingAreaService(
      id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Visiting area updated successfully",
      data: {
        visitingArea,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVisitingArea = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{visiting_area.controller} deleteVisitingArea → request received for ID: ${id}`,
    );
    const visitingArea =
      await visitingAreaService.deleteVisitingAreaService(id);
    res.status(200).json({
      success: true,
      message: "Visiting area deleted successfully",
      data: {
        visitingArea,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getVisitingArea,
  createVisitingArea,
  updateVisitingArea,
  deleteVisitingArea,
};
