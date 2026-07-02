import { useState, useEffect } from "react";
import { getPassForPrint } from "@/masterCalling/print/printApi";
import { useEmployees } from "@/features/mastersetting/hooks/useEmployee";
import { Printer, Search, Loader, ShieldAlert } from "lucide-react";
import { GatePassTemplate } from "@/features/print/components/GatePassTemplate";

// Default print configuration
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
  showAccompanyingPersons: true,
  paperSize: "Card", // "Card", "Thermal", "A4"
  orientation: "Portrait", // "Portrait", "Landscape"
  colorTheme: "dark", // "dark", "teal", "blue", "emerald"
  showBorders: true,
  bottomInstructions: "1. Please wear this badge visibly at all times within the facility.\n2. This pass is non-transferable and valid only for authorized areas.\n3. Return this pass to the security desk upon check-out.\n4. In case of emergency, follow instructions of safety wardens.",
};

export default function PrintPassByIdPage() {
  const [searchId, setSearchId] = useState("");
  const [passData, setPassData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [printSettings, setPrintSettings] = useState(DEFAULT_PRINT_SETTINGS);

  const { employees } = useEmployees();

  // Load configuration from local storage
  useEffect(() => {
    const saved = localStorage.getItem("vms_print_settings");
    if (saved) {
      try {
        setPrintSettings({ ...DEFAULT_PRINT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse print settings from localStorage", e);
      }
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    setIsLoading(true);
    setError("");
    setPassData(null);
    try {
      const res = await getPassForPrint(searchId.trim());
      if (res.data && res.data.data) {
        setPassData(res.data.data);
      } else {
        setError("No Gate Pass found matching this ID/Short Code.");
      }
    } catch (err) {
      console.error("Failed to fetch pass data:", err);
      setError(err?.response?.data?.message || "Failed to locate Gate Pass. Please check backend connectivity.");
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = employees.find((e) => e._id === id || e.id === id);
    return emp ? emp.name : id;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="inner-page-padded">
      {/* Header Panel */}
      <div className="mb-8">
        <h1 className="page-title">
          <Printer className="text-slate-800" />
          Print Gate Pass by ID
        </h1>
        <p className="page-subtitle">
          Scan, input, or copy a visitor's Gate Pass ID / Short Code to immediately load and print their facility access badge.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="page-section p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <label className="field-label-sm" htmlFor="searchId">
              Enter Gate Pass ID or Short Code
            </label>
            <div className="relative">
              <input
                type="text"
                id="searchId"
                placeholder="e.g. A7B8C9 or standard Pass database ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="field-input pl-10 h-11"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading || !searchId.trim()}
            className={`h-11 px-6 rounded-lg text-sm font-semibold border-0 cursor-pointer flex items-center gap-2 shadow-sm transition-all ${
              !searchId.trim() ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-primary text-white hover:bg-primary-hover hover:shadow"
            }`}
          >
            {isLoading ? <Loader className="animate-spin" size={16} /> : <Search size={16} />}
            Search Pass
          </button>
        </form>
      </div>

      {/* Main Results View */}
      {isLoading && (
        <div className="loading-center">
          <div className="loading-spinner" />
          <span className="loading-text">Fetching Gate Pass records...</span>
        </div>
      )}

      {error && (
        <div className="alert-banner alert-danger">
          <ShieldAlert size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {passData && (
        <div className="flex flex-wrap gap-10 items-start">

          {/* Left Column: Pass Card Preview Frame */}
          <div className="flex-1 min-w-[320px] bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 flex justify-center">
            <GatePassTemplate passData={passData} printSettings={printSettings} getEmployeeName={getEmployeeName} />
          </div>

          {/* Right Column: Printing Details and Actions */}
          <div className="flex-1 min-w-[300px] max-w-[350px] page-section p-6 flex flex-col gap-6">
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pass Metadata</span>
              <h3 className="m-0 mt-1 mb-2 text-slate-800 text-lg font-bold">
                {passData.name}
              </h3>
              <div className="flex flex-col gap-1.5 text-sm text-slate-600">
                <div>Status: <strong className={passData.status === "Approved" ? "text-success" : "text-warning"}>{passData.status}</strong></div>
                <div>Created: <strong>{new Date(passData.createdAt).toLocaleDateString()}</strong></div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <button
                onClick={handlePrint}
                className="w-full h-11 rounded-lg bg-primary hover:bg-primary-hover text-white border-0 font-bold cursor-pointer flex items-center justify-center gap-2 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <Printer size={18} /> Print Access Pass
              </button>
            </div>

            <div className="alert-banner alert-success" style={{marginBottom: 0}}>
              🎉 <strong>Print Settings Active:</strong> This pass will be formatted into a <strong>{printSettings.paperSize}</strong> size badge automatically.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
