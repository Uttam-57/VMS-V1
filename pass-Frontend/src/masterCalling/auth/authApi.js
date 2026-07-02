import { queryPost } from "@/shared/services/api";

/**
 * Auth API — all authentication-related backend calls.
 * Used by: LoginPage, DashboardLayout (logout)
 */

export const login = (credentials) =>
  queryPost("/auth/login", credentials);

export const logout = () =>
  queryPost("/auth/logout", {});
