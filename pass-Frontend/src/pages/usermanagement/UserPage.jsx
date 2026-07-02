/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "@/masterCalling/usermanagement/userManagementApi";
import { Users, Plus, Edit2, Trash2, Search,  CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      if (res?.data?.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setToast({ show: true, message: "User deleted successfully", type: "success" });
      setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
      fetchUsers();
    // eslint-disable-next-line no-unused-vars
    } catch(err) {
      setToast({ show: true, message: "Error deleting user", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "error" }), 5000);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="um-page flex flex-col">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"} toast-visible`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 page-section bg-white p-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="icon-box">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            <p className="page-subtitle">Manage system access, roles, and employee profiles.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="field-input pl-10"
            />
          </div>
         
          <button 
            onClick={() => navigate("/user-config/new")}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-colors border-0 cursor-pointer shadow-sm shrink-0"
          >
            <Plus size={18} />
            Create User
          </button>
        </div>
      </div>

        <div className="flex-1 page-section overflow-hidden flex flex-col">
        {loading ? (
          <div className="loading-center">
            <div className="loading-spinner" />
            <span className="loading-text">Loading user profiles...</span>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold w-12 text-center">Status</th>
                  <th className="p-4 font-semibold">User Details</th>
                  <th className="p-4 font-semibold">System Role</th>
                  <th className="p-4 font-semibold">Employee Details</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 text-center">
                      <div className="flex justify-center" title={u.active ? "Active" : "Deactivated"}>
                        {u.active ? <CheckCircle2 size={20} className="text-success" /> : <XCircle size={20} className="text-slate-300" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-primary font-bold flex items-center justify-center shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-slate-800 truncate max-w-[150px]" title={u.name}>{u.name}</h3>
                          <p className="text-xs text-slate-500 truncate" title={u.email}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="badge-neutral">
                          {u.userRole?.name || "Unassigned"}
                        </span>
                        {u.isSecurity && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded uppercase tracking-wider">
                            Security Guard
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {u.employee ? (
                        <div>
                          <div className="text-sm font-medium text-slate-700">{u.employee.designation || 'Employee'}</div>
                          <div className="text-xs text-slate-500 flex gap-2 mt-0.5">
                            <span>ID: {u.employee.employeeId}</span>
                            {u.employee.department && <span>&bull; {u.employee.department}</span>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic bg-slate-50 px-2 py-1 rounded border border-slate-100">Not Linked</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => navigate(`/user-config/edit/${u.id}`)} className="action-icon-btn action-icon-btn-edit" title="Edit User">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="action-icon-btn action-icon-btn-delete ml-1" title="Delete User">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center">
                      <div className="text-slate-400 mb-2">
                        <Search size={32} className="mx-auto opacity-50" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-600">No users found</h3>
                      <p className="text-sm text-slate-500 mt-1">Try adjusting your search or create a new user.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
