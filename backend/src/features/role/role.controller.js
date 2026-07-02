/**
 * @file role.controller.js
 * @description Controller for role feature.
 */
import {
  getRolesService,
  getRoleByIdService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
} from "./role.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getRoles = catchAsync(async (req, res) => {
  const roles = await getRolesService();
  res.status(200).json({ success: true, data: roles });
});

export const getRoleById = catchAsync(async (req, res) => {
  const role = await getRoleByIdService(req.params.id);
  res.status(200).json({ success: true, data: role });
});

export const createRole = catchAsync(async (req, res) => {
  const role = await createRoleService(req.body);
  res.status(201).json({ success: true, data: role });
});

export const updateRole = catchAsync(async (req, res) => {
  const role = await updateRoleService(req.params.id, req.body);
  res.status(200).json({ success: true, data: role });
});

export const deleteRole = catchAsync(async (req, res) => {
  await deleteRoleService(req.params.id);
  res.status(200).json({ success: true, message: "Role deleted successfully" });
});

export default { getRoles, getRoleById, createRole, updateRole, deleteRole };
