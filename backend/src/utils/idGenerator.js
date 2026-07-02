/**
 * @file idGenerator.js
 * @description Helper utility to generate unique sequential role-based and employee IDs.
 */
import db from "../config/db.js";

/**
 * Utility function to query existing IDs starting with a prefix across both User and Employee tables,
 * parse their numeric parts, and generate the next sequential unique ID.
 * @param {string} prefix - The 3-character ID prefix.
 * @returns {Promise<string>} The generated unique ID.
 */
const getNextSequentialId = async (prefix) => {
  const users = await db.user.findMany({
    where: {
      id: {
        startsWith: prefix,
      },
    },
    select: { id: true },
  });

  const employees = await db.employee.findMany({
    where: {
      id: {
        startsWith: prefix,
      },
    },
    select: { id: true },
  });

  const allIds = [...users.map((u) => u.id), ...employees.map((e) => e.id)];

  let maxNum = 1000;
  for (const id of allIds) {
    const numPart = id.slice(prefix.length);
    const parsed = parseInt(numPart, 10);
    if (!isNaN(parsed) && parsed > maxNum) {
      maxNum = parsed;
    }
  }

  return `${prefix}${maxNum + 1}`;
};

/**
 * Generates the next sequential user ID based on the assigned role's name.
 * Format: 3 letters of role (uppercase) + 4-digit sequence (starts at 1001).
 * E.g., ADM1001, OPR1002.
 * @param {string} roleId - The ID of the role to base the prefix on.
 * @returns {Promise<string>} The generated unique user ID.
 */
export const generateRoleId = async (roleId) => {
  let prefix = "USR"; // fallback
  if (roleId) {
    const roleObj = await db.role.findUnique({
      where: { id: roleId },
      select: { name: true },
    });
    if (roleObj && roleObj.name) {
      // Extract only letters, slice first 3, uppercase
      const cleanName = roleObj.name.replace(/[^a-zA-Z]/g, "");
      prefix = cleanName.slice(0, 3).toUpperCase();
      if (prefix.length < 3) {
        prefix = (prefix + "XXX").slice(0, 3);
      }
    }
  }

  return getNextSequentialId(prefix);
};

/**
 * Generates the next sequential employee ID starting with EMP prefix.
 * Format: EMP + 4-digit sequence (starts at 1001).
 * E.g., EMP1001, EMP1002.
 * @returns {Promise<string>} The generated unique employee ID.
 */
export const generateEmployeeId = async () => {
  return getNextSequentialId("EMP");
};

export default { generateRoleId, generateEmployeeId };
