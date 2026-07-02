import { queryGet } from "@/shared/services/api";

/**
 * Report API — backend calls for visitor/pass report generation.
 * Used by: features/report/hooks/useReport
 */

export const fetchReportPasses = (startDate, endDate) => {
  const params = [];
  if (startDate) params.push(`startDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  const queryString = params.length > 0 ? `?${params.join("&")}` : "";
  return queryGet(`/report${queryString}`, {}, { cache: true, ttlMs: 10000 });
};
