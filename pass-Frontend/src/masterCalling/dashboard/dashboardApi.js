import { queryGet, queryPatch, queryDelete } from "@/shared/services/api";

/**
 * Dashboard API — all backend calls for the dashboard feature.
 * Used by: DashboardPage, PassActionPage
 */

export const fetchDashboardData = () =>
  queryGet("/capture/dashboard/data");

export const updatePassStatus = (passId, data) =>
  queryPatch(`/capture/${passId}/status`, data);

export const getPassById = (id) =>
  queryGet(`/capture/${id}`);

export const getVisitorByMobile = (mobile) =>
  queryGet(`/capture/visitor/${mobile}`);

export const deletePass = (id) =>
  queryDelete(`/capture/${id}`);
