/**
 * @file gp.service.js
 * @description Service for gate_pass feature.
 */
import { uploadStream, deleteFromCloudinary } from "../../utils/cloudinary.js";
import logger_utils from "../../utils/logger.utils.js";
import db from "../../config/db.js";
import { v4 as uuidv4 } from "uuid";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateGatePassId = async () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let isUnique = false;
  let code = "";
  while (!isUnique) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existing = await db.formdata.findUnique({
      where: { gatePassId: code },
      select: { id: true },
    });
    if (!existing) isUnique = true;
  }
  return code;
};

/**
 * Resolve the effective status of a pass at read-time.
 * - Checked-In + allowedHours exceeded → Expired
 * - passDate in the past (non Checked-In/Out) → Expired
 * - Otherwise → stored status
 */
const resolveStatus = (pass) => {
  if (!pass) return null;

  const status = pass.status;

  // Already final states — return as-is
  if (status === "Checked-Out" || status === "Rejected") return status;

  // Checked-In: check allowedHours deadline
  if (status === "Checked-In" && pass.checkedInAt && pass.allowedHours) {
    const deadline = new Date(pass.checkedInAt);
    deadline.setHours(deadline.getHours() + Number(pass.allowedHours));
    if (new Date() > deadline) return "Expired";
    return "Checked-In";
  }

  // For all other statuses: if passDate is in the past → Expired
  if (pass.passDate) {
    const todayStr = new Date().toISOString().split("T")[0];
    const passDateStr = new Date(pass.passDate).toISOString().split("T")[0];
    if (todayStr > passDateStr) return "Expired";
  }

  return status;
};

const parseJsonField = (val) => {
  if (!val) return [];
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};

const formatPass = (pass, persons = []) => {
  if (!pass) return null;
  return {
    ...pass,
    carryWith: parseJsonField(pass.carryWith),
    visitArea: parseJsonField(pass.visitArea),
    status: resolveStatus(pass),
    persons,
  };
};

// ─── Services ─────────────────────────────────────────────────────────────────

const processForm = async (data, file, aadharFiles) => {
  try {
    let photoUrl = "";
    if (file) {
      const result = await uploadStream(file.buffer, "vms/photos");
      photoUrl = result.secure_url;
    }

    let carryWith = data.carryWith;
    let visitArea = data.visitArea;
    let persons = data.persons;

    try {
      carryWith =
        typeof carryWith === "string" ? JSON.parse(carryWith) : carryWith;
      if (!Array.isArray(carryWith)) carryWith = [];
    } catch {
      carryWith = [];
    }
    try {
      visitArea =
        typeof visitArea === "string" ? JSON.parse(visitArea) : visitArea;
      if (!Array.isArray(visitArea)) visitArea = [];
    } catch {
      visitArea = [];
    }
    try {
      persons = typeof persons === "string" ? JSON.parse(persons) : persons;
      if (!Array.isArray(persons)) persons = [];
    } catch {
      persons = [];
    }

    const personsWithFileUrls = await Promise.all(
      persons.map(async (person, index) => {
        const aadharFile = aadharFiles && aadharFiles[index];
        let aadharFileUrl = "";
        if (aadharFile) {
          const result = await uploadStream(aadharFile.buffer, "vms/aadhar");
          aadharFileUrl = result.secure_url;
        }
        return { ...person, aadharFileUrl };
      }),
    );

    const gatePassId = await generateGatePassId();
    const passId = uuidv4();
    const now = new Date();

    const createdPass = await db.formdata.create({
      data: {
        id: passId,
        gatePassId,
        passDate: new Date(data.passDate || Date.now()),
        mobileNo: data.mobileNo || "",
        name: data.name || "",
        emailId: data.emailId || "",
        companyName: data.companyName || null,
        address: data.address || null,
        state: data.state || null,
        city: data.city || null,
        representingVisitorType: data.representingVisitorType || null,
        subLocation: data.subLocation || null,
        toMeetWith: data.toMeetWith || null,
        carryWith: carryWith,
        idType: data.idType || null,
        idNumber: data.idNumber || null,
        description: data.description || null,
        token: data.token || null,
        temperature: data.temperature || null,
        noOfPerson: 1 + personsWithFileUrls.length,
        visitArea: visitArea,
        purpose: data.purpose || null,
        allowedHours: data.allowedHours || null,
        photoUrl,
        status: data.status || "Requested",
        maskCovid: data.maskCovid || "",
        createdAt: now,
        updatedAt: now,
        persondetail: {
          create: personsWithFileUrls.map((p) => ({
            id: uuidv4(),
            name: p.name || "",
            phoneNo: p.phoneNo || "",
            aadharNumber: p.aadharNumber || "",
            token: p.token || null,
            aadharFileUrl: p.aadharFileUrl || "",
          })),
        },
      },
      include: {
        persondetail: true,
      },
    });

    logger_utils.info(`Gate pass created: ${passId}`);
    const { persondetail, ...passRest } = createdPass;
    return { success: true, photoUrl, data: formatPass(passRest, persondetail) };
  } catch (err) {
    logger_utils.error(`processForm error: ${err.message}`);
    throw new Error(err.message);
  }
};

const getPassesService = async (filters = {}, user) => {
  try {
    const where = {};

    // Role-based filtering
    if (user && user.role !== "superadmin") {
      const isSecurity =
        user.isSecurity ||
        user.userRole?.name?.toLowerCase() === "security";

      if (isSecurity) {
        if (user.location?.name) {
          where.subLocation = user.location.name;
        } else if (user.locationId) {
          const empList = await db.employee.findMany({
            where: { locationId: user.locationId },
            select: { id: true },
          });
          const empIds = empList.map((e) => e.id);
          if (empIds.length > 0) {
            where.toMeetWith = { in: empIds };
          } else {
            // Force empty result by using a non-existent condition
            where.id = "force-empty";
          }
        }
      } else {
        // Employee/Approver: own passes + approved employees
        const approvalsUser = await db.user.findUnique({
          where: { id: user.id },
          include: { employee_userapprovals: { select: { id: true } } },
        });

        const allowedEmpIds = new Set();
        if (user.employeeId) allowedEmpIds.add(user.employeeId);
        if (approvalsUser?.employee_userapprovals) {
          approvalsUser.employee_userapprovals.forEach((r) =>
            allowedEmpIds.add(r.id),
          );
        }

        if (allowedEmpIds.size > 0) {
          where.toMeetWith = { in: Array.from(allowedEmpIds) };
        } else {
          where.id = "force-empty";
        }
      }
    }

    // Dynamic filters
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.subLocation) {
      where.subLocation = filters.subLocation;
    }
    if (filters.createdAt) {
      where.createdAt = {};
      if (filters.createdAt.gte) {
        where.createdAt.gte = new Date(filters.createdAt.gte);
      }
      if (filters.createdAt.lte) {
        where.createdAt.lte = new Date(filters.createdAt.lte);
      }
    }

    const passes = await db.formdata.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { persondetail: true },
    });

    return passes.map((pass) => {
      const { persondetail, ...passRest } = pass;
      return formatPass(passRest, persondetail);
    });
  } catch (err) {
    logger_utils.error(`getPassesService error: ${err.message}`);
    throw new Error(err.message);
  }
};

const updatePassStatusService = async (
  idOrCode,
  status,
  updateData = {},
  currentUser = null,
) => {
  try {
    const pass = await db.formdata.findFirst({
      where: {
        OR: [{ id: idOrCode }, { gatePassId: idOrCode }],
      },
    });
    if (!pass) throw new Error(`Gate pass not found with code/ID: ${idOrCode}`);

    const currentStatus = resolveStatus(pass);

    // Location check for security during check-in/out
    if (
      currentUser &&
      currentUser.role !== "superadmin" &&
      (status === "Checked-In" || status === "Checked-Out")
    ) {
      const isSecurity =
        currentUser.isSecurity ||
        currentUser.userRole?.name?.toLowerCase() === "security";
      if (isSecurity && currentUser.location?.name) {
        if (
          pass.subLocation &&
          pass.subLocation !== currentUser.location.name
        ) {
          throw new Error(
            `This gate pass belongs to location "${pass.subLocation}" and cannot be processed at your assigned location ("${currentUser.location.name}").`,
          );
        }
      }
    }

    const dataToUpdate = { status, updatedAt: new Date() };

    if (status === "Pending") {
      dataToUpdate.rejectedBy = null;
      dataToUpdate.rejectedAt = null;
      dataToUpdate.rejectionReason = null;
    } else if (status === "Approved") {
      dataToUpdate.approvedBy = updateData.approvedBy || "Admin";
      dataToUpdate.approvedAt = new Date();
    } else if (status === "Rejected") {
      dataToUpdate.rejectedBy = updateData.rejectedBy || "Admin";
      dataToUpdate.rejectedAt = new Date();
      dataToUpdate.rejectionReason =
        updateData.rejectionReason || "No reason specified";
    } else if (status === "Checked-In") {
      if (currentStatus === "Expired")
        throw new Error("Cannot check in. Pass has expired.");
      if (pass.status === "Checked-In")
        throw new Error("Cannot check in. Pass is already checked in.");
      if (pass.status === "Checked-Out")
        throw new Error("Cannot check in. Pass has already checked out.");
      if (pass.status !== "Approved")
        throw new Error(
          `Cannot check in. Pass is not Approved (current status is: ${pass.status}).`,
        );

      const today = new Date().toISOString().split("T")[0];
      const passDateStr = new Date(pass.passDate).toISOString().split("T")[0];
      if (today < passDateStr)
        throw new Error(
          `Cannot check in today. Pass is valid for a future date: ${passDateStr}`,
        );
      if (today > passDateStr)
        throw new Error(`Cannot check in. Pass expired on: ${passDateStr}`);

      dataToUpdate.checkedInBy = updateData.checkedInBy || "Security";
      dataToUpdate.checkedInAt = new Date();
    } else if (status === "Checked-Out") {
      const allowedOriginalStatuses = ["Checked-In"];
      if (!allowedOriginalStatuses.includes(pass.status)) {
        throw new Error(
          `Cannot check out. Pass is not Checked-In (current raw status is: ${pass.status}).`,
        );
      }
      dataToUpdate.checkedOutBy = updateData.checkedOutBy || "Security";
      dataToUpdate.checkedOutAt = new Date();

      // If the pass has expired, record the reason and time detail
      if (
        currentStatus === "Expired" &&
        pass.checkedInAt &&
        pass.allowedHours
      ) {
        const deadline = new Date(pass.checkedInAt);
        deadline.setHours(deadline.getHours() + Number(pass.allowedHours));
        dataToUpdate.description =
          `${pass.description || ""}\n[System Expiry Note]: Checked-out after allowed duration of ${pass.allowedHours} hours expired on ${deadline.toLocaleString()}.`.trim();
      }
    }

    await db.formdata.update({
      where: { id: pass.id },
      data: dataToUpdate,
    });

    const updated = await db.formdata.findUnique({
      where: { id: pass.id },
      include: { persondetail: true },
    });

    logger_utils.info(`Gate pass ${pass.id} status updated to ${status}`);
    const { persondetail, ...passRest } = updated;
    return formatPass(passRest, persondetail);
  } catch (err) {
    logger_utils.error(`updatePassStatusService error: ${err.message}`);
    throw new Error(err.message);
  }
};

const getPassByIdService = async (idOrCode) => {
  try {
    const pass = await db.formdata.findFirst({
      where: {
        OR: [{ id: idOrCode }, { gatePassId: idOrCode }],
      },
      include: { persondetail: true },
    });
    if (!pass) return null;
    const { persondetail, ...passRest } = pass;
    return formatPass(passRest, persondetail);
  } catch (err) {
    logger_utils.error(`getPassByIdService error: ${err.message}`);
    throw new Error(err.message);
  }
};

const getDashboardDataService = async (user) => {
  try {
    const where = {};

    if (user && user.role !== "superadmin") {
      const isSecurity =
        user.isSecurity ||
        user.userRole?.name?.toLowerCase() === "security";

      if (isSecurity) {
        if (user.location?.name) {
          where.subLocation = user.location.name;
        } else if (user.locationId) {
          const empList = await db.employee.findMany({
            where: { locationId: user.locationId },
            select: { id: true },
          });
          const empIds = empList.map((e) => e.id);
          if (empIds.length > 0) {
            where.toMeetWith = { in: empIds };
          } else {
            where.id = "force-empty";
          }
        }
      } else {
        const approvalsUser = await db.user.findUnique({
          where: { id: user.id },
          include: { employee_userapprovals: { select: { id: true } } },
        });

        const allowedEmpIds = new Set();
        if (user.employeeId) allowedEmpIds.add(user.employeeId);
        if (approvalsUser?.employee_userapprovals) {
          approvalsUser.employee_userapprovals.forEach((r) =>
            allowedEmpIds.add(r.id),
          );
        }

        if (allowedEmpIds.size > 0) {
          where.toMeetWith = { in: Array.from(allowedEmpIds) };
        } else {
          where.id = "force-empty";
        }
      }
    }

    const passes = await db.formdata.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const employees = await db.employee.findMany({
      select: { id: true, name: true },
    });
    const employeeMap = {};
    employees.forEach((emp) => {
      employeeMap[emp.id] = emp.name;
    });

    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : "";
    const formatDateTime = (date) =>
      date ? new Date(date).toLocaleString() : "-";
    const todayStr = new Date().toISOString().split("T")[0];

    const mappedPasses = passes.map((p) => {
      const resolvedStatus = resolveStatus(p);
      const formattedPassDate = formatDate(p.passDate);
      return {
        ...p,
        carryWith: parseJsonField(p.carryWith),
        visitArea: parseJsonField(p.visitArea),
        pass: "Single",
        gate_pass_id: p.gatePassId || "-",
        pass_date: formattedPassDate,
        date: formattedPassDate,
        timer: p.allowedHours ? `${p.allowedHours} hrs` : "-",
        name: p.name,
        employee: employeeMap[p.toMeetWith] || p.toMeetWith || "-",
        mobile_no: p.mobileNo,
        "email-id": p.emailId,
        status: resolvedStatus,
        approved_by: p.approvedBy || "-",
        approved_at: formatDateTime(p.approvedAt),
        rejected_by: p.rejectedBy || "-",
        rejected_at: formatDateTime(p.rejectedAt),
        rejection_reason: p.rejectionReason || "-",
        checked_in_by: p.checkedInBy || "-",
        checked_in_at: formatDateTime(p.checkedInAt),
        checked_out_by: p.checkedOutBy || "-",
        checked_out_at: formatDateTime(p.checkedOutAt),
        "checked-in": formatDateTime(p.checkedInAt),
        "checked-out": formatDateTime(p.checkedOutAt),
      };
    });

    const totalCompaniesGuest = mappedPasses.length;
    const todaysGuest = mappedPasses.filter(
      (p) => p.pass_date === todayStr,
    ).length;

    return {
      stats: { totalCompaniesGuest, todaysGuest },
      requestPassData: mappedPasses.filter((p) => p.status === "Requested"),
      pendingApprovalPassData: mappedPasses.filter(
        (p) => p.status === "Pending",
      ),
      approvedPassData: mappedPasses.filter((p) => p.status === "Approved"),
      insidePassData: mappedPasses.filter((p) => p.status === "Checked-In"),
      exitApprovedPassData: mappedPasses.filter(
        (p) => p.status === "Checked-Out",
      ),
      expiredPassData: mappedPasses.filter((p) => p.status === "Expired"),
      rejectedPassData: mappedPasses.filter((p) => p.status === "Rejected"),
    };
  } catch (err) {
    logger_utils.error(`getDashboardDataService error: ${err.message}`);
    throw new Error(err.message);
  }
};

const deletePassService = async (idOrCode) => {
  try {
    const pass = await db.formdata.findFirst({
      where: {
        OR: [{ id: idOrCode }, { gatePassId: idOrCode }],
      },
      include: { persondetail: true },
    });
    if (!pass) throw new Error(`Gate pass not found with code/ID: ${idOrCode}`);

    const currentStatus = resolveStatus(pass);
    const nonDeletable = ["Checked-In", "Checked-Out"];
    if (nonDeletable.includes(currentStatus)) {
      throw new Error(
        `Cannot delete a pass that is currently ${currentStatus}.`,
      );
    }

    // Delete photos from Cloudinary
    if (pass.photoUrl) await deleteFromCloudinary(pass.photoUrl);

    for (const person of pass.persondetail) {
      if (person.aadharFileUrl)
        await deleteFromCloudinary(person.aadharFileUrl);
    }

    // Delete pass (cascades automatically in DB, or manual delete of details if Cascade wasn't fully supported)
    // Wait, in schema.prisma: onDelete: Cascade is configured on PersonDetail relation!
    // So we can just delete the FormData row, and Prisma will delete the PersonDetails.
    await db.formdata.delete({
      where: { id: pass.id },
    });

    logger_utils.info(`Gate pass ${pass.id} deleted successfully`);
    return { success: true, message: "Gate pass deleted" };
  } catch (err) {
    logger_utils.error(`deletePassService error: ${err.message}`);
    throw new Error(err.message);
  }
};

const getVisitorByMobileService = async (mobileNo) => {
  try {
    const pass = await db.formdata.findFirst({
      where: { mobileNo },
      orderBy: { createdAt: "desc" },
    });
    if (!pass) return null;
    return {
      name: pass.name || "",
      emailId: pass.emailId || "",
      companyName: pass.companyName || "",
      address: pass.address || "",
      state: pass.state || "",
      city: pass.city || "",
      representingVisitorType: pass.representingVisitorType || "",
      idType: pass.idType || "PASSPORT",
      idNumber: pass.idNumber || "",
      subLocation: pass.subLocation || "",
      toMeetWith: pass.toMeetWith || "",
      carryWith: parseJsonField(pass.carryWith),
      visitArea: parseJsonField(pass.visitArea),
      purpose: pass.purpose || "",
      allowedHours: pass.allowedHours || "",
    };
  } catch (err) {
    logger_utils.error(`getVisitorByMobileService error: ${err.message}`);
    throw new Error(err.message);
  }
};

export default {
  processForm,
  getPassesService,
  updatePassStatusService,
  getPassByIdService,
  getDashboardDataService,
  deletePassService,
  getVisitorByMobileService,
};

export {
  processForm,
  getPassesService,
  updatePassStatusService,
  getPassByIdService,
  getDashboardDataService,
  deletePassService,
  getVisitorByMobileService,
};
