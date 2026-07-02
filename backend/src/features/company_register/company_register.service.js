/**
 * @file company_register.service.js
 * @description Service for company_register feature.
 */
import db from "../../config/db.js";
import { uploadStream } from "../../utils/cloudinary.js";

const COMPANY_REGISTER_ID = "default";

export const getCompanyRegisterService = async () =>
  db.companyregister.findUnique({
    where: { id: COMPANY_REGISTER_ID },
  });

export const upsertCompanyRegisterService = async (data, logoFile) => {
  const existing = await db.companyregister.findUnique({
    where: { id: COMPANY_REGISTER_ID },
  });

  let logoUrl = existing?.logoUrl ?? "";
  if (logoFile?.buffer) {
    const result = await uploadStream(logoFile.buffer, "vms/company_logo");
    logoUrl = result.secure_url;
  }

  const payload = {
    companyFullName: data.companyFullName ?? "",
    companyShortName: data.companyShortName ?? "",
    companyContactNo: data.companyContactNo ?? "",
    logoUrl,
    hostName: data.hostName ?? "",
    portNo: Number.isFinite(Number(data.portNo)) ? Number(data.portNo) : 0,
    userEmailId: data.userEmailId ?? "",
    emailPassword: data.emailPassword ?? "",
    startTime: data.startTime ?? "09:00",
    endTime: data.endTime ?? "19:00",
    updatedAt: new Date(),
  };

  return db.companyregister.upsert({
    where: { id: COMPANY_REGISTER_ID },
    update: payload,
    create: {
      id: COMPANY_REGISTER_ID,
      ...payload,
    },
  });
};

export default { getCompanyRegisterService, upsertCompanyRegisterService };
