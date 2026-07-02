import { logger } from "@/shared/utils/logger";
const configuredApiBase = import.meta.env.VITE_API_BASE_URL;
const configuredSlowThreshold = Number(import.meta.env.VITE_HTTP_SLOW_MS);
export const env = {
  API_BASE_URL: configuredApiBase || "http://localhost:3000/api",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  HTTP_METRICS_ENABLED: import.meta.env.VITE_LOG_HTTP_METRICS !== "false",
  HTTP_SLOW_THRESHOLD_MS:
    Number.isFinite(configuredSlowThreshold) && configuredSlowThreshold > 0
      ? configuredSlowThreshold
      : 1200,
};
if (!configuredApiBase && env.IS_DEV) {
  logger.warn(
    "VITE_API_BASE_URL is not configured. Falling back to http://localhost:3000/api",
  );
}
