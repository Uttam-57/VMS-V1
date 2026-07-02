/**
 * @file visitor_type.service.js
 * @description Service for visitor_type feature.
 */
import appError from "../../utils/appError.js";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getVisitorTypeService = async () =>
  db.visitortype.findMany({
    where: { status: "active" },
  });

export const createVisitorTypeService = async (data) => {
  const id = uuidv4();
  return db.visitortype.create({
    data: {
      id,
      name: data.name,
      description: data.description || "",
      status: "active",
    },
  });
};

export const updateVisitorTypeService = async (visitorTypeId, data) => {
  const exist = await db.visitortype.findUnique({
    where: { id: visitorTypeId },
    select: { id: true },
  });
  if (!exist) throw new appError("VisitorType not found", 404, "NOT_FOUND");

  return db.visitortype.update({
    where: { id: visitorTypeId },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
    },
  });
};

export const deleteVisitorTypeService = async (visitorTypeId) => {
  const exist = await db.visitortype.findUnique({
    where: { id: visitorTypeId },
    select: { id: true, status: true },
  });

  if (!exist) throw new appError("VisitorType not found", 404, "NOT_FOUND");
  if (exist.status === "deleted")
    throw new appError("VisitorType is already deleted", 409, "CONFLICT");

  await db.visitortype.delete({
    where: { id: visitorTypeId },
  });
  return { success: true };
};

export default {
  getVisitorTypeService,
  createVisitorTypeService,
  updateVisitorTypeService,
  deleteVisitorTypeService,
};
