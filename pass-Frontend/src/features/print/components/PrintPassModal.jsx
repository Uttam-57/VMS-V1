import { useState, useEffect } from "react";
import { useEmployees } from "@/features/mastersetting/hooks/useEmployee";
import { Printer, X, } from "lucide-react";
import { GatePassTemplate } from "./GatePassTemplate";

const DEFAULT_PRINT_SETTINGS = {
  showPassType: true,
  showGatePassId: true,
  showPassDate: true,
  showAllowedHours: true,
  showName: true,
  showEmployee: true,
  showMobileNo: true,
  showEmailId: true,
  showCompanyName: true,
  showPurpose: true,
  showVisitArea: true,
  showPhoto: true,
  paperSize: "A4", // "Card", "Thermal", "A4"
  orientation: "Portrait", // "Portrait", "Landscape"
  showBorders: true,
  bottomInstructions: "1. Please wear this badge visibly at all times within the facility.\n2. This pass is non-transferable and valid only for authorized areas.\n3. Return this pass to the security desk upon check-out.\n4. In case of emergency, follow instructions of safety wardens.",
};

export const PrintPassModal = ({ isOpen, onClose, passData }) => {
  const [printSettings, setPrintSettings] = useState(DEFAULT_PRINT_SETTINGS);
  const { employees } = useEmployees();

  // Load configuration from local storage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("vms_print_settings");
      if (saved) {
        try {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setPrintSettings({ ...DEFAULT_PRINT_SETTINGS, ...JSON.parse(saved) });
        } catch (e) {
          console.error("Failed to parse print settings from localStorage", e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen || !passData) return null;

  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = employees.find((e) => e._id === id || e.id === id);
    return emp ? emp.name : id;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Printer size={20} className="text-slate-800" />
            <span className="font-bold text-slate-800 text-lg">
              Access Pass Printer Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-0 cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1 flex items-center justify-center rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 items-center flex-1">
          <GatePassTemplate passData={passData} printSettings={printSettings} getEmployeeName={getEmployeeName} />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 text-sm font-bold rounded-lg bg-primary hover:bg-primary-hover text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer border-0"
          >
            <Printer size={16} /> Print Now
          </button>
        </div>
      </div>
    </div>
  );
};
