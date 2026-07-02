/**
 * @file employee.service.js
 * @description Service for employee feature.
 */
import appError from "../../utils/appError.js";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";
import { generateEmployeeId } from "../../utils/idGenerator.js";

export const getEmployeeService = async () => {
  const employees = await db.employee.findMany({
    where: { status: "active" },
    include: {
      location: true,
      user_user_employeeIdToemployee: {
        select: { id: true },
      },
      user_userapprovals: {
        select: { id: true },
      },
    },
  });

  return employees.map((emp) => {
    const {
      location,
      user_user_employeeIdToemployee,
      user_userapprovals,
      ...rest
    } = emp;

    return {
      ...rest,
      location: location
        ? {
            id: location.id,
            name: location.name,
            description: location.description,
          }
        : null,
      user: user_user_employeeIdToemployee
        ? { id: user_user_employeeIdToemployee.id }
        : null,
      approverIds: user_userapprovals.map((u) => u.id),
    };
  });
};

export const createEmployeeService = async (data) => {
  const id = await generateEmployeeId();
  const record = await db.employee.create({
    data: {
      id,
      name: data.name,
      employeeId: data.employeeId || id,
      department: data.department || "Unknown",
      designation: data.designation || null,
      email: data.email || null,
      phone: data.phone || null,
      locationId: data.locationId || null,
      status: "active",
      user_userapprovals: Array.isArray(data.approverIds)
        ? {
            connect: data.approverIds.filter(Boolean).map((userId) => ({
              id: userId,
            })),
          }
        : undefined,
    },
    include: {
      user_userapprovals: {
        select: { id: true },
      },
    },
  });

  const { user_userapprovals, ...rest } = record;
  return {
    ...rest,
    approverIds: user_userapprovals.map((u) => u.id),
  };
};

export const updateEmployeeService = async (employeeId, data) => {
  const exist = await db.employee.findUnique({
    where: { id: employeeId },
    select: { id: true },
  });
  if (!exist) throw new appError("Employee not found", 404, "NOT_FOUND");

  const record = await db.employee.update({
    where: { id: employeeId },
    data: {
      name: data.name,
      employeeId: data.employeeId,
      department: data.department,
      designation: data.designation,
      email: data.email,
      phone: data.phone,
      locationId: data.locationId || null,
      status: data.status,
      user_userapprovals: Array.isArray(data.approverIds)
        ? {
            set: data.approverIds.filter(Boolean).map((userId) => ({
              id: userId,
            })),
          }
        : undefined,
    },
    include: {
      user_userapprovals: {
        select: { id: true },
      },
    },
  });

  const { user_userapprovals, ...rest } = record;
  return {
    ...rest,
    approverIds: user_userapprovals.map((u) => u.id),
  };
};

export const deleteEmployeeService = async (employeeId) => {
  const exist = await db.employee.findUnique({
    where: { id: employeeId },
    select: { id: true, status: true },
  });
  if (!exist) throw new appError("Employee not found", 404, "NOT_FOUND");
  if (exist.status === "deleted")
    throw new appError("Employee is already deleted", 409, "CONFLICT");

  await db.employee.delete({
    where: { id: employeeId },
  });
  return { success: true };
};

export const checkEmailService = async (email, excludeId) => {
  if (!email) return false;
  const count = await db.employee.count({
    where: {
      email,
      id: excludeId ? { not: excludeId } : undefined,
    },
  });
  return count > 0;
};

export default {
  getEmployeeService,
  createEmployeeService,
  updateEmployeeService,
  deleteEmployeeService,
  checkEmailService,
};
