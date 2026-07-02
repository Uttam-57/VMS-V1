import { Outlet, Link, useLocation } from "react-router-dom";
import { Navbar } from "@/shared/ui/organisms/Navbar";
import { Sidebar, SidebarItem, SidebarGroup } from "@/shared/ui/organisms/Sidebar";
import { Footer } from "@/shared/ui/organisms/Footer";
import {
  Package,
  LogOut,
  UserRoundCog,
  Factory,
  FilePlus,
  Users,
  DoorOpen,
  Presentation,
  Settings,
  Building,
  Network,
  Map,
  IdCard,
  FileText,
  Calendar,
  Printer,
  Sliders,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/shared/ui/atoms/Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { stringToColor } from "@/shared/utils/stringToColor";
import { logout } from "@/masterCalling/auth/authApi";

export const DashboardLayout = () => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.role === 'superadmin' || parsed.id === 'superadmin') {
          setPermissions({ dashboard: true, create_pass: true, master_settings: true, user_management: true, reports: true, print: true });
        } else if (parsed.userRole?.permissions) {
          let perms = typeof parsed.userRole.permissions === 'string' 
            ? JSON.parse(parsed.userRole.permissions) 
            : parsed.userRole.permissions;
          setPermissions(perms || {});
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch(e) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const userInitials = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const userColor = user?.name ? stringToColor(user.name) : "#cbd5e1";

  return (
    <div className="dashboard-layout">
      <Navbar>
        <div className="dashboard-navbar-content">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-transparent border-0 cursor-pointer p-1.5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu size={22} />
            </button>
            <div className="dashboard-logo">VMS</div>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <Link to="/profile" className="relative">
              <button 
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-slate-800 transition-colors bg-transparent border-0 cursor-pointer"
              >
                <div 
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white font-bold shadow-sm"
                >
                  {userInitials}
                </div>
                <span className="font-semibold text-slate-200 hidden sm:block mr-1">
                  {user?.name || "User"}
                </span>
              </button>
            </Link>
            
            <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout} className="text-slate-400 hover:text-rose-450 hover:bg-slate-800 border-0 cursor-pointer bg-transparent">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </Navbar>

      {/* Mobile Drawer Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] md:hidden"
        />
      )}

      <div className="dashboard-body">
        <Sidebar className={isSidebarOpen ? "sidebar-visible" : "sidebar-hidden"}>
          {/* Mobile-only menu header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50 mb-2 md:hidden">
            <span className="font-bold text-slate-200 text-lg">VMS Navigator</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="bg-transparent border-0 cursor-pointer text-slate-400 hover:text-slate-200 p-1 flex items-center"
            >
              <X size={20} />
            </button>
          </div>

          {permissions.dashboard && (
            <Link to="/dashboard" onClick={handleLinkClick} className="no-underline">
              <SidebarItem icon={Presentation} label="Dashboard" isActive={location.pathname === "/dashboard"} />
            </Link>
          )}

          {permissions.create_pass && (
            <Link to="/create-pass" onClick={handleLinkClick} className="no-underline">
              <SidebarItem icon={FilePlus} label="Create Pass" isActive={location.pathname === "/create-pass"} />
            </Link>
          )}

          {permissions.user_management && (
            <SidebarGroup 
              icon={Users} 
              label="User Management"
              isActive={
                location.pathname === "/role-config" || 
                location.pathname.startsWith("/role-config/") || 
                location.pathname === "/user-config" || 
                location.pathname.startsWith("/user-config/") || 
                location.pathname === "/user-approvals"
              }
            >
              <Link to="/role-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={UserRoundCog} label="Roles" isActive={location.pathname === "/role-config" || location.pathname.startsWith("/role-config/")} />
              </Link>
              <Link to="/user-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={Users} label="Users" isActive={location.pathname === "/user-config" || location.pathname.startsWith("/user-config/")} />
              </Link>
              <Link to="/user-approvals" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={DoorOpen} label="Approvals" isActive={location.pathname === "/user-approvals"} />
              </Link>
            </SidebarGroup>
          )}

          {permissions.master_settings && (
            <SidebarGroup 
              icon={Settings} 
              label="Master Settings"
              isActive={[
                "/company-register-config",
                "/department-config",
                "/employee-config",
                "/visiting-area-config",
                "/location-config",
                "/visitor-type-config",
                "/purpose-config",
                "/id-type-config",
                "/carry-with-config"
              ].includes(location.pathname)}
            >
              {user?.id === "superadmin" && (
                <Link to="/company-register-config" onClick={handleLinkClick} className="no-underline">
                  <SidebarItem icon={Building} label="Company Register" isActive={location.pathname === "/company-register-config"} />
                </Link>
              )}
              <Link to="/department-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={Network} label="Department" isActive={location.pathname === "/department-config"} />
              </Link>
              <Link to="/employee-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={UserRoundCog} label="Employee" isActive={location.pathname === "/employee-config"} />
              </Link>
              <Link to="/visiting-area-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={Factory} label="Visiting Area" isActive={location.pathname === "/visiting-area-config"} />
              </Link>
              <Link to="/location-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={Map} label="Location" isActive={location.pathname === "/location-config"} />
              </Link>
              <Link to="/visitor-type-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={Users} label="Visitor Type" isActive={location.pathname === "/visitor-type-config"} />
              </Link>
              <Link to="/purpose-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={DoorOpen} label="Purpose" isActive={location.pathname === "/purpose-config"} />
              </Link>
              <Link to="/id-type-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={IdCard} label="Id Type" isActive={location.pathname === "/id-type-config"} />
              </Link>
              <Link to="/carry-with-config" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={Package} label="Carry With" isActive={location.pathname === "/carry-with-config"} />
              </Link>
            </SidebarGroup>
          )}

          {permissions.reports && (
            <SidebarGroup 
              icon={FileText} 
              label="Reports"
              isActive={["/report/generate", "/report/today"].includes(location.pathname)}
            >
              <Link to="/report/generate" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={FilePlus} label="Generate Report" isActive={location.pathname === "/report/generate"} />
              </Link>
              <Link to="/report/today" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={Calendar} label="Inside Report" isActive={location.pathname === "/report/today"} />
              </Link>
            </SidebarGroup>
          )}

          {permissions.print && (
            <SidebarGroup 
              icon={Printer} 
              label="Print Settings"
              isActive={["/report/print-pass", "/report/print-settings"].includes(location.pathname)}
            >
              <Link to="/report/print-pass" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={Printer} label="Print Pass by ID" isActive={location.pathname === "/report/print-pass"} />
              </Link>
              <Link to="/report/print-settings" onClick={handleLinkClick} className="no-underline">
                <SidebarItem icon={Sliders} label="Print Setting" isActive={location.pathname === "/report/print-settings"} />
              </Link>
            </SidebarGroup>
          )}
        </Sidebar>
        
        <main className="dashboard-main">
          <div className="dashboard-content">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
