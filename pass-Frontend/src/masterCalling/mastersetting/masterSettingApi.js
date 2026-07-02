import {
  queryGet,
  queryPost,
  queryPut,
  queryDelete,
} from "@/shared/services/api";
import { API_ENDPOINTS } from "@/shared/const/api";

const unwrapData = (res) => res.data?.data || res.data;

// ─── Employee CRUD ────────────────────────────────────────────────────────────
export const getEmployee = () =>
  queryGet(API_ENDPOINTS.EMPLOYEE, {}, { cache: true, tags: ["employee"] })
    .then((res) => unwrapData(res).employee || unwrapData(res));

export const createEmployee = (payload) =>
  queryPost(API_ENDPOINTS.EMPLOYEE, payload, {}, { invalidateTags: ["employee"] })
    .then(unwrapData);

export const updateEmployee = (id, payload) =>
  queryPut(`${API_ENDPOINTS.EMPLOYEE}/${id}`, payload, {}, {
    invalidateTags: ["employee", `employee/${id}`],
  }).then((res) => unwrapData(res).employee || unwrapData(res));

export const deleteEmployee = (id) =>
  queryDelete(`${API_ENDPOINTS.EMPLOYEE}/${id}`, {}, {
    invalidateTags: ["employee", `employee/${id}`],
  }).then((res) => unwrapData(res).employee || unwrapData(res));

// ─── Purpose CRUD ─────────────────────────────────────────────────────────────
export const getPurpose = () =>
  queryGet(API_ENDPOINTS.PURPOSE, {}, { cache: true, tags: ["purpose"] })
    .then((res) => unwrapData(res).purposes || unwrapData(res).purpose || unwrapData(res));

export const createPurpose = (payload) =>
  queryPost(API_ENDPOINTS.PURPOSE, payload, {}, { invalidateTags: ["purpose"] })
    .then((res) => unwrapData(res).purpose || unwrapData(res));

export const updatePurpose = (id, payload) =>
  queryPut(`${API_ENDPOINTS.PURPOSE}/${id}`, payload, {}, {
    invalidateTags: ["purpose", `purpose/${id}`],
  }).then((res) => unwrapData(res).purpose || unwrapData(res));

export const deletePurpose = (id) =>
  queryDelete(`${API_ENDPOINTS.PURPOSE}/${id}`, {}, {
    invalidateTags: ["purpose", `purpose/${id}`],
  }).then((res) => unwrapData(res).purpose || unwrapData(res));

// ─── Visiting Area CRUD ───────────────────────────────────────────────────────
export const getVisitingArea = () =>
  queryGet(API_ENDPOINTS.VISITING_AREA, {}, { cache: true, tags: ["area"] })
    .then((res) => unwrapData(res).visitingAreas || unwrapData(res).visitingArea || unwrapData(res));

export const createVisitingArea = (payload) =>
  queryPost(API_ENDPOINTS.VISITING_AREA, payload, {}, { invalidateTags: ["area"] })
    .then((res) => unwrapData(res).visitingArea || unwrapData(res));

export const updateVisitingArea = (id, payload) =>
  queryPut(`${API_ENDPOINTS.VISITING_AREA}/${id}`, payload, {}, {
    invalidateTags: ["area", `area/${id}`],
  }).then((res) => unwrapData(res).visitingArea || unwrapData(res));

export const deleteVisitingArea = (id) =>
  queryDelete(`${API_ENDPOINTS.VISITING_AREA}/${id}`, {}, {
    invalidateTags: ["area", `area/${id}`],
  }).then((res) => unwrapData(res).visitingArea || unwrapData(res));

// ─── Visitor Type CRUD ────────────────────────────────────────────────────────
export const getVisitorType = () =>
  queryGet(API_ENDPOINTS.VISITOR_TYPE, {}, { cache: true, tags: ["visitorType"] })
    .then((res) => unwrapData(res).visitorTypes || unwrapData(res).visitorType || unwrapData(res));

export const createVisitorType = (payload) =>
  queryPost(API_ENDPOINTS.VISITOR_TYPE, payload, {}, { invalidateTags: ["visitorType"] })
    .then((res) => unwrapData(res).visitorType || unwrapData(res));

export const updateVisitorType = (id, payload) =>
  queryPut(`${API_ENDPOINTS.VISITOR_TYPE}/${id}`, payload, {}, {
    invalidateTags: ["visitorType", `visitorType/${id}`],
  }).then((res) => unwrapData(res).visitorType || unwrapData(res));

export const deleteVisitorType = (id) =>
  queryDelete(`${API_ENDPOINTS.VISITOR_TYPE}/${id}`, {}, {
    invalidateTags: ["visitorType", `visitorType/${id}`],
  }).then((res) => unwrapData(res).visitorType || unwrapData(res));

// ─── Carry With CRUD ──────────────────────────────────────────────────────────
export const getCarryWith = () =>
  queryGet(API_ENDPOINTS.CARRY_WITH, {}, { cache: true, tags: ["carryWith"] })
    .then((res) => unwrapData(res).carryWithItems || unwrapData(res).carryWithItem || unwrapData(res));

export const createCarryWith = (payload) =>
  queryPost(API_ENDPOINTS.CARRY_WITH, payload, {}, { invalidateTags: ["carryWith"] })
    .then((res) => unwrapData(res).carryWithItem || unwrapData(res));

export const updateCarryWith = (id, payload) =>
  queryPut(`${API_ENDPOINTS.CARRY_WITH}/${id}`, payload, {}, {
    invalidateTags: ["carryWith", `carryWith/${id}`],
  }).then((res) => unwrapData(res).carryWithItem || unwrapData(res));

export const deleteCarryWith = (id) =>
  queryDelete(`${API_ENDPOINTS.CARRY_WITH}/${id}`, {}, {
    invalidateTags: ["carryWith", `carryWith/${id}`],
  }).then((res) => unwrapData(res).carryWithItem || unwrapData(res));

// ─── Department CRUD ──────────────────────────────────────────────────────────
export const getDepartment = () =>
  queryGet(API_ENDPOINTS.DEPARTMENT, {}, { cache: true, tags: ["department"] })
    .then((res) => unwrapData(res).departments || unwrapData(res).department || unwrapData(res));

export const createDepartment = (payload) =>
  queryPost(API_ENDPOINTS.DEPARTMENT, payload, {}, { invalidateTags: ["department"] })
    .then((res) => unwrapData(res).department || unwrapData(res));

export const updateDepartment = (id, payload) =>
  queryPut(`${API_ENDPOINTS.DEPARTMENT}/${id}`, payload, {}, {
    invalidateTags: ["department", `department/${id}`],
  }).then((res) => unwrapData(res).department || unwrapData(res));

export const deleteDepartment = (id) =>
  queryDelete(`${API_ENDPOINTS.DEPARTMENT}/${id}`, {}, {
    invalidateTags: ["department", `department/${id}`],
  }).then((res) => unwrapData(res).department || unwrapData(res));

// ─── Location CRUD ────────────────────────────────────────────────────────────
export const getLocation = () =>
  queryGet(API_ENDPOINTS.LOCATION, {}, { cache: true, tags: ["location"] })
    .then((res) => unwrapData(res).locations || unwrapData(res).location || unwrapData(res));

export const createLocation = (payload) =>
  queryPost(API_ENDPOINTS.LOCATION, payload, {}, { invalidateTags: ["location"] })
    .then((res) => unwrapData(res).location || unwrapData(res));

export const updateLocation = (id, payload) =>
  queryPut(`${API_ENDPOINTS.LOCATION}/${id}`, payload, {}, {
    invalidateTags: ["location", `location/${id}`],
  }).then((res) => unwrapData(res).location || unwrapData(res));

export const deleteLocation = (id) =>
  queryDelete(`${API_ENDPOINTS.LOCATION}/${id}`, {}, {
    invalidateTags: ["location", `location/${id}`],
  }).then((res) => unwrapData(res).location || unwrapData(res));

// ─── ID Type CRUD ─────────────────────────────────────────────────────────────
export const getIdType = () =>
  queryGet(API_ENDPOINTS.ID_TYPE, {}, { cache: true, tags: ["idType"] })
    .then((res) => unwrapData(res).idTypes || unwrapData(res).idType || unwrapData(res));

export const createIdType = (payload) =>
  queryPost(API_ENDPOINTS.ID_TYPE, payload, {}, { invalidateTags: ["idType"] })
    .then((res) => unwrapData(res).idType || unwrapData(res));

export const updateIdType = (id, payload) =>
  queryPut(`${API_ENDPOINTS.ID_TYPE}/${id}`, payload, {}, {
    invalidateTags: ["idType", `idType/${id}`],
  }).then((res) => unwrapData(res).idType || unwrapData(res));

export const deleteIdType = (id) =>
  queryDelete(`${API_ENDPOINTS.ID_TYPE}/${id}`, {}, {
    invalidateTags: ["idType", `idType/${id}`],
  }).then((res) => unwrapData(res).idType || unwrapData(res));

// ─── Company Register (singleton, update only) ────────────────────────────────
export const getCompanyRegister = () =>
  queryGet(API_ENDPOINTS.COMPANY_REGISTER, {}, { cache: true, tags: ["companyRegister"] })
    .then((res) => unwrapData(res).companyRegister ?? null);

export const updateCompanyRegister = (formData) =>
  queryPut(API_ENDPOINTS.COMPANY_REGISTER, formData, {}, {
    invalidateTags: ["companyRegister"],
  }).then((res) => unwrapData(res).companyRegister ?? unwrapData(res));
