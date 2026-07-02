import { Outlet } from "react-router-dom";

export const PrintLayout = () => {
  return (
    <div className="print-layout w-full min-h-screen bg-white p-6">
      <Outlet />
    </div>
  );
};
