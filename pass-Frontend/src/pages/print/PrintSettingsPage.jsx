import { useState, useEffect } from "react";
import { Sliders, Save, CheckCircle, RotateCcw, Eye, ShieldAlert } from "lucide-react";
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
  paperSize: "A4", // "Card", "Thermal", "A4"
  orientation: "Portrait", // "Portrait", "Landscape"
  showBorders: true,
  bottomInstructions: "1. Please wear this badge visibly at all times within the facility.\n2. This pass is non-transferable and valid only for authorized areas.\n3. Return this pass to the security desk upon check-out.\n4. In case of emergency, follow instructions of safety wardens.",
};

export default function PrintSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_PRINT_SETTINGS);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Load configuration from local storage
  useEffect(() => {
    const saved = localStorage.getItem("vms_print_settings");
    if (saved) {
      try {
        setSettings({ ...DEFAULT_PRINT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to parse print settings from localStorage", e);
      }
    }
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("vms_print_settings", JSON.stringify(updated));
      return updated;
    });
    triggerSavedIndicator();
  };

  const handleSelect = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem("vms_print_settings", JSON.stringify(updated));
      return updated;
    });
    triggerSavedIndicator();
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("vms_print_settings", JSON.stringify(updated));
      return updated;
    });
    triggerSavedIndicator();
  };

  const triggerSavedIndicator = () => {
    setShowSavedToast(true);
    const timer = setTimeout(() => setShowSavedToast(false), 2000);
    return () => clearTimeout(timer);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset print configuration to default?")) {
      setSettings(DEFAULT_PRINT_SETTINGS);
      localStorage.setItem("vms_print_settings", JSON.stringify(DEFAULT_PRINT_SETTINGS));
      triggerSavedIndicator();
    }
  };

  const handleManualSave = () => {
    localStorage.setItem("vms_print_settings", JSON.stringify(settings));
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  return (
    <div className="inner-page-padded">
      {/* Toast Notification */}
      <div className={`toast toast-success ${showSavedToast ? "toast-visible" : "toast-hidden"}`}>
        <CheckCircle size={18} />
        <span>Settings Auto-Saved!</span>
      </div>

      {/* Page Title Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Sliders className="text-slate-800" />
            Print Settings Configuration
          </h1>
          <p className="page-subtitle">
            Customize what fields appear on the gate pass, the size format, custom security instructions, and print themes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-300 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} /> Reset Default
          </button>
          <button
            onClick={handleManualSave}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-5 py-2 text-sm font-semibold transition-all shadow-sm border-0 cursor-pointer"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Settings Panel Card (Left Side) */}
        <div className="page-section p-6 flex flex-col gap-7">
          {/* Format Settings */}
          <div>
            <h3 className="m-0 mb-4 text-slate-700 text-base font-bold border-b border-slate-100 pb-2">
              1. Print Layout Format
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="field-label-sm">Paper / Badge Size</label>
                <select
                  value={settings.paperSize}
                  onChange={(e) => handleSelect("paperSize", e.target.value)}
                  className="field-select"
                >
                  <option value="Card">Standard ID Card (3.5" x 2.25")</option>
                  <option value="Thermal">Thermal Slip (80mm Continuous)</option>
                  <option value="A4">A4 Half-Page Document</option>
                </select>
              </div>
            </div>

            <div className="flex gap-8 mt-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={settings.showBorders}
                  onChange={() => handleToggle("showBorders")}
                  className="checkbox"
                />
                Show Accent Border
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={settings.orientation === "Landscape"}
                  onChange={() => handleSelect("orientation", settings.orientation === "Portrait" ? "Landscape" : "Portrait")}
                  className="checkbox"
                />
                Landscape Mode
              </label>
            </div>
          </div>

          {/* Toggle Fields */}
          <div>
            <h3 className="m-0 mb-4 text-slate-700 text-base font-bold border-b border-slate-100 pb-2">
              2. Custom Visible Fields
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "showPhoto", label: "Visitor Photo" },
                { key: "showPassType", label: "Pass Type Indicator" },
                { key: "showGatePassId", label: "Gate Pass ID Code" },
                { key: "showPassDate", label: "Pass Issue Date" },
                { key: "showAllowedHours", label: "Hours Allowed Limit" },
                { key: "showName", label: "Visitor Name" },
                { key: "showMobileNo", label: "Mobile Number" },
                { key: "showEmailId", label: "Email Address" },
                { key: "showCompanyName", label: "Company Name" },
                { key: "showEmployee", label: "Host Employee Name" },
                { key: "showVisitArea", label: "Allowed Office Areas" },
                { key: "showPurpose", label: "Purpose of Visit" },
                { key: "showAccompanyingPersons", label: "Accompanying Persons" },
              ].map((field) => (
                <div
                  key={field.key}
                  onClick={() => handleToggle(field.key)}
                  className={`print-option-pill ${settings[field.key] ? "print-option-pill-on" : "print-option-pill-off"}`}
                >
                  <span className={`text-[0.8rem] font-semibold ${settings[field.key] ? "text-slate-900" : "text-slate-500"}`}>
                    {field.label}
                  </span>

                  {/* Mini Toggle Switch */}
                  <div className={`mini-toggle ${settings[field.key] ? "mini-toggle-on" : "mini-toggle-off"}`}>
                    <div className={`mini-toggle-thumb ${settings[field.key] ? "mini-toggle-thumb-on" : "mini-toggle-thumb-off"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Security Instructions */}
          <div>
            <h3 className="m-0 mb-3 text-slate-700 text-base font-bold border-b border-slate-100 pb-2">
              3. Pass Bottom Instructions
            </h3>
            <p className="m-0 mb-2 text-xs text-slate-500 font-medium">
              Define rules and directions printed at the bottom of every pass. Keep each instruction on a new line.
            </p>
            <textarea
              name="bottomInstructions"
              value={settings.bottomInstructions}
              onChange={handleTextChange}
              placeholder="Enter directions..."
              rows={4}
              className="field-textarea"
            />
          </div>
        </div>

        {/* Live Mockup Preview Panel (Right Side) */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center flex-1 min-h-[450px]">
            {/* Live Indicator Badge */}
            <div className="self-stretch flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-wider">
                <Eye size={16} /> Live Printing Mockup Preview
              </div>
              <div className="text-[10px] bg-slate-900 text-white px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase">
                REALTIME PREVIEW
              </div>
            </div>

            <GatePassTemplate
              passData={{
                gatePassId: "GP-A7B8C9",
                name: "Jane Doe",
                mobileNo: "+1 (555) 019-2834",
                emailId: "jane.doe@gmail.com",
                companyName: "Google DeepMind",
                toMeetWith: "John Smith (IT Dev)",
                visitArea: ["Server Room", "Conf Hall A"],
                purpose: "Technical Integration Meeting",
                allowedHours: 8,
                createdAt: new Date().toISOString(),
                passDate: new Date().toISOString(),
                status: "Approved",
                gatePassType: "single",
                persons: [
                  { name: "Bob Smith", phoneNo: "+1...23", aadharNumber: "1234" },
                  { name: "Alice Johnson", phoneNo: "+1...56", aadharNumber: "5678" }
                ],
                photoUrl: ""
              }}
              printSettings={settings}
              getEmployeeName={(id) => id}
            />
          </div>

          {/* Quick Notice about browser margins */}
          <div className="tip-box tip-box-warning">
            <ShieldAlert size={18} className="shrink-0" />
            <div>
              <strong>Printer Layout Tip:</strong> When using the physical browser print window, make sure to set <strong>Margins</strong> to <i>None</i> or <i>Minimum</i> and toggle <strong>Background graphics</strong> <i>ON</i> to get accurate colors and border formatting.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
