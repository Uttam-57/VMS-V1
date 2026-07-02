/**
 * @file permission.middleware.js
 * @description Middleware for middleware feature.
 */
import appError from "../utils/appError.js";

export const requirePermission = (moduleName) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return next(
        new appError("Authentication required.", 401, "UNAUTHORIZED"),
      );
    }

    // Allow all GET requests so dropdowns and data fetching work across the app
    if (req.method === "GET") {
      return next();
    }

    // Super Admins always have access
    if (user.role === "superadmin" || user.id === "superadmin") {
      return next();
    }

    if (!user.userRole || !user.userRole.permissions) {
      return next(
        new appError(
          "You do not have permission to access this module.",
          403,
          "FORBIDDEN_MODULE",
        ),
      );
    }

    let permissions = {};
    try {
      permissions =
        typeof user.userRole.permissions === "string"
          ? JSON.parse(user.userRole.permissions)
          : user.userRole.permissions;
    } catch (e) {
      return next(
        new appError(
          "Invalid permission configuration.",
          403,
          "FORBIDDEN_MODULE",
        ),
      );
    }

    if (!permissions[moduleName]) {
      return next(
        new appError(
          `You do not have permission to access the ${moduleName} module.`,
          403,
          "FORBIDDEN_MODULE",
        ),
      );
    }

    next();
  };
};

export default { requirePermission };
