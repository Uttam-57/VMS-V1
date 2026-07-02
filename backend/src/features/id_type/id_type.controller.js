/**
 * @file id_type.controller.js
 * @description Controller for id_type feature.
 */
import idTypeService from "./id_type.service.js";
import logger from "../../utils/logger.utils.js";

export const getIdType = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{id_type.controller} getIdType → request received",
    );
    const idType = await idTypeService.getIdTypeService();
    res.status(200).json({
      success: true,
      message: "ID type fetched successfully",
      data: {
        idType,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createIdType = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{id_type.controller} createIdType → request received",
    );
    const idType = await idTypeService.createIdTypeService(req.body);
    res.status(201).json({
      success: true,
      message: "ID type created successfully",
      data: {
        idType,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateIdType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{id_type.controller} updateIdType → request received for ID: ${id}`,
    );
    const idType = await idTypeService.updateIdTypeService(id, req.body);
    res.status(200).json({
      success: true,
      message: "ID type updated successfully",
      data: {
        idType,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteIdType = async (req, res, next) => {
  try {
    const id = req.params.id;
    logger.info(
      `[CONTROLLER]{id_type.controller} deleteIdType → request received for ID: ${id}`,
    );
    const idType = await idTypeService.deleteIdTypeService(id);
    res.status(200).json({
      success: true,
      message: "ID type deleted successfully",
      data: {
        idType,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default { getIdType, createIdType, updateIdType, deleteIdType };
