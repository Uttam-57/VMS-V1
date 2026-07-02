/**
 * @file report.service.js
 * @description Service for report feature.
 */
import db from "../../config/db.js";
import logger from "../../utils/logger.utils.js";

export const getReportPassesService = async (filters = {}) => {
  try {
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.createdAt) {
      where.createdAt = {};
      if (filters.createdAt.gte) {
        where.createdAt.gte = new Date(filters.createdAt.gte);
      }
      if (filters.createdAt.lte) {
        where.createdAt.lte = new Date(filters.createdAt.lte);
      }
    }

    const passes = await db.formdata.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { persondetail: true },
    });

    const parseJsonField = (val) => {
      if (!val) return [];
      if (typeof val === "object") return val;
      try {
        return JSON.parse(val);
      } catch {
        return [];
      }
    };

    return passes.map((pass) => {
      const { persondetail, ...passRest } = pass;
      return {
        ...passRest,
        carryWith: parseJsonField(passRest.carryWith),
        visitArea: parseJsonField(passRest.visitArea),
        persons: persondetail,
      };
    });
  } catch (err) {
    logger.error(`getReportPassesService error: ${err.message}`);
    throw err;
  }
};

export default { getReportPassesService };
