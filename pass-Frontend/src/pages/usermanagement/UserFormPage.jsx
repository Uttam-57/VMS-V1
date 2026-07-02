import { useState, useEffect, useRef } from "react";
import { queryGet } from "@/shared/services/api";
import { getUserById, createUser, updateUser, getRoles } from "@/masterCalling/usermanagement/userManagementApi";
import { Users, Save, ArrowLeft, Shield, UserCircle, MapPin, Briefcase, X } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

export const UserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [unlinkedEmployees, setUnlinkedEmployees] = useState([]);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
    active: true,
    isSecurity: false,
    locationId: "",
    employeeCode: "",
    phone: "",
    department: "",
    designation: "",
    employeeLocationId: "",
    employeeId: ""
  });

  useEffect(() => {
    fetchMasterData();
    if (isEditing) {
      fetchUser();
    }
  }, [id]);

  const fetchMasterData = async () => {
    try {
      const rolesRes = await getRoles();
      if (rolesRes?.data?.data) setRoles(rolesRes.data.data);

      const locsRes = await queryGet("/master/location");
      if (locsRes?.data?.data?.location) setLocations(locsRes.data.data.location);
      else if (Array.isArray(locsRes?.data?.data)) setLocations(locsRes.data.data);

      const deptsRes = await queryGet("/master/department");
      if (deptsRes?.data?.data?.department) setDepartments(deptsRes.data.data.department);
      else if (Array.isArray(deptsRes?.data?.data)) setDepartments(deptsRes.data.data);

      const empsRes = await queryGet("/master/employee");
      const empList = empsRes?.data?.data?.employees || empsRes?.data?.data;
      if (Array.isArray(empList)) {
        setUnlinkedEmployees(empList.filter(emp => !emp.user));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await getUserById(id);
      if (res?.data?.data) {
        const u = res.data.data;
        setFormData({
          name: u.name || "",
          email: u.email || "",
          password: "",
          roleId: u.roleId || "",
          active: u.active ?? true,
          isSecurity: u.isSecurity || false,
          locationId: u.locationId || "",
          employeeCode: u.employee?.employeeId || "",
          phone: u.employee?.phone || "",
          department: u.employee?.department || "",
          designation: u.employee?.designation || "",
          employeeLocationId: u.employee?.locationId || "",
          employeeId: u.employee?.id || ""
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkEmailAvailability = async (email, excludeId) => {
    if (!email || !email.includes("@")) return;
    try {
      const res = await queryGet(`/user/check-email?email=${encodeURIComponent(email)}&excludeId=${excludeId || ""}`);
      if (res?.data?.data?.exists) {
        setEmailError("This email is already in use by another user account");
      } else {
        setEmailError("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmailBlur = () => {
    checkEmailAvailability(formData.email, id);
  };

  const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
  const [empSearch, setEmpSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEmpDropdownOpen(false);
        const selected = unlinkedEmployees.find(e => e.id === formData.employeeId);
        if (selected) {
          setEmpSearch(`${selected.name} (${selected.employeeId})`);
        } else {
          setEmpSearch("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [unlinkedEmployees, formData.employeeId]);

  const selectEmployee = (emp) => {
    if (!emp) {
      setFormData(prev => ({
        ...prev,
        employeeId: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        employeeLocationId: "",
        employeeCode: ""
      }));
      setEmpSearch("");
      setIsEmpDropdownOpen(false);
      setEmailError("");
      return;
    }

    setFormData(prev => ({
      ...prev,
      employeeId: emp.id,
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || "",
      designation: emp.designation || "",
      employeeLocationId: emp.locationId || "",
      employeeCode: emp.employeeId || ""
    }));
    setEmpSearch(`${emp.name} (${emp.employeeId})`);
    setIsEmpDropdownOpen(false);
    checkEmailAvailability(emp.email, "");
  };

  const filteredEmployees = unlinkedEmployees.filter(emp => {
    const searchVal = empSearch.toLowerCase();
    const selected = unlinkedEmployees.find(e => e.id === formData.employeeId);
    if (selected && empSearch === `${selected.name} (${selected.employeeId})`) {
      return true;
    }
    const name = (emp.name || "").toLowerCase();
    const dept = (emp.department || "").toLowerCase();
    const idVal = (emp.employeeId || "").toLowerCase();
    return name.includes(searchVal) || dept.includes(searchVal) || idVal.includes(searchVal);
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (emailError) {
      setToast({ show: true, message: "Please resolve the email duplicate error before saving.", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "error" }), 5000);
      return;
    }
    setSaving(true);
    try {
      if (isEditing) {
        await updateUser(id, formData);
      } else {
        await createUser(formData);
      }
      navigate("/user-config", { state: { successMessage: `User ${isEditing ? 'updated' : 'created'} successfully!` } });
    } catch (err) {
      setToast({ show: true, message: "Failed to save user: " + (err.response?.data?.message || err.message), type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "error" }), 5000);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="loading-spinner" />
        <span className="loading-text">Loading user details...</span>
      </div>
    );
  }

  return (
    <div className="um-page relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"} toast-visible`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <Link to="/user-config" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-medium mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Users
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="icon-box">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{isEditing ? "Edit User Account" : "Create New User"}</h1>
              <p className="text-slate-500 text-sm mt-1">{isEditing ? "Modify user access and employee details simultaneously." : "Setup a system account and link an employee profile."}</p>
            </div>
          </div>
          {isEditing && (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-sm font-semibold text-slate-700">Account Status:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                <div className={`toggle-track ${formData.active ? "toggle-track-on" : "toggle-track-off"}`}>
                  <div className={`toggle-thumb ${formData.active ? "toggle-thumb-on" : "toggle-thumb-off"}`} />
                </div>
              </label>
              <span className={`text-sm font-bold ${formData.active ? "text-success" : "text-slate-400"}`}>{formData.active ? "Active" : "Disabled"}</span>
            </div>
          )}
        </div>
      </div>

      <form id="userForm" onSubmit={handleSave} className="space-y-6">

        {/* Promote Existing Employee Option */}
        {!isEditing && (
          <div className="um-card">
            <div className="um-card-header">
              <Briefcase size={20} className="text-primary" />
              <h2 className="um-card-title">Promote Existing Employee to User (Optional)</h2>
            </div>
            <div className="um-card-body">
              <div className="relative w-full md:w-2/3 lg:w-1/2" ref={dropdownRef}>
                <label htmlFor="empSearchInput" className="field-label">Search & Select Employee</label>
                <div className="relative">
                  <input
                    id="empSearchInput"
                    type="text"
                    value={empSearch}
                    onChange={e => {
                      setEmpSearch(e.target.value);
                      setIsEmpDropdownOpen(true);
                      if (!e.target.value) {
                        selectEmployee(null);
                      }
                    }}
                    onFocus={() => setIsEmpDropdownOpen(true)}
                    className="field-input pr-10"
                    placeholder="Type name, department, or employee ID to search..."
                    autoComplete="off"
                  />
                  {formData.employeeId ? (
                    <button
                      type="button"
                      onClick={() => selectEmployee(null)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <X size={16} />
                    </button>
                  ) : (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                  )}
                </div>

                {isEmpDropdownOpen && (
                  <div className="absolute z-[200] left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl divide-y divide-slate-100">
                    {filteredEmployees.length === 0 ? (
                      <div className="p-3 text-sm text-slate-500 text-center">No matching employees found</div>
                    ) : (
                      filteredEmployees.map(emp => (
                        <div
                          key={emp.id}
                          onClick={() => selectEmployee(emp)}
                          className={`p-3 text-sm text-left hover:bg-slate-50 cursor-pointer flex flex-col gap-0.5 transition-colors ${formData.employeeId === emp.id ? "bg-indigo-50/50 hover:bg-indigo-50" : ""}`}
                        >
                          <span className="font-bold text-slate-800">{emp.name}</span>
                          <span className="text-xs text-slate-500">Code: <strong className="text-primary">{emp.employeeId}</strong> | Dept: {emp.department}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Type directly to search by name, department, or employee ID. Selecting an employee will pre-fill their details.
              </p>
            </div>
          </div>
        )}

        {/* Core User Details */}
        <div className="um-card">
          <div className="um-card-header">
            <UserCircle size={20} className="text-primary" />
            <h2 className="um-card-title">Account Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="field-label">Full Name *</label>
              <input id="name" name="name" type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="field-input" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="field-label">Email Address *</label>
              <input id="email" name="email" type="email" required value={formData.email} onBlur={handleEmailBlur} onChange={e => setFormData({...formData, email: e.target.value})} className={`field-input ${emailError ? "field-input-error" : ""}`} placeholder="john@company.com" />
              {emailError && <p className="text-xs text-danger mt-1 font-semibold">{emailError}</p>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="password" className="field-label">{isEditing ? "Reset Password (leave blank to keep current)" : "Temporary Password *"}</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required={!isEditing} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="field-input" placeholder="••••••••" />
            </div>
          </div>
        </div>

        {/* Security & Role */}
        <div className="um-card">
          <div className="um-card-header">
            <Shield size={20} className="text-primary" />
            <h2 className="um-card-title">System Role & Access</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <label className="field-label">Assign System Role *</label>
              <select required value={formData.roleId} onChange={e => setFormData({...formData, roleId: e.target.value})} className="field-select w-full md:w-1/2">
                <option value="">-- Select Role --</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div className={`p-5 rounded-xl border transition-colors ${formData.isSecurity ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}>
              <label className="flex items-start gap-4 cursor-pointer">
                <div className="pt-1">
                  <input type="checkbox" checked={formData.isSecurity} onChange={e => setFormData({...formData, isSecurity: e.target.checked})} className="w-5 h-5 accent-warning rounded border-slate-300" />
                </div>
                <div className="flex-1">
                  <span className="block text-base font-bold text-slate-800">Security Guard Account</span>
                  <span className="block text-sm text-slate-500 mt-1">If enabled, this user will manage Gate Passes at a specific location and be restricted from other views.</span>
                </div>
              </label>

              {formData.isSecurity && (
                <div className="mt-5 pt-5 border-t border-amber-200 animate-in fade-in slide-in-from-top-2">
                  <label className="field-label flex items-center gap-2 text-amber-900">
                    <MapPin size={16} /> Guard Station Location *
                  </label>
                  <select required value={formData.locationId} onChange={e => setFormData({...formData, locationId: e.target.value})} className="field-select w-full md:w-1/2 border-amber-300 focus:border-amber-500">
                    <option value="">-- Select Guard Location --</option>
                    {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Linked Employee Record */}
        <div className="um-card">
          <div className="um-card-header">
            <Briefcase size={20} className="text-primary" />
            <h2 className="um-card-title">Employee Record (Master Data)</h2>
          </div>
          <div className="um-card-body-muted">
            <p className="text-sm text-slate-600 mb-6 bg-slate-50 text-slate-800 p-3 rounded-lg border border-slate-200">
              <strong>Note:</strong> Editing these fields will automatically update the user's entry in the <strong>Employee Master</strong> database. Employee Master records linked to user accounts can only be edited here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="employeeCode" className="field-label">Employee ID / Code</label>
                <input id="employeeCode" name="employeeCode" type="text" disabled value={formData.employeeCode} className="field-input font-mono" placeholder="Auto-generated on Save" />
              </div>
              <div>
                <label htmlFor="phone" className="field-label">Phone Number</label>
                <input id="phone" name="phone" type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="field-input" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label htmlFor="designation" className="field-label">Designation</label>
                <input id="designation" name="designation" type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="field-input" placeholder="Software Engineer" />
              </div>
              <div>
                <label className="field-label">Department</label>
                <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="field-select">
                  <option value="">-- Select Dept --</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Base Location</label>
                <select value={formData.employeeLocationId} onChange={e => setFormData({...formData, employeeLocationId: e.target.value})} className="field-select">
                  <option value="">-- Select Location --</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex justify-end gap-3 sticky bottom-8">
          <div className="bg-white shadow-lg border border-slate-200 p-3 rounded-2xl flex gap-3">
            <Link to="/user-config" className="px-6 py-2.5 text-slate-700 font-medium hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className={`px-8 py-2.5 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 ${saving ? "bg-slate-400" : "bg-primary hover:bg-primary-hover hover:shadow-lg hover:-translate-y-0.5 border-0 cursor-pointer"}`}>
              <Save size={18} />
              {saving ? "Saving..." : (isEditing ? "Save All Changes" : "Create Account & Profile")}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
