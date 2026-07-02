import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { getDefaultRoute } from "@/app/routes";

export const ForbiddenPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center animate-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Access Denied</h1>
        <p className="text-slate-500 mb-8">
          You do not have the required permissions to view this page. If you believe this is a mistake, please contact your administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link 
            to={getDefaultRoute()} 
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors border-0 cursor-pointer no-underline"
          >
            <ArrowLeft size={18} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};
