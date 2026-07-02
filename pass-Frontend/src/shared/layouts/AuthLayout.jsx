import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans overflow-hidden">
      {/* Cover Image Left Panel */}
      <div className="hidden lg:block lg:w-7/12 relative select-none">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" 
          alt="Office Workspace" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Tint Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 flex flex-col justify-between p-12" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-wider text-white">VMS</h1>
            <p className="text-sm text-slate-300 font-medium tracking-wide mt-1">Visitor Management System</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium font-mono">
              Created by: <span className="text-white">uttamsantoki05@gmail.com</span>
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Right Panel */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};



