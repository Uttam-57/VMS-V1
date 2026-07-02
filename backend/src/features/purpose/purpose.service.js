/**
 * @file purpose.service.js
 * @description Service for purpose feature.
 */
import appError from "../../utils/appError.js";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getPurposeService = async () =>
  db.purpose.findMany({
    where: { status: "active" },
  });

export const createPurposeService = async (data) => {
  const id = uuidv4();
  return db.purpose.create({
    data: {
      id,
      name: data.name,
      description: data.description || "",
      status: "active",
    },
  });
};

export const updatePurposeService = async (purposeId, data) => {
  const exist = await db.purpose.findUnique({
    where: { id: purposeId },
    select: { id: true },
  });
  if (!exist) throw new appError("Purpose not found", 404, "NOT_FOUND");

  return db.purpose.update({
    where: { id: purposeId },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
    },
  });
};

export const deletePurposeService = async (purposeId) => {
  const exist = await db.purpose.findUnique({
    where: { id: purposeId },
    select: { id: true, status: true },
  });

  if (!exist) throw new appError("Purpose not found", 404, "NOT_FOUND");
  if (exist.status === "deleted")
    throw new appError("Purpose is already deleted", 409, "CONFLICT");

  await db.purpose.delete({
    where: { id: purposeId },
  });
  return { success: true };
};

export default {
  getPurposeService,
  createPurposeService,
  updatePurposeService,
  deletePurposeService,
};
