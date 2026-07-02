/**
 * @file location.controller.js
 * @description Controller for location feature.
 */
import locationService from "./location.service.js";
import logger from "../../utils/logger.utils.js";

export const getLocation = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{location.controller} getLocation → request received",
    );
    const location = await locationService.getLocationService();
    res.status(200).json({
      success: true,
      message: "Location fetched successfully",
      data: {
        location,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createLocation = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{location.controller} createLocation → request received",
    );
    const location = await locationService.createLocationService(req.body);
    res.status(201).json({
      success: true,
      message: "Location created successfully",
      data: {
        location,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{location.controller} updateLocation → request received for ID: ${id}`,
    );
    const location = await locationService.updateLocationService(id, req.body);
    res.status(200).json({
      success: true,
      message: "Location updated successfully",
      data: {
        location,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteLocation = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{location.controller} deleteLocation → request received for ID: ${id}`,
    );
    const location = await locationService.deleteLocationService(id);
    res.status(200).json({
      success: true,
      message: "Location deleted successfully",
      data: {
        location,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default { getLocation, createLocation, updateLocation, deleteLocation };
