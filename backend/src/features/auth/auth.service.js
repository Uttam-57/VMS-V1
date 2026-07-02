/**
 * @file auth.service.js
 * @description Service for auth feature.
 */
import appError from "../../utils/appError.js";
import jwt_utils from "../../utils/jwt.utils.js";
import db from "../../config/db.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const mapSafeUser = (user) => {
  if (!user) return null;
  const roleData = user.userRole;
  const empData = user.employee_user_employeeIdToemployee;
  const locData = user.location;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: !!user.active,
    isSecurity: !!user.isSecurity,
    locationId: user.locationId,
    employeeId: user.employeeId,
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
          status: empData.status,
          locationId: empData.locationId,
        }
      : null,
    location: locData ? { id: locData.id, name: locData.name } : null,
  };
};

const USER_INCLUDE = {
  userRole: true,
  employee_user_employeeIdToemployee: true,
  location: true,
};

const registerUser = async (data) => {
  const existing = await db.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (existing) {
    throw new appError("Email already exists", 400, "CONFLICT_ERROR");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const id = uuidv4();
  const newUser = await db.user.create({
    data: {
      id,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: "user",
      active: true,
      isSecurity: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
  });

  const token = jwt_utils.signToken(newUser.id);
  const refreshToken = jwt_utils.signRefreshToken(newUser.id);
  return { user: newUser, token, refreshToken };
};

const loginUser = async (data) => {
  // Check Super Admin from CompanyRegister
  const company = await db.companyregister.findUnique({
    where: { id: "default" },
  });

  if (
    company &&
    company.userEmailId &&
    company.userEmailId === data.email &&
    company.emailPassword === data.password
  ) {
    const token = jwt_utils.signToken("superadmin");
    const refreshToken = jwt_utils.signRefreshToken("superadmin");
    return {
      user: {
        id: "superadmin",
        name: "Super Admin",
        email: company.userEmailId,
        role: "superadmin",
        active: true,
      },
      token,
      refreshToken,
    };
  }

  // Regular user login
  const user = await db.user.findUnique({
    where: { email: data.email },
    include: USER_INCLUDE,
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new appError(
      "Incorrect email or password",
      401,
      "INVALID_CREDENTIAL",
    );
  }
  if (!user.active) {
    throw new appError(
      "Your account has been deactivated.",
      403,
      "DEACTIVATED_USER",
    );
  }
  if (
    user.employee_user_employeeIdToemployee &&
    user.employee_user_employeeIdToemployee.status !== "active"
  ) {
    throw new appError(
      "Your associated employee profile is blocked or deleted.",
      403,
      "BLOCKED_EMPLOYEE",
    );
  }

  const token = jwt_utils.signToken(user.id);
  const refreshToken = jwt_utils.signRefreshToken(user.id);

  return { user: mapSafeUser(user), token, refreshToken };
};

export default { registerUser, loginUser };
export { registerUser, loginUser };
