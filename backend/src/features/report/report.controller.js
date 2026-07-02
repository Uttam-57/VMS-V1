/**
 * @file report.controller.js
 * @description Controller for report feature.
 */
import reportService from "./report.service.js";
import logger from "../../utils/logger.utils.js";

export const getReport = async (req, res, next) => {
  try {
    const { startDate, endDate, status, ...otherFilters } = req.query || {};
    let filters = { ...otherFilters };

    if (status && status !== "All") {
      filters.status = status;
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) {
        filters.createdAt.gte = new Date(`${startDate}T00:00:00.000Z`);
      }
      if (endDate) {
        filters.createdAt.lte = new Date(`${endDate}T23:59:59.999Z`);
      }
    }

    const passes = await reportService.getReportPassesService(filters);
    logger.info(
      `[Report Controller] Successfully fetched ${passes.length} passes for report`,
    );
    return res.status(200).json({
      success: true,
      data: passes,
    });
  } catch (err) {
    next(err);
  }
};

export default { getReport };
