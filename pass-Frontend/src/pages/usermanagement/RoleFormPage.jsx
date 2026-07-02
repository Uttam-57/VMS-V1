import { useState, useEffect } from "react";
import { getRoleById, createRole, updateRole } from "@/masterCalling/usermanagement/userManagementApi";
import { Shield, Save, ArrowLeft } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";

export const RoleFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const defaultPermissions = {
    dashboard: false,
    create_pass: false,
    master_settings: false,
    user_management: false,
    reports: false,
    print: false
  };

  const [formData, setFormData] = useState({
    name: "",
    dataVisibility: "assigned_employee",
    permissions: { ...defaultPermissions }
  });

  useEffect(() => {
    if (isEditing) {
      fetchRole();
    }
  }, [id]);

  const fetchRole = async () => {
    try {
      const res = await getRoleById(id);
      if (res?.data?.data) {
        const role = res.data.data;
        let parsedPerms = { ...defaultPermissions };
        if (role.permissions) {
          try { 
            const dbPerms = typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions; 
            parsedPerms = { ...parsedPerms, ...dbPerms };
          } catch(e){}
        }
        setFormData({
          name: role.name,
          dataVisibility: role.dataVisibility || "assigned_employee",
          permissions: parsedPerms
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "Error fetching role.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        permissions: formData.permissions
      };
      
      if (isEditing) {
        await updateRole(id, payload);
      } else {
        await createRole(payload);
      }
      
      navigate("/role-config", { state: { successMessage: `Role ${isEditing ? 'updated' : 'created'} successfully!` } });
    } catch (err) {
      setToast({ show: true, message: "Failed to save role: " + (err.response?.data?.message || err.message), type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "error" }), 5000);
    }
  };

  const togglePermission = (key) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
  };

  if (loading) {
    return (
      <div className="loading-center">
        <div className="loading-spinner" />
        <span className="loading-text">Loading role details...</span>
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
        <Link to="/role-config" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-medium mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Roles
        </Link>
        <div className="flex items-center gap-4">
          <div className="icon-box">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{isEditing ? "Edit Role" : "Create New Role"}</h1>
            <p className="page-subtitle">{isEditing ? "Modify an existing security role." : "Set up a new role with custom permissions."}</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="page-section">
        <div className="p-6">
          <form id="roleForm" onSubmit={handleSave} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="field-label">Role Name *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="field-input" placeholder="e.g. HR Manager" />
              </div>
              
              <div>
                <label className="field-label">Data Visibility Scope</label>
                <select value={formData.dataVisibility} onChange={e => setFormData({...formData, dataVisibility: e.target.value})} className="field-select">
                  <option value="global">All Data (Global)</option>
                  <option value="location">Location Only (e.g. Security Guard)</option>
                  <option value="assigned_employee">Assign Employee (Standard Role)</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Controls what records this role can view.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Module Permissions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(formData.permissions).map(([key, value]) => (
                  <div key={key} onClick={() => togglePermission(key)} className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${value ? 'bg-indigo-50 border-indigo-200 shadow-indigo-100' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-100'}`}>
                    <span className="text-sm font-semibold text-slate-700 capitalize">{key.replace('_', ' ')}</span>
                    <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${value ? 'bg-primary' : 'bg-slate-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Link to="/role-config" className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium">Cancel</Link>
          <button type="submit" form="roleForm" className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover border-0 cursor-pointer transition-colors font-medium flex items-center gap-2 shadow-sm">
            <Save size={18} />
            {isEditing ? "Save Changes" : "Create Role"}
          </button>
        </div>
        
      </div>
    </div>
  );
};
