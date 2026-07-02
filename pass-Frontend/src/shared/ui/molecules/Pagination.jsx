import React from "react";

export const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  options = [5, 10, 15, 20, 25, 50, 100],
  className = ""
}) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className={`p-4 flex flex-wrap items-center justify-between text-sm text-slate-600 gap-4 w-full ${className}`}>
      <div className="flex items-center gap-6">
        <span>
          Showing {totalCount === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, totalCount)} of {totalCount} entries
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Rows per page:</span>
          <select 
            value={pageSize} 
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              // Note: the parent component is responsible for resetting the page to 1 when page size changes
            }}
            className="border border-slate-300 rounded-md px-2 py-1 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="px-3 py-1.5 font-medium text-slate-700">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};
