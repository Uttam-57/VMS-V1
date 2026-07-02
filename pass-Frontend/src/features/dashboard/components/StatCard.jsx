import React from "react";

export const StatCard = ({ title, value, icon }) => (
  <div className="bg-white border border-slate-200 rounded-xl flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
    <div className="flex items-center gap-5 p-6">
      <div className="flex items-center justify-center rounded-2xl h-14 w-14 text-2xl bg-slate-100 shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs text-slate-500 font-bold tracking-wider uppercase">
          {title}
        </div>
        <div className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
          {value}
        </div>
      </div>
    </div>
  </div>
);
