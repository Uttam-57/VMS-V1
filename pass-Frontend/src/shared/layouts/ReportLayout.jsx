import { Outlet } from "react-router-dom";
import { UniversalHeader } from "@/shared/components/UniversalHeader";

export const ReportLayout = () => {
  return (
    <div className="report-layout w-full min-h-screen bg-slate-50/50 p-6">
      <UniversalHeader />
      <Outlet />
    </div>
  );
};
