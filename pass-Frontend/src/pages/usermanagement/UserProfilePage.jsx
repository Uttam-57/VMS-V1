import { useState, useEffect } from "react";
import { UserCircle, Mail, Shield, MapPin, BadgeCheck, Phone, Briefcase } from "lucide-react";
import { getUsers } from "@/masterCalling/usermanagement/userManagementApi";

const stringToColor = (str) => {
  if (!str) return "#cbd5e1";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [fullUserDetails, setFullUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Optionally fetch full list to get deep details (like employee link)
          const res = await getUsers();
          if (res?.data?.data) {
            const current = res.data.data.find(u => u.id === parsedUser.id);
            if (current) setFullUserDetails(current);
          }
        }
      } catch (e) {
        console.error("Failed to load user profile", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-full text-slate-500">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-8 flex justify-center items-center h-full text-slate-500">User not found. Please log in again.</div>;
  }

  const displayUser = fullUserDetails || user;
  const userInitials = displayUser.name ? displayUser.name.charAt(0).toUpperCase() : "U";
  const avatarColor = stringToColor(displayUser.name);

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account and view your permissions.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-50/80 border-b border-slate-100 p-8 flex flex-col sm:flex-row items-center gap-6">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-md shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {userInitials}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-slate-800">{displayUser.name}</h2>
            <p className="text-slate-500 font-medium">{displayUser.email}</p>
            <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-semibold border border-teal-100">
                <Shield size={14} />
                {displayUser.userRole?.name || displayUser.role?.replace('_', ' ') || "User"}
              </span>
              {displayUser.isSecurity && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold border border-amber-100">
                  <BadgeCheck size={14} />
                  Security Personnel
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <UserCircle className="text-slate-400" /> Account Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><Mail size={16}/> Email Address</p>
              <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{displayUser.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><Shield size={16}/> System Role</p>
              <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 capitalize">
                {displayUser.userRole?.name || displayUser.role?.replace('_', ' ') || "No Role Assigned"}
              </p>
            </div>

            {displayUser.isSecurity && displayUser.location && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><MapPin size={16}/> Assigned Location</p>
                <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {displayUser.location.name}
                </p>
              </div>
            )}
          </div>

          {/* Linked Employee Info if available */}
          {displayUser.employee && (
            <>
              <div className="h-px bg-slate-100 my-8"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Briefcase className="text-slate-400" /> Employee Profile
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Employee ID</p>
                  <p className="font-semibold text-slate-800">{displayUser.employee.employeeId}</p>
                </div>
                {displayUser.employee.department && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Department</p>
                    <p className="font-semibold text-slate-800">{displayUser.employee.department}</p>
                  </div>
                )}
                {displayUser.employee.designation && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Designation</p>
                    <p className="font-semibold text-slate-800">{displayUser.employee.designation}</p>
                  </div>
                )}
                {displayUser.employee.phone && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2"><Phone size={16}/> Phone</p>
                    <p className="font-semibold text-slate-800">{displayUser.employee.phone}</p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
