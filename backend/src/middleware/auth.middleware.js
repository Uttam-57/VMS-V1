/**
 * @file auth.middleware.js
 * @description Middleware for middleware feature.
 */
import catchAsync from "../utils/catchAsync.js";
import appError from "../utils/appError.js";
import jwt_utils from "../utils/jwt.utils.js";
import db from "../config/db.js";

export const protect = catchAsync.catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }
  if (!token) {
    return next(
      new appError(
        "You are not logged in! Please log in to get access.",
        401,
        "TOKEN_NOT_PROVIDED",
      ),
    );
  }
  const decoded = jwt_utils.verifyToken(token);
  if (!decoded) {
    return next(
      new appError("Invalid or expired token.", 401, "TOKEN_EXPIRED"),
    );
  }

  // Handle Super Admin
  if (decoded.id === "superadmin") {
    const company = await db.companyregister.findUnique({
      where: { id: "default" },
    });
    if (!company) {
      return next(
        new appError(
          "Company configurations not found.",
          401,
          "COMPANY_NOT_FOUND",
        ),
      );
    }
    req.user = {
      id: "superadmin",
      name: "Super Admin",
      email: company.userEmailId,
      role: "superadmin",
      active: true,
    };
    return next();
  }

  // Handle regular users — fetch user with role, employee, and location
  const user = await db.user.findUnique({
    where: { id: decoded.id },
    include: {
      userRole: true,
      employee_user_employeeIdToemployee: true,
      location: true,
    },
  });

  if (!user) {
    return next(
      new appError(
        "The user belonging to this token does no longer exist.",
        401,
        "USER_NOT_EXIST",
      ),
    );
  }
  if (!user.active) {
    return next(
      new appError(
        "Your account has been deactivated.",
        403,
        "DEACTIVATED_USER",
      ),
    );
  }
  if (
    user.employee_user_employeeIdToemployee &&
    user.employee_user_employeeIdToemployee.status !== "active"
  ) {
    return next(
      new appError(
        "Your associated employee profile is blocked or deleted.",
        403,
        "BLOCKED_EMPLOYEE",
      ),
    );
  }

  const roleData = user.userRole;
  const empData = user.employee_user_employeeIdToemployee;
  const locData = user.location;

  // Reconstruct nested shape expected by the rest of the app
  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
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
    location: locData
      ? {
          id: locData.id,
          name: locData.name,
        }
      : null,
  };

  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError(
          "You do not have permission to perform this action",
          403,
          "FORBIDEN_USER",
        ),
      );
    }
    next();
  };
};

export { restrictTo };

export default { restrictTo, protect };
