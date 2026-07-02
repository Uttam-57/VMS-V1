import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { AuthLayout } from "@/shared/layouts/AuthLayout";
import { MasterSettingLayout } from "@/shared/layouts/MasterSettingLayout";
import { ReportLayout } from "@/shared/layouts/ReportLayout";
import { PrintLayout } from "@/shared/layouts/PrintLayout";

const LoginPage = React.lazy(() => import("@/pages/auth/LoginPage").then(m => ({ default: m.LoginPage })));
const CreatePassPage = React.lazy(() => import("@/pages/createpass/CreatePassPage"));
const EmployeePage = React.lazy(() => import("@/pages/mastersetting/EmployeePage").then(m => ({ default: m.EmployeePage })));
const CarryWithPage = React.lazy(() => import("@/pages/mastersetting/CarryWithPage").then(m => ({ default: m.CarryWithPage })));
const PurposePage = React.lazy(() => import("@/pages/mastersetting/PurposePage").then(m => ({ default: m.PurposePage })));
const VisitorAreaPage = React.lazy(() => import("@/pages/mastersetting/VisitingAreaPage").then(m => ({ default: m.VisitorAreaPage })));
const VisitorTypePage = React.lazy(() => import("@/pages/mastersetting/VisitorTypePage").then(m => ({ default: m.VisitorTypePage })));
const DepartmentPage = React.lazy(() => import("@/pages/mastersetting/DepartmentPage").then(m => ({ default: m.DepartmentPage })));
const CompanyRegisterPage = React.lazy(() => import("@/pages/mastersetting/CompanyRegisterPage").then(m => ({ default: m.CompanyRegisterPage })));
const LocationPage = React.lazy(() => import("@/pages/mastersetting/LocationPage").then(m => ({ default: m.LocationPage })));
const IdTypePage = React.lazy(() => import("@/pages/mastersetting/IdTypePage").then(m => ({ default: m.IdTypePage })));
const RolePage = React.lazy(() => import("@/pages/usermanagement/RolePage").then(m => ({ default: m.RolePage })));
const RoleFormPage = React.lazy(() => import("@/pages/usermanagement/RoleFormPage").then(m => ({ default: m.RoleFormPage })));
const UserPage = React.lazy(() => import("@/pages/usermanagement/UserPage").then(m => ({ default: m.UserPage })));
const UserFormPage = React.lazy(() => import("@/pages/usermanagement/UserFormPage").then(m => ({ default: m.UserFormPage })));
const UserApprovalsPage = React.lazy(() => import("@/pages/usermanagement/UserApprovalsPage").then(m => ({ default: m.UserApprovalsPage })));
const DashboardPage = React.lazy(() => import("@/pages/Dashboard/DashboardPage"));
const ReportPage = React.lazy(() => import("@/pages/report/ReportPage"));
const PassActionPage = React.lazy(() => import("@/pages/Dashboard/PassActionPage"));
const PrintPassByIdPage = React.lazy(() => import("@/pages/print/PrintPassByIdPage"));
const PrintSettingsPage = React.lazy(() => import("@/pages/print/PrintSettingsPage"));
const UserProfilePage = React.lazy(() => import("@/pages/usermanagement/UserProfilePage").then(m => ({ default: m.UserProfilePage })));
const ForbiddenPage = React.lazy(() => import("@/pages/error/ForbiddenPage").then(m => ({ default: m.ForbiddenPage })));

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const getDefaultRoute = () => {
  const userStr = localStorage.getItem("user");
  try {
    const user = userStr ? JSON.parse(userStr) : null;
    if (user && (user.role === 'superadmin' || user.id === 'superadmin')) {
      return "/dashboard";
    } else if (user?.userRole?.permissions) {
      let perms = typeof user.userRole.permissions === 'string' 
        ? JSON.parse(user.userRole.permissions) 
        : user.userRole.permissions;
      
      if (perms['dashboard']) return "/dashboard";
      if (perms['create_pass']) return "/create-pass";
      if (perms['master_settings']) return "/employee-config";
      if (perms['user_management']) return "/role-config";
      if (perms['reports']) return "/report/generate";
      if (perms['print']) return "/report/print-settings";
    }
  } catch (e) {
    console.error("Error determining default route", e);
  }
  return "/profile"; // Fallback if no permissions, at least they can see their profile
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={getDefaultRoute()} replace />;
  }
  return children;
};

const PermissionRoute = ({ children, requiredModule }) => {
  const userStr = localStorage.getItem("user");
  let hasPermission = false;
  try {
    const user = userStr ? JSON.parse(userStr) : null;
    if (user && (user.role === 'superadmin' || user.id === 'superadmin')) {
      hasPermission = true;
    } else if (user?.userRole?.permissions) {
      let perms = typeof user.userRole.permissions === 'string' 
        ? JSON.parse(user.userRole.permissions) 
        : user.userRole.permissions;
      if (perms[requiredModule]) hasPermission = true;
    }
  } catch (e) {
    console.error("Error parsing permissions", e);
  }

  if (!hasPermission) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen w-screen bg-slate-50"><div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin" /></div>}>
      <Routes>
        {/* Public Auth Routes wrapped in AuthLayout */}
        <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        
        {/* Forbidden/Error Page */}
        <Route path="/forbidden" element={<ForbiddenPage />} />
        
        {/* Protected Routes inside DashboardLayout */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
          <Route path="/dashboard" element={<PermissionRoute requiredModule="dashboard"><DashboardPage /></PermissionRoute>} />
          <Route path="/create-pass" element={<PermissionRoute requiredModule="create_pass"><CreatePassPage /></PermissionRoute>} />
          <Route path="/pass/:id/action" element={<PermissionRoute requiredModule="dashboard"><PassActionPage /></PermissionRoute>} />
          
          {/* Master Settings wrapped in MasterSettingLayout */}
          <Route element={<MasterSettingLayout />}>
            <Route path="/employee-config" element={<PermissionRoute requiredModule="master_settings"><EmployeePage /></PermissionRoute>} />
            <Route path="/visiting-area-config" element={<PermissionRoute requiredModule="master_settings"><VisitorAreaPage /></PermissionRoute>} />
            <Route path="/visitor-type-config" element={<PermissionRoute requiredModule="master_settings"><VisitorTypePage /></PermissionRoute>} />
            <Route path="/purpose-config" element={<PermissionRoute requiredModule="master_settings"><PurposePage /></PermissionRoute>} />
            <Route path="/carry-with-config" element={<PermissionRoute requiredModule="master_settings"><CarryWithPage /></PermissionRoute>} />
            <Route path="/department-config" element={<PermissionRoute requiredModule="master_settings"><DepartmentPage /></PermissionRoute>} />
            <Route path="/company-register-config" element={<PermissionRoute requiredModule="master_settings"><CompanyRegisterPage /></PermissionRoute>} />
            <Route path="/location-config" element={<PermissionRoute requiredModule="master_settings"><LocationPage /></PermissionRoute>} />
            <Route path="/id-type-config" element={<PermissionRoute requiredModule="master_settings"><IdTypePage /></PermissionRoute>} />
          </Route>
          
          {/* User Management */}
          <Route path="/role-config" element={<PermissionRoute requiredModule="user_management"><RolePage /></PermissionRoute>} />
          <Route path="/role-config/new" element={<PermissionRoute requiredModule="user_management"><RoleFormPage /></PermissionRoute>} />
          <Route path="/role-config/edit/:id" element={<PermissionRoute requiredModule="user_management"><RoleFormPage /></PermissionRoute>} />
          <Route path="/user-config" element={<PermissionRoute requiredModule="user_management"><UserPage /></PermissionRoute>} />
          <Route path="/user-config/new" element={<PermissionRoute requiredModule="user_management"><UserFormPage /></PermissionRoute>} />
          <Route path="/user-config/edit/:id" element={<PermissionRoute requiredModule="user_management"><UserFormPage /></PermissionRoute>} />
          <Route path="/user-approvals" element={<PermissionRoute requiredModule="user_management"><UserApprovalsPage /></PermissionRoute>} />
          
          {/* Reports wrapped in ReportLayout */}
          <Route element={<ReportLayout />}>
            <Route path="/report/generate" element={<PermissionRoute requiredModule="reports"><ReportPage mode="generate" /></PermissionRoute>} />
            <Route path="/report/today" element={<PermissionRoute requiredModule="reports"><ReportPage mode="today" /></PermissionRoute>} />
          </Route>
          
          {/* Print wrapped in PrintLayout */}
          <Route element={<PrintLayout />}>
            <Route path="/report/print-pass" element={<PermissionRoute requiredModule="print"><PrintPassByIdPage /></PermissionRoute>} />
            <Route path="/report/print-settings" element={<PermissionRoute requiredModule="print"><PrintSettingsPage /></PermissionRoute>} />
          </Route>
          
          {/* Profile - Available to all logged-in users */}
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
