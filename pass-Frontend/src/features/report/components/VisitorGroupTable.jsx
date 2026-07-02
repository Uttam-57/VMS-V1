import { Users, FileText, Search } from 'lucide-react';

export const VisitorGroupTable = ({
  isLoading,
  groupedVisitors,
  mode,
  onViewLog
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Visitor Type</th>
            <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile No.</th>
            <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Passes</th>
            <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Visit Date</th>
            <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td colSpan="6" className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-slate-200 border-t-primary rounded-full animate-spin" />
                  <span className="text-slate-500 font-medium">Loading visitors...</span>
                </div>
              </td>
            </tr>
          ) : groupedVisitors.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-16 px-6 text-slate-400">
                <div className="flex flex-col items-center gap-2">
                  <Search size={32} className="text-slate-200" />
                  <span className="text-base font-bold text-slate-500">No visitors found</span>
                  <span className="text-xs">
                    {mode === "generate" 
                      ? "Make sure you generated the report for dates containing records."
                      : "No visitors match current filter specifications."}
                  </span>
                </div>
              </td>
            </tr>
          ) : (
            groupedVisitors.map((visitor) => (
              <tr 
                key={visitor.mobileNo} 
                className="hover:bg-slate-50/50 transition-colors"
              >
                {/* Name */}
                <td className="px-5 py-3.5 align-middle">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <strong className="text-slate-800 text-[0.95rem]">{visitor.name}</strong>
                  </div>
                </td>

                {/* Visitor Type */}
                <td className="px-5 py-3.5 align-middle">
                  <span className="text-slate-700 font-medium">{visitor.visitorType}</span>
                </td>

                {/* Mobile No */}
                <td className="px-5 py-3.5 align-middle">
                  <span className="text-primary font-semibold">{visitor.mobileNo}</span>
                </td>

                {/* Total Passes */}
                <td className="px-5 py-3.5 align-middle">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold text-xs">
                    {visitor.totalPasses} {visitor.totalPasses === 1 ? 'time' : 'times'}
                  </span>
                </td>

                {/* Last Visit Date */}
                <td className="px-5 py-3.5 align-middle">
                  <div className="text-slate-600 font-medium">
                    {new Date(visitor.lastVisitDate).toLocaleDateString()}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5 align-middle text-center">
                  <button
                    onClick={() => onViewLog(visitor)}
                    className="bg-slate-950 text-white rounded-md px-3.5 h-8 text-xs font-semibold border-0 cursor-pointer inline-flex items-center gap-1.5 shadow-sm hover:bg-slate-800 transition-colors"
                  >
                    <FileText size={12} /> [ View Full Log ]
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
