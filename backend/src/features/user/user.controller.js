/**
 * @file user.controller.js
 * @description Controller for user feature.
 */
import {
  getUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
  getUserApprovalsService,
  assignUserApprovalsService,
  migrateUserApprovalsService,
  checkEmailService,
} from "./user.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getUsers = catchAsync(async (req, res) => {
  const users = await getUsersService();
  res.status(200).json({ success: true, data: users });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await getUserByIdService(req.params.id);
  res.status(200).json({ success: true, data: user });
});

export const createUser = catchAsync(async (req, res) => {
  const user = await createUserService(req.body);
  res.status(201).json({ success: true, data: user });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await updateUserService(req.params.id, req.body);
  res.status(200).json({ success: true, data: user });
});

export const deleteUser = catchAsync(async (req, res) => {
  await deleteUserService(req.params.id);
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

export const getUserApprovals = catchAsync(async (req, res) => {
  const approvals = await getUserApprovalsService(req.params.id);
  res.status(200).json({ success: true, data: approvals });
});

export const assignUserApprovals = catchAsync(async (req, res) => {
  const { employeeIds } = req.body;
  const user = await assignUserApprovalsService(req.params.id, employeeIds);
  res.status(200).json({ success: true, data: user.approvedEmployees });
});

export const migrateUserApprovals = catchAsync(async (req, res) => {
  const { toUserId } = req.body;
  const result = await migrateUserApprovalsService(req.params.id, toUserId);
  res.status(200).json({ success: true, message: result.message });
});

export const checkEmail = catchAsync(async (req, res) => {
  const { email, excludeId } = req.query;
  const exists = await checkEmailService(email, excludeId);
  res.status(200).json({ success: true, data: { exists } });
});

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserApprovals,
  assignUserApprovals,
  migrateUserApprovals,
  checkEmail,
};
