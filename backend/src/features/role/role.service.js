/**
 * @file role.service.js
 * @description Service for role feature.
 */
import db from "../../config/db.js";
import appError from "../../utils/appError.js";
import { v4 as uuidv4 } from "uuid";

export const getRolesService = async () =>
  db.role.findMany({
    orderBy: { createdAt: "desc" },
  });

export const getRoleByIdService = async (id) => {
  const role = await db.role.findUnique({
    where: { id },
  });
  if (!role) throw new appError("Role not found", 404, "NOT_FOUND");
  return role;
};

export const createRoleService = async (data) => {
  const existing = await db.role.findUnique({
    where: { name: data.name },
    select: { id: true },
  });
  if (existing) throw new appError("Role name already exists", 400, "CONFLICT");

  const id = uuidv4();
  const now = new Date();
  return db.role.create({
    data: {
      id,
      name: data.name,
      dataVisibility: data.dataVisibility || "assigned",
      withHierarchy: !!data.withHierarchy,
      permissions: data.permissions || {},
      createdAt: now,
      updatedAt: now,
    },
  });
};

export const updateRoleService = async (id, data) => {
  const role = await db.role.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!role) throw new appError("Role not found", 404, "NOT_FOUND");

  return db.role.update({
    where: { id },
    data: {
      name: data.name,
      dataVisibility: data.dataVisibility,
      withHierarchy: !!data.withHierarchy,
      permissions: data.permissions || {},
      updatedAt: new Date(),
    },
  });
};

export const deleteRoleService = async (id) => {
  const role = await db.role.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!role) throw new appError("Role not found", 404, "NOT_FOUND");

  await db.role.delete({
    where: { id },
  });
  return { success: true };
};

export default {
  getRolesService,
  getRoleByIdService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
};
