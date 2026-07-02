/**
 * @file company_register.controller.js
 * @description Controller for company_register feature.
 */
import companyRegisterService from "./company_register.service.js";
import logger from "../../utils/logger.utils.js";

export const getCompanyRegister = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{company_register.controller} getCompanyRegister → request received",
    );
    const companyRegister =
      await companyRegisterService.getCompanyRegisterService();
    res.status(200).json({
      success: true,
      message: companyRegister
        ? "Company registration fetched successfully"
        : "No company registration on file",
      data: {
        companyRegister: companyRegister ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateCompanyRegister = async (req, res, next) => {
  try {
    logger.info(
      "[CONTROLLER]{company_register.controller} updateCompanyRegister → request received",
    );
    const companyRegister =
      await companyRegisterService.upsertCompanyRegisterService(
        req.body,
        req.file,
      );
    res.status(200).json({
      success: true,
      message: "Company registration updated successfully",
      data: {
        companyRegister,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default { getCompanyRegister, updateCompanyRegister };
