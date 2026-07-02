/**
 * @file purpose.controller.js
 * @description Controller for purpose feature.
 */
import purposeService from "./purpose.service.js";
import logger from "../../utils/logger.utils.js";

export const getPurpose = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{purpose.controller} getPurpose → request received",
    );
    const purposes = await purposeService.getPurposeService();
    res.status(200).json({
      success: true,
      message: "Purposes fetched successfully",
      data: {
        purposes,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createPurpose = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{purpose.controller} createPurpose → request received",
    );
    const purpose = await purposeService.createPurposeService(req.body);
    res.status(201).json({
      success: true,
      message: "Purpose created successfully",
      data: {
        purpose,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updatePurpose = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{purpose.controller} updatePurpose → request received for ID: ${id}`,
    );
    const purpose = await purposeService.updatePurposeService(id, req.body);
    res.status(200).json({
      success: true,
      message: "Purpose updated successfully",
      data: {
        purpose,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deletePurpose = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{purpose.controller} deletePurpose → request received for ID: ${id}`,
    );
    const purpose = await purposeService.deletePurposeService(id);
    res.status(200).json({
      success: true,
      message: "Purpose deleted successfully",
      data: {
        purpose,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default { getPurpose, createPurpose, updatePurpose, deletePurpose };
