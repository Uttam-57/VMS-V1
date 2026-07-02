/**
 * @file department.service.js
 * @description Service for department feature.
 */
import appError from "../../utils/appError.js";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getDepartmentService = async () =>
  db.department.findMany({
    where: { status: "active" },
  });

export const createDepartmentService = async (data) => {
  const id = uuidv4();
  return db.department.create({
    data: {
      id,
      name: data.name,
      status: "active",
    },
  });
};

export const updateDepartmentService = async (departmentId, data) => {
  const exist = await db.department.findUnique({
    where: { id: departmentId },
    select: { id: true },
  });
  if (!exist) throw new appError("Department not found", 404, "NOT_FOUND");

  return db.department.update({
    where: { id: departmentId },
    data: {
      name: data.name,
      status: data.status,
    },
  });
};

export const deleteDepartmentService = async (departmentId) => {
  const exist = await db.department.findUnique({
    where: { id: departmentId },
    select: { id: true, status: true },
  });

  if (!exist) throw new appError("Department not found", 404, "NOT_FOUND");
  if (exist.status === "deleted")
    throw new appError("Department is already deleted", 409, "CONFLICT");

  await db.department.delete({
    where: { id: departmentId },
  });
  return { success: true };
};

export default {
  getDepartmentService,
  createDepartmentService,
  updateDepartmentService,
  deleteDepartmentService,
};
