// src/services/api.ts
import { createApiClient } from "@/shared/services/ApiClient";
import { createQueryClient } from "@/shared/services/queryClient";
import { logger } from "@/shared/utils/logger";

const api = createApiClient(
  {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    httpMetricsEnabled: import.meta.env.DEV,
    slowThresholdMs: 1000,
  },
  logger
);
export const {
  queryGet,
  queryPost,
  queryPut,
  queryPatch,
  queryDelete,
  invalidateAllQueryCache,
  invalidateQueryCacheByTags,
} = createQueryClient(api);
export default api;
