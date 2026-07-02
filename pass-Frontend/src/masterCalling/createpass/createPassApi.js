import { queryPost, queryGet } from "@/shared/services/api";
import { API_ENDPOINTS } from "@/shared/const/api";

/**
 * Create Pass API — all backend calls for gate pass creation.
 * Used by: CreatePassPage
 */

export const submitCreatePass = (payload, options) =>
  queryPost(API_ENDPOINTS.UPLOAD, payload, options);

export const getVisitorByMobile = (mobile) =>
  queryGet(`/capture/visitor/${mobile}`);
