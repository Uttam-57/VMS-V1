import { queryGet, queryPost, queryPut, queryDelete } from "@/shared/services/api";

/**
 * User Management API — all backend calls for users, roles, and approvals.
 * Used by: UserPage, UserFormPage, RolePage, RoleFormPage, UserApprovalsPage
 */

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers = () => queryGet("/user");
export const getUserById = (id) => queryGet(`/user/${id}`);
export const createUser = (data) => queryPost("/user", data);
export const updateUser = (id, data) => queryPut(`/user/${id}`, data);
export const deleteUser = (id) => queryDelete(`/user/${id}`);

// ─── User Approvals ───────────────────────────────────────────────────────────
export const getUserApprovals = (userId) => queryGet(`/user/${userId}/approvals`);
export const saveUserApprovals = (userId, employeeIds) =>
  queryPost(`/user/${userId}/approvals`, { employeeIds });

// ─── Roles ────────────────────────────────────────────────────────────────────
export const getRoles = () => queryGet("/role");
export const getRoleById = (id) => queryGet(`/role/${id}`);
export const createRole = (data) => queryPost("/role", data);
export const updateRole = (id, data) => queryPut(`/role/${id}`, data);
export const deleteRole = (id) => queryDelete(`/role/${id}`);
