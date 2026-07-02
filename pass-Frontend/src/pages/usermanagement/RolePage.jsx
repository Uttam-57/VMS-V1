import { useState, useEffect } from "react";
import { getRoles, deleteRole } from "@/masterCalling/usermanagement/userManagementApi";
import { Shield, Plus, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RolePage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();
      if (res?.data?.data) {
        setRoles(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(id === "superadmin") return;
    if(!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRole(id);
      setToast({ show: true, message: "Role deleted.", type: "success" });
      setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
      fetchRoles();
    } catch(err) {
      setToast({ show: true, message: "Error deleting role", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "error" }), 5000);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-full relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-lg shadow-lg text-white animate-in slide-in-from-top-5 ${toast.type === "error" ? "bg-red-650" : "bg-primary"}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-primary rounded-lg">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Role Management</h1>
            <p className="text-slate-500 text-sm mt-1">Configure security roles and modular access controls.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/role-config/new')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-colors border-0 cursor-pointer shadow-sm"
        >
          <Plus size={18} />
          Create Role
        </button>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading roles...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Role Name</th>
                <th className="p-4 font-semibold">Visibility Scope</th>
                <th className="p-4 font-semibold">Privileges</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Unchangeable Super Admin Row */}
              <tr className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-800">Super Admin</div>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-[#F3F4F6] text-[#1F2937] border border-slate-200 rounded-full font-medium">Global Access</span>
                </td>
                <td className="p-4">
                  <span className="text-xs px-3 py-1 bg-[#F3F4F6] text-[#1F2937] rounded-full border border-slate-200">
                    ALL DATA (GLOBAL)
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-xs font-medium text-[#1F2937] bg-[#F3F4F6] px-2 py-1 rounded border border-slate-200">All Modules</span>
                </td>
                <td className="p-4 text-right">
                  <span className="text-xs text-slate-400 italic">Unchangeable</span>
                </td>
              </tr>
              {roles.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{r.name}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-3 py-1 bg-[#F3F4F6] text-[#1F2937] rounded-full border border-slate-200">
                      {r.dataVisibility?.replace('_', ' ').toUpperCase() || "ASSIGNED EMPLOYEE"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {(() => {
                        let perms = {};
                        try { perms = typeof r.permissions === 'string' ? JSON.parse(r.permissions) : (r.permissions || {}); } catch(e){}
                        const activeCount = Object.values(perms).filter(Boolean).length;
                        return activeCount > 0 
                          ? <span className="text-xs font-medium text-[#1F2937] bg-[#F3F4F6] px-2 py-1 rounded border border-slate-200">{activeCount} modules</span>
                          : <span className="text-xs text-slate-400">None</span>
                      })()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => navigate(`/role-config/edit/${r.id}`)} className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded transition-colors" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors ml-2" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-slate-500">No roles found. Create one to get started.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
