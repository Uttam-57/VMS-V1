import React from 'react';
import { useCompanyRegister } from '@/features/mastersetting/hooks/useCompanyRegister';
import { resolveUploadUrl } from '@/shared/utils/uploadUrl';

export const UniversalHeader = ({ title, subtitle }) => {
  const { form, isLoading } = useCompanyRegister();

  const logoUrl = form?.logoUrl ? resolveUploadUrl(form.logoUrl) : null;
  const companyName = form?.companyFullName || form?.companyShortName || "COMPANY NAME";

  return (
    <div className="flex flex-col items-center justify-center text-center w-full pb-4 mb-6 border-b-2 border-slate-200">
      <div className="flex items-center gap-4 mb-2">
        {logoUrl && (
          <img 
            src={logoUrl} 
            alt="Company Logo" 
            className="w-16 h-16 object-contain"
          />
        )}
        <div className="flex flex-col text-left">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
            {isLoading ? "LOADING..." : companyName}
          </h1>
          <div className="text-xs font-bold tracking-widest text-teal-600 uppercase">
            Visitor Management System (VMS)
          </div>
        </div>
      </div>
      {(title || subtitle) && (
        <div className="mt-2 text-center">
          {title && <h2 className="text-lg font-bold text-slate-700 uppercase tracking-wide">{title}</h2>}
          {subtitle && <p className="text-sm text-slate-500 font-medium">{subtitle}</p>}
        </div>
      )}
    </div>
  );
};
