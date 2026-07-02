import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Building, MapPin, Clock, Calendar, Box, Thermometer, Info, Eye, Printer as PrinterIcon } from 'lucide-react';
import { PrintPassModal } from "@/features/print/components/PrintPassModal";

const backendHost = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace("/api/v1", "");

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${backendHost}${url}`;
};

export const FullPassLog = ({ visitor, onBack, getEmployeeName }) => {
  const navigate = useNavigate();
  const [printPassData, setPrintPassData] = useState(null);

  if (!visitor) return null;

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header Profile Card */}
      <div className="bg-slate-900 rounded-t-xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2">
              <User size={24} className="text-teal-400" />
              {visitor.name} — DETAILED PASS LOGS
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-md">
                <Info size={14} className="text-slate-400" /> Type: {visitor.visitorType}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-md">
                <Phone size={14} className="text-slate-400" /> Mobile: {visitor.mobileNo}
              </span>
              {visitor.emailId && (
                <span className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-md">
                  <Mail size={14} className="text-slate-400" /> Email: {visitor.emailId}
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* Log Table Container */}
      <div className="bg-white border-x border-b border-slate-200 rounded-b-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        {/* We could add Search inside the log here if needed */}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 w-32 border-r border-slate-200">Gate Snapshot</th>
                <th className="p-4 w-[24rem] border-r border-slate-200">Pass & Timing</th>
                <th className="p-4 border-r border-slate-200">Visit Details</th>
                <th className="p-4">Logistics & Assets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitor.passes.map((pass) => (
                <tr key={pass.id} className="hover:bg-slate-50 transition-colors">
                  {/* Gate Snapshot */}
                  <td className="p-4 border-r border-slate-100 align-top">
                    <div className="w-24 h-24 bg-slate-100 rounded-lg border-2 border-slate-200 overflow-hidden flex items-center justify-center relative shadow-sm">
                      {pass.photoUrl ? (
                        <img 
                          src={getImageUrl(pass.photoUrl)} 
                          alt="Gate Snapshot" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={32} className="text-slate-300" />
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center font-bold py-0.5">
                        {pass.gatePassId || "PHOTO"}
                      </div>
                    </div>
                  </td>

                  {/* Pass & Timing */}
                  <td className="p-4 border-r border-slate-100 align-top">
                    <div className="font-bold text-primary text-base mb-2 flex items-center gap-2">
                      <span>Pass: {pass.gatePassId || 'N/A'}</span>
                      {pass.subLocation && (
                        <span className="text-xs bg-indigo-50 text-primary px-2 py-0.5 rounded-full border border-indigo-100 font-bold uppercase tracking-wider">
                          {pass.subLocation}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-1 mb-3">
                      <div className="flex items-center gap-1.5 text-slate-700 text-sm font-bold">
                        <Calendar size={14} className="text-slate-400" />
                        Valid For: {new Date(pass.passDate || pass.createdAt).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium pl-1">
                        <Clock size={12} className="text-slate-400" />
                        Created: {new Date(pass.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-col gap-1.5">
                      <span className={`w-fit inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-widest
                        ${pass.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                          pass.status === 'Checked-In' ? 'bg-sky-100 text-sky-800' :
                          pass.status === 'Checked-Out' ? 'bg-slate-200 text-slate-700' :
                          pass.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Status: {pass.status}
                      </span>
                      
                      {/* Timeline of actions */}
                      <div className="mt-1 flex flex-col gap-1 text-[11px] font-semibold tracking-wide">
                        {pass.approvedAt && (
                          <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-1 rounded">
                             <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                             Approved by {pass.approvedBy || 'Admin'} at {new Date(pass.approvedAt).toLocaleTimeString([], { timeStyle: 'short' })}
                          </div>
                        )}
                        {pass.checkedInAt && (
                          <div className="flex items-center gap-1.5 text-sky-700 bg-sky-50 px-2 py-1 rounded">
                             <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                             Checked In by {pass.checkedInBy || 'Security'} at {new Date(pass.checkedInAt).toLocaleTimeString([], { timeStyle: 'short' })}
                          </div>
                        )}
                        {pass.checkedOutAt && (
                          <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                             <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                             Checked Out by {pass.checkedOutBy || 'Security'} at {new Date(pass.checkedOutAt).toLocaleTimeString([], { timeStyle: 'short' })}
                          </div>
                        )}
                        {pass.rejectedAt && (
                          <div className="flex items-center gap-1.5 text-red-700 bg-red-50 px-2 py-1 rounded">
                             <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                             Rejected by {pass.rejectedBy || 'Admin'} at {new Date(pass.rejectedAt).toLocaleTimeString([], { timeStyle: 'short' })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex gap-6 text-xs">
                      <div>
                        <span className="block text-slate-400 uppercase font-bold text-[10px] mb-0.5">Time Allowed</span>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{pass.allowedHours ? `${pass.allowedHours} hrs` : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 uppercase font-bold text-[10px] mb-0.5">Time Spent</span>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {pass.checkedInAt && pass.checkedOutAt ? (() => {
                            const diffMs = new Date(pass.checkedOutAt) - new Date(pass.checkedInAt);
                            const diffMins = Math.floor(diffMs / 60000);
                            const hrs = Math.floor(diffMins / 60);
                            const mins = diffMins % 60;
                            return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                          })() : '-'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Visit Details */}
                  <td className="p-4 border-r border-slate-100 align-top space-y-2">
                    <div className="flex items-start gap-2">
                      <User size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-xs uppercase font-bold block">Host</span>
                        <strong className="text-slate-900">{getEmployeeName(pass.toMeetWith)}</strong>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-xs uppercase font-bold block">Area</span>
                        <span className="text-slate-700 font-medium">
                          {Array.isArray(pass.visitArea) ? pass.visitArea.join(', ') : pass.visitArea || '-'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-xs uppercase font-bold block">Purpose</span>
                        <span className="text-slate-700 font-medium">{pass.purpose || "-"}</span>
                      </div>
                    </div>
                  </td>

                  {/* Logistics & Assets */}
                  <td className="p-4 align-top space-y-2">
                    <div className="flex items-start gap-2">
                      <Box size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-slate-500 text-xs uppercase font-bold block">Carried Items</span>
                        <span className="text-slate-800 font-medium">
                          {Array.isArray(pass.carryWith) && pass.carryWith.length > 0 
                            ? pass.carryWith.join(', ') 
                            : pass.carryWith || "None"}
                        </span>
                      </div>
                    </div>

                    {pass.tokenNo && (
                      <div className="mt-1">
                        <span className="text-slate-500 text-xs uppercase font-bold mr-1">Token:</span>
                        <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded">{pass.tokenNo}</span>
                      </div>
                    )}

                    {pass.temperature && (
                      <div className="flex items-center gap-1.5 mt-2 text-rose-600 font-bold text-xs bg-rose-50 w-fit px-2 py-1 rounded">
                        <Thermometer size={14} /> Temp: {pass.temperature}°
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <span className="text-slate-500 text-xs uppercase font-bold block mb-1">Accompanying Persons</span>
                      {pass.persons && pass.persons.length > 0 ? (
                        <ul className="space-y-1 mb-3">
                          {pass.persons.map((person, idx) => (
                            <li key={idx} className="text-xs text-slate-700 font-medium flex items-center gap-1">
                              <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                              Name: {person.name} {person.aadharNo ? `/ Aadhaar: ${person.aadharNo}` : ''}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 text-xs font-medium italic block mb-3">None</span>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t border-slate-100 flex gap-2">
                      <button 
                        onClick={() => navigate(`/pass/${pass.id}/action?mode=view`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded transition-colors"
                      >
                        <Eye size={14} /> View Details
                      </button>
                      <button 
                        onClick={() => setPrintPassData(pass)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-primary text-xs font-bold rounded transition-colors border-0 cursor-pointer"
                      >
                        <PrinterIcon size={14} /> Print Pass
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-slate-500 text-sm font-semibold flex justify-between items-center">
          <span>Showing {visitor.passes.length} records for {visitor.name}</span>
        </div>
      </div>
      
      {/* Print Modal */}
      <PrintPassModal
        isOpen={!!printPassData}
        onClose={() => setPrintPassData(null)}
        passData={printPassData}
      />
    </div>
  );
};
