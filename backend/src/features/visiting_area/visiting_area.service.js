/**
 * @file visiting_area.service.js
 * @description Service for visiting_area feature.
 */
import appError from "../../utils/appError.js";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getVisitingAreaService = async () =>
  db.visitingarea.findMany({
    where: { status: "active" },
  });

export const createVisitingAreaService = async (data) => {
  const id = uuidv4();
  return db.visitingarea.create({
    data: {
      id,
      name: data.name,
      floor: data.floor,
      description: data.description || "",
      status: "active",
    },
  });
};

export const updateVisitingAreaService = async (visitingAreaId, data) => {
  const exist = await db.visitingarea.findUnique({
    where: { id: visitingAreaId },
    select: { id: true },
  });
  if (!exist) throw new appError("VisitingArea not found", 404, "NOT_FOUND");

  return db.visitingarea.update({
    where: { id: visitingAreaId },
    data: {
      name: data.name,
      floor: data.floor,
      description: data.description,
      status: data.status,
    },
  });
};

export const deleteVisitingAreaService = async (visitingAreaId) => {
  const exist = await db.visitingarea.findUnique({
    where: { id: visitingAreaId },
    select: { id: true, status: true },
  });

  if (!exist) throw new appError("VisitingArea not found", 404, "NOT_FOUND");
  if (exist.status === "deleted")
    throw new appError("VisitingArea is already deleted", 409, "CONFLICT");

  await db.visitingarea.delete({
    where: { id: visitingAreaId },
  });
  return { success: true };
};

export default {
  getVisitingAreaService,
  createVisitingAreaService,
  updateVisitingAreaService,
  deleteVisitingAreaService,
};
