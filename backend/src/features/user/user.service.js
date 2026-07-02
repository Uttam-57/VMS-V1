/**
 * @file user.service.js
 * @description Service for user feature.
 */
import db from "../../config/db.js";
import appError from "../../utils/appError.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { generateRoleId, generateEmployeeId } from "../../utils/idGenerator.js";

const buildUserShape = (u) => {
  if (!u) return null;
  const roleData = u.userRole;
  const empData = u.employee_user_employeeIdToemployee;
  const locData = u.location;

  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    active: !!u.active,
    isSecurity: !!u.isSecurity,
    locationId: u.locationId,
    employeeId: u.employeeId,
    roleId: u.roleId,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    userRole: roleData
      ? {
          id: roleData.id,
          name: roleData.name,
          permissions: roleData.permissions || {},
          dataVisibility: roleData.dataVisibility,
          withHierarchy: !!roleData.withHierarchy,
        }
      : null,
    employee: empData
      ? {
          id: empData.id,
          name: empData.name,
          employeeId: empData.employeeId,
          department: empData.department,
          status: empData.status,
          locationId: empData.locationId,
          location: empData.location
            ? { id: empData.location.id, name: empData.location.name }
            : null,
        }
      : null,
    location: locData ? { id: locData.id, name: locData.name } : null,
  };
};

const USER_INCLUDE = {
  userRole: true,
  employee_user_employeeIdToemployee: {
    include: {
      location: true,
    },
  },
  location: true,
};

export const getUsersService = async () => {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    include: USER_INCLUDE,
  });
  return users.map(buildUserShape);
};

export const getUserByIdService = async (id) => {
  const u = await db.user.findUnique({
    where: { id },
    include: USER_INCLUDE,
  });
  if (!u) throw new appError("User not found", 404, "NOT_FOUND");
  return buildUserShape(u);
};

export const createUserService = async (data) => {
  const existingEmail = await db.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (existingEmail)
    throw new appError("Email already in use", 400, "CONFLICT");

  const hashedPassword = await bcrypt.hash(data.password, 12);
  let employeeIdToLink = data.employeeId;

  if (!employeeIdToLink && data.employeeCode && data.name) {
    const empId = await generateEmployeeId();
    await db.employee.create({
      data: {
        id: empId,
        name: data.name,
        employeeId: data.employeeCode,
        department: data.department || "Unknown",
        designation: data.designation || null,
        email: data.email,
        phone: data.phone || null,
        locationId: data.employeeLocationId || data.locationId || null,
        status: "active",
      },
    });
    employeeIdToLink = empId;
  }

  const id = await generateRoleId(data.roleId);

  if (employeeIdToLink) {
    const existingLink = await db.user.findUnique({
      where: { employeeId: employeeIdToLink },
      select: { id: true },
    });
    if (existingLink)
      throw new appError(
        "This employee is already linked to another user account",
        400,
        "CONFLICT",
      );

    // Prompt existing employee ID to match the new user role-based ID
    await db.$executeRawUnsafe(`UPDATE employee SET id = ?, employeeId = ? WHERE id = ?`, id, id, employeeIdToLink);
    employeeIdToLink = id;
  }

  const now = new Date();
  const u = await db.user.create({
    data: {
      id,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "user",
      active: data.active ?? true,
      isSecurity: data.isSecurity ?? false,
      roleId: data.roleId || null,
      locationId: data.isSecurity ? data.locationId || null : null,
      employeeId: employeeIdToLink || null,
      createdAt: now,
      updatedAt: now,
    },
    include: USER_INCLUDE,
  });

  return buildUserShape(u);
};

export const updateUserService = async (id, data) => {
  const user = await db.user.findUnique({
    where: { id },
  });
  if (!user) throw new appError("User not found", 404, "NOT_FOUND");

  const updateData = {
    name: data.name,
    active: data.active,
    isSecurity: data.isSecurity ?? false,
    roleId: data.roleId || null,
    locationId: data.isSecurity ? data.locationId || null : null,
    updatedAt: new Date(),
  };

  if (data.email && data.email !== user.email) {
    const emailExist = await db.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });
    if (emailExist) throw new appError("Email already in use", 400, "CONFLICT");
    updateData.email = data.email;
  }

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }

  const updatedUser = await db.user.update({
    where: { id },
    data: updateData,
    include: USER_INCLUDE,
  });

  // Sync linked employee
  if (
    user.employeeId &&
    (data.employeeCode ||
      data.department ||
      data.designation ||
      data.phone ||
      data.employeeLocationId !== undefined)
  ) {
    await db.employee.update({
      where: { id: user.employeeId },
      data: {
        name: data.name,
        employeeId: data.employeeCode,
        department: data.department,
        designation: data.designation,
        phone: data.phone,
        locationId: data.employeeLocationId || null,
      },
    });
  }

  return buildUserShape(updatedUser);
};

export const deleteUserService = async (id) => {
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!user) throw new appError("User not found", 404, "NOT_FOUND");
  await db.user.delete({
    where: { id },
  });
  return { success: true };
};

// ─── Approval assignment ───

export const getUserApprovalsService = async (id) => {
  const user = await db.user.findUnique({
    where: { id },
    include: {
      employee_userapprovals: true,
    },
  });
  if (!user) throw new appError("User not found", 404, "NOT_FOUND");
  return user.employee_userapprovals;
};

export const assignUserApprovalsService = async (id, employeeIds) => {
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!user) throw new appError("User not found", 404, "NOT_FOUND");

  const u = await db.user.update({
    where: { id },
    data: {
      employee_userapprovals: {
        set: employeeIds.filter(Boolean).map((empId) => ({ id: empId })),
      },
    },
    include: {
      employee_userapprovals: true,
    },
  });

  return { approvedEmployees: u.employee_userapprovals };
};

export const migrateUserApprovalsService = async (fromUserId, toUserId) => {
  if (fromUserId === toUserId)
    throw new appError("Cannot migrate to the same user", 400, "BAD_REQUEST");

  const fromUser = await db.user.findUnique({
    where: { id: fromUserId },
    include: { employee_userapprovals: { select: { id: true } } },
  });
  if (!fromUser) throw new appError("Source user not found", 404, "NOT_FOUND");

  const toUser = await db.user.findUnique({
    where: { id: toUserId },
    select: { id: true },
  });
  if (!toUser) throw new appError("Target user not found", 404, "NOT_FOUND");

  const empIds = fromUser.employee_userapprovals.map((emp) => emp.id);

  if (empIds.length > 0) {
    // Connect them to target user
    await db.user.update({
      where: { id: toUserId },
      data: {
        employee_userapprovals: {
          connect: empIds.map((id) => ({ id })),
        },
      },
    });

    // Disconnect them from source user
    await db.user.update({
      where: { id: fromUserId },
      data: {
        employee_userapprovals: {
          disconnect: empIds.map((id) => ({ id })),
        },
      },
    });
  }

  return { message: `Successfully migrated ${empIds.length} employees.` };
};

export const checkEmailService = async (email, excludeId) => {
  if (!email) return false;
  const count = await db.user.count({
    where: {
      email,
      id: excludeId ? { not: excludeId } : undefined,
    },
  });
  return count > 0;
};

export default {
  getUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
  getUserApprovalsService,
  assignUserApprovalsService,
  migrateUserApprovalsService,
  checkEmailService,
};
