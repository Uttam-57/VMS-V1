import { useState, useEffect } from "react";
import { getUsers, getUserApprovals, saveUserApprovals } from "@/masterCalling/usermanagement/userManagementApi";
import { queryGet } from "@/shared/services/api";
import { Search, Save, Users2, ChevronRight, UserCircle, Plus } from "lucide-react";
import { Pagination } from "@/shared/ui/molecules/Pagination";

export const UserApprovalsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [userSearch, setUserSearch] = useState("");
  const [empSearch, setEmpSearch] = useState("");
  const [isAddMode, setIsAddMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [empSearch, isAddMode, selectedUser]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const usersRes = await getUsers();
      const empsRes = await queryGet("/master/employee");
      
      if (usersRes?.data?.data) {
        setUsers(usersRes.data.data.filter(u => !u.isSecurity));
      }
      if (empsRes?.data?.data?.employees) {
        setAllEmployees(empsRes.data.data.employees);
      } else if (Array.isArray(empsRes?.data?.data)) {
        setAllEmployees(empsRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (userId) => {
    setSelectedUser(userId);
    setIsAddMode(false);
    setEmpSearch("");
    setAssignedEmployees([]);
    
    if (!userId) return;
    
    try {
      const res = await getUserApprovals(userId);
      if (res?.data?.data) {
        setAssignedEmployees(res.data.data.map(e => e.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleEmployee = (empId) => {
    if (assignedEmployees.includes(empId)) {
      setAssignedEmployees(assignedEmployees.filter(id => id !== empId));
    } else {
      setAssignedEmployees([...assignedEmployees, empId]);
    }
  };

  const handleBulkToggle = (filteredIds, forceAssign) => {
    let newSet = new Set(assignedEmployees);
    filteredIds.forEach(id => {
      if (forceAssign) newSet.add(id);
      else newSet.delete(id);
    });
    setAssignedEmployees(Array.from(newSet));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await saveUserApprovals(selectedUser, assignedEmployees);
      setToast({ show: true, message: "Approval scope saved successfully!", type: "success" });
      setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    } catch (err) {
      setToast({ show: true, message: "Failed to update approvals.", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "error" }), 5000);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredEmps = allEmployees.filter(e => 
    e.name.toLowerCase().includes(empSearch.toLowerCase()) || 
    (e.department && e.department.toLowerCase().includes(empSearch.toLowerCase())) ||
    (e.employeeId && e.employeeId.toLowerCase().includes(empSearch.toLowerCase()))
  );

  const filteredAndModeEmps = filteredEmps.filter(emp => isAddMode ? !assignedEmployees.includes(emp.id) : assignedEmployees.includes(emp.id));
  const totalItems = filteredAndModeEmps.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEmps = filteredAndModeEmps.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 max-w-[1600px] mx-auto bg-slate-50 min-h-full flex flex-col relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-lg shadow-lg text-white animate-in slide-in-from-top-5 ${toast.type === "error" ? "bg-red-600" : "bg-primary"}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-primary rounded-lg">
            <Users2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Approval Workflows</h1>
            <p className="text-slate-500 text-sm mt-1">Assign which employees report to which approving user.</p>
          </div>
        </div>
        
        {selectedUser && (
          <button 
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all border-0 cursor-pointer shadow-sm ${saving ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-primary hover:bg-primary-hover text-white hover:shadow-md'}`}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 flex-1 flex items-center justify-center">Loading workspace...</div>
      ) : (
        <div className="flex gap-6 flex-1 min-h-0">
          
          {/* Left Pane: Select User */}
          <div className="w-[400px] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden shrink-0">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <UserCircle size={18} className="text-slate-400" />
                Select Approving User
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {filteredUsers.map(u => (
                <div 
                  key={u.id}
                  onClick={() => handleUserSelect(u.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between group ${selectedUser === u.id ? 'bg-indigo-50/50 border border-primary shadow-sm' : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${selectedUser === u.id ? 'bg-indigo-100 text-primary' : 'bg-slate-200 text-slate-600'}`}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className={`font-semibold text-sm truncate ${selectedUser === u.id ? 'text-primary' : 'text-slate-700'}`}>{u.name}</div>
                      <div className="text-xs text-slate-500 truncate">{u.userRole?.name || "No Role"}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`${selectedUser === u.id ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane: Employee Selection */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            {!selectedUser ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                <Users2 size={48} className="mb-4 opacity-20" />
                <h3 className="text-xl font-medium text-slate-500">No User Selected</h3>
                <p className="mt-2 text-center max-w-sm">Select an approving user from the left panel to assign which employees they manage.</p>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-4 flex-1">
                    <h3 className="font-semibold text-slate-800 whitespace-nowrap">
                      {isAddMode ? "Add Employees" : `Assigned Employees (${assignedEmployees.length})`}
                    </h3>
                    <div className="relative max-w-sm w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search employees..." 
                        value={empSearch}
                        onChange={e => setEmpSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 ml-4">
                    {isAddMode ? (
                      <button onClick={() => { setIsAddMode(false); setEmpSearch(""); }} className="text-sm font-medium text-slate-600 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                        Done Adding
                      </button>
                    ) : (
                      <button onClick={() => { setIsAddMode(true); setEmpSearch(""); }} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer border-0">
                        <Plus size={16} /> Add Employee
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-0">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider sticky top-0">
                      <tr>
                        <th className="p-4 font-semibold">Employee</th>
                        <th className="p-4 font-semibold">ID</th>
                        <th className="p-4 font-semibold">Department</th>
                        <th className="p-4 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentEmps.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="p-4">
                            <div className="font-semibold text-slate-800 text-sm">{emp.name}</div>
                            <div className="text-xs text-slate-500">{emp.email || emp.phone || "-"}</div>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">{emp.employeeId}</span>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-slate-700">{emp.department}</div>
                            <div className="text-xs text-slate-500">{emp.designation || "-"}</div>
                          </td>
                          <td className="p-4 text-right">
                            {isAddMode ? (
                              <button onClick={() => toggleEmployee(emp.id)} className="text-primary bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border-0 cursor-pointer">
                                Add
                              </button>
                            ) : (
                              <button onClick={() => toggleEmployee(emp.id)} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {currentEmps.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-12 text-center text-slate-400">
                            {isAddMode ? "No unassigned employees found matching your search." : "No employees assigned to this user."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination 
                  currentPage={currentPage}
                  totalCount={totalItems}
                  pageSize={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => { setItemsPerPage(newSize); setCurrentPage(1); }}
                  className="border-t border-slate-100 bg-slate-50"
                />
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
};
