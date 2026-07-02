/**
 * @file location.service.js
 * @description Service for location feature.
 */
import appError from "../../utils/appError.js";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getLocationService = async () =>
  db.location.findMany({
    where: { status: "active" },
  });

export const createLocationService = async (data) => {
  const id = uuidv4();
  return db.location.create({
    data: {
      id,
      name: data.name,
      description: data.description || "",
      status: "active",
    },
  });
};

export const updateLocationService = async (locationId, data) => {
  const exist = await db.location.findUnique({
    where: { id: locationId },
    select: { id: true },
  });
  if (!exist) throw new appError("Location not found", 404, "NOT_FOUND");

  return db.location.update({
    where: { id: locationId },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
    },
  });
};

export const deleteLocationService = async (locationId) => {
  const exist = await db.location.findUnique({
    where: { id: locationId },
    select: { id: true, status: true },
  });

  if (!exist) throw new appError("Location not found", 404, "NOT_FOUND");
  if (exist.status === "deleted")
    throw new appError("Location is already deleted", 409, "CONFLICT");

  await db.location.delete({
    where: { id: locationId },
  });
  return { success: true };
};

export default {
  getLocationService,
  createLocationService,
  updateLocationService,
  deleteLocationService,
};
