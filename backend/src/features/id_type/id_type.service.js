/**
 * @file id_type.service.js
 * @description Service for id_type feature.
 */
import appError from "../../utils/appError.js";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const getIdTypeService = async () =>
  db.idtype.findMany({
    where: { status: "active" },
  });

export const createIdTypeService = async (data) => {
  const id = uuidv4();
  return db.idtype.create({
    data: {
      id,
      name: data.name,
      description: data.description || "",
      status: "active",
    },
  });
};

export const updateIdTypeService = async (idTypeId, data) => {
  const exist = await db.idtype.findUnique({
    where: { id: idTypeId },
    select: { id: true },
  });
  if (!exist) throw new appError("IdType not found", 404, "NOT_FOUND");

  return db.idtype.update({
    where: { id: idTypeId },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
    },
  });
};

export const deleteIdTypeService = async (idTypeId) => {
  const exist = await db.idtype.findUnique({
    where: { id: idTypeId },
    select: { id: true, status: true },
  });

  if (!exist) throw new appError("IdType not found", 404, "NOT_FOUND");
  if (exist.status === "deleted")
    throw new appError("IdType is already deleted", 409, "CONFLICT");

  await db.idtype.delete({
    where: { id: idTypeId },
  });
  return { success: true };
};

export default {
  getIdTypeService,
  createIdTypeService,
  updateIdTypeService,
  deleteIdTypeService,
};
