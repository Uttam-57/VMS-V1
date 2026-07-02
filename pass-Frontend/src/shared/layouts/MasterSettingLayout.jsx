import { Outlet } from "react-router-dom";

export const MasterSettingLayout = () => {
  return (
    <div className="master-setting-layout w-full min-h-screen bg-slate-50/50">
      <Outlet />
    </div>
  );
};
