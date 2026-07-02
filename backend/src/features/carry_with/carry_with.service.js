/**
 * @file carry_with.service.js
 * @description Service for carry_with feature.
 */
import appError from "../../utils/appError.js";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getCarryWithService = async () =>
  db.carrywith.findMany({
    where: { status: "active" },
  });

export const createCarryWithService = async (data) => {
  const id = uuidv4();
  return db.carrywith.create({
    data: {
      id,
      name: data.name,
      description: data.description || "",
      status: "active",
    },
  });
};

export const updateCarryWithService = async (carryWithId, data) => {
  const exist = await db.carrywith.findUnique({
    where: { id: carryWithId },
    select: { id: true },
  });
  if (!exist) throw new appError("CarryWith not found", 404, "NOT_FOUND");

  return db.carrywith.update({
    where: { id: carryWithId },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
    },
  });
};

export const deleteCarryWithService = async (carryWithId) => {
  const exist = await db.carrywith.findUnique({
    where: { id: carryWithId },
    select: { id: true, status: true },
  });

  if (!exist) throw new appError("CarryWith not found", 404, "NOT_FOUND");
  if (exist.status === "deleted")
    throw new appError("CarryWith is already deleted", 409, "CONFLICT");

  await db.carrywith.delete({
    where: { id: carryWithId },
  });
  return { success: true };
};

export default {
  getCarryWithService,
  createCarryWithService,
  updateCarryWithService,
  deleteCarryWithService,
};
