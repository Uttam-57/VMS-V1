import { useCompanyRegister } from "@/features/mastersetting/hooks/useCompanyRegister";
import { resolveUploadUrl } from "@/shared/utils/uploadUrl";
import { cn } from "@/shared/utils/cn";

export const GatePassTemplate = ({ passData, printSettings, getEmployeeName }) => {
  const { form: companyData } = useCompanyRegister();

  if (!passData) return null;

  const backendHost = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace("/api/v1", "");
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${backendHost}${url}`;
  };
  const photoUrl = getImageUrl(passData.photoUrl);

  const isThermal = printSettings.paperSize === "Thermal";
  const isA4 = printSettings.paperSize === "A4";

  const cardClasses = cn(
    "pass-print-card",
    isThermal ? "w-[300px] min-h-[450px] rounded-none p-4" : isA4 ? "w-full min-h-screen rounded-none p-10" : "w-[440px] min-h-[280px] rounded p-6",
    printSettings.showBorders ? "border-2 border-black" : "border border-black"
  );

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: ${printSettings.paperSize === 'A4' ? 'A4 ' + (printSettings.orientation?.toLowerCase() || 'portrait') : 'auto'};
            margin: 0;
          }
          
          body * {
            visibility: hidden !important;
            background-color: transparent !important;
            box-shadow: none !important;
          }
          
          #printable-gatepass-frame, #printable-gatepass-frame * {
            visibility: visible !important;
          }
          
          #printable-gatepass-frame {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            transform: none !important;
            width: ${printSettings.paperSize === 'Thermal' ? '300px' : printSettings.paperSize === 'A4' ? '100%' : '440px'} !important;
            min-height: ${printSettings.paperSize === 'A4' ? '100%' : 'auto'} !important;
            border: ${printSettings.paperSize === 'A4' && !printSettings.showBorders ? 'none' : '2px solid #000000'} !important;
            box-shadow: none !important;
            padding: ${printSettings.paperSize === 'A4' ? '40px' : '2rem'} !important;
            margin: 0 !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      <div id="printable-gatepass-frame" className={cardClasses}>
        {/* Header */}
        <div className="pass-print-header">
          {companyData?.logoUrl && (
            <img 
              src={resolveUploadUrl(companyData.logoUrl)} 
              alt="Logo" 
              className="pass-print-logo"
            />
          )}
          <h2 className="pass-print-title">
            {companyData?.companyFullName || companyData?.companyShortName || "FACILITY ACCESS"}
          </h2>
          <div className="pass-print-subtitle">
            Visitor Management System (VMS)
          </div>
          <div className="pass-print-doc-type">
            VISITOR GATE PASS
          </div>
          {printSettings.showPassType && (
            <span className="pass-print-badge">
              {passData.gatePassType === "single" ? "Single Day Pass" : "Multi Day Pass"}
            </span>
          )}
        </div>

        {/* Body Content */}
        <div className="pass-print-body">
          
          {/* Photo & QR verification side panel */}
          <div className="pass-print-photo-panel">
            
            {/* Visitor Photo */}
            {printSettings.showPhoto && (
              <div className="pass-print-photo-frame">
                {photoUrl ? (
                  <img src={photoUrl} alt="Visitor" className="pass-print-photo-img" />
                ) : (
                  <div className="text-center text-black text-[0.6rem] font-bold">
                    <span className="text-2xl block">👤</span>
                    NO PHOTO
                  </div>
                )}
              </div>
            )}

            {/* High-Contrast Printed Pass Status Badge */}
            <div
              className={cn(
                "pass-print-status-badge",
                passData.status === "Approved" ? "bg-green-100" :
                passData.status === "Checked-In" ? "bg-sky-100" :
                passData.status === "Checked-Out" ? "bg-slate-100" :
                passData.status === "Rejected" ? "bg-rose-100" :
                "bg-rose-100"
              )}
            >
              {passData.status}
            </div>

            {/* High Contrast Monochrome QR code Verification Box */}
            <div className="pass-print-qr-box">
              <svg width="60" height="60" viewBox="0 0 29 29" style={{ shapeRendering: "crispEdges" }}>
                <path fill="#000000" d="M0 0h9v9H0zm1 1v7h7V1zm8 0h1v1H9zm1 1h1v1h-1zm-1 1h1v1H9zm1 1h1v1h-1zm2-4h9v9h-9zm1 1v7h7V1zm-4 7h1v1H9zm1 0h1v1h-1zm-1 1h1v1H9zm3-1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm-5 2h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm3 0h1v1h-1zm-8 1h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 0h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm0 2h9v9h-9zm1 1v7h7V13zm-10 2h1v1h-1zm1 1h1v1h-1zm-1 1h1v1H9zm1 1h1v1h-1zm2-3h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm3 0h1v1h-1zm-8 1h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 0h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2-2h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm3 0h1v1h-1zm-8 1h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 0h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm0 2h9v9h-9zm1 1v7h7v-7zm-10 2h1v1h-1zm1 1h1v1h-1zm-1 1h1v1H9zm1 1h1v1h-1zm2-3h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm3 0h1v1h-1zm-8 1h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 1h1v1h-1zm2-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm-9 2h1v1H9zm1 1h1v1h-1zm1-1h1v1h-1zm3 0h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1zm1 1h1v1h-1zm1-1h1v1h-1z" />
              </svg>
              <span className="pass-print-qr-label">VERIFIED</span>
            </div>
          </div>

          {/* Details list as formal ledger */}
          <div className="pass-print-ledger-panel">
            <table className="pass-print-ledger-table">
              <tbody>
                {printSettings.showGatePassId && (
                  <tr className="border-b border-black">
                    <td className="pass-print-ledger-label-td">PASS ID</td>
                    <td className="pass-print-ledger-value-td">{passData.gatePassId || "-"}</td>
                  </tr>
                )}
                {printSettings.showName && (
                  <tr className="border-b border-black">
                    <td className="pass-print-ledger-label-td">VISITOR</td>
                    <td className="pass-print-ledger-value-td">{passData.name ? passData.name.toUpperCase() : "-"}</td>
                  </tr>
                )}
                {printSettings.showMobileNo && (
                  <tr className="border-b border-black">
                    <td className="pass-print-ledger-label-td">MOBILE NO</td>
                    <td className="px-2 py-1.5">{passData.mobileNo || "-"}</td>
                  </tr>
                )}
                {printSettings.showEmailId && passData.emailId && (
                  <tr className="border-b border-black">
                    <td className="pass-print-ledger-label-td">EMAIL ID</td>
                    <td className="px-2 py-1.5 lowercase">{passData.emailId}</td>
                  </tr>
                )}
                {printSettings.showCompanyName && passData.companyName && (
                  <tr className="border-b border-black">
                    <td className="pass-print-ledger-label-td">REPRESENTING</td>
                    <td className="px-2 py-1.5 font-bold">{passData.companyName.toUpperCase()}</td>
                  </tr>
                )}
                {printSettings.showEmployee && (
                  <tr className="border-b border-black">
                    <td className="pass-print-ledger-label-td">HOST</td>
                    <td className="px-2 py-1.5 font-bold">{getEmployeeName ? getEmployeeName(passData.toMeetWith).toUpperCase() : (passData.toMeetWith || "-").toUpperCase()}</td>
                  </tr>
                )}
                {printSettings.showVisitArea && (
                  <tr className="border-b border-black">
                    <td className="pass-print-ledger-label-td">ALLOWED AREAS</td>
                    <td className="px-2 py-1.5 font-bold">
                      {Array.isArray(passData.visitArea) ? passData.visitArea.join(", ").toUpperCase() : passData.visitArea ? passData.visitArea.toUpperCase() : "N/A"}
                    </td>
                  </tr>
                )}
                {printSettings.showPurpose && (
                  <tr className="border-b border-black">
                    <td className="pass-print-ledger-label-td">PURPOSE</td>
                    <td className="px-2 py-1.5">{passData.purpose || "General Meeting"}</td>
                  </tr>
                )}
                {printSettings.showPassDate && (
                  <tr className="border-b border-black">
                    <td className="pass-print-ledger-label-td">DATE / TIME</td>
                    <td className="px-2 py-1.5">
                      {passData.passDate ? new Date(passData.passDate).toLocaleString() : (passData.createdAt ? new Date(passData.createdAt).toLocaleString() : "-")}
                    </td>
                  </tr>
                )}
                {printSettings.showAllowedHours && passData.allowedHours && (
                  <tr>
                    <td className="pass-print-ledger-label-td">VALID LIMIT</td>
                    <td className="px-2 py-1.5 font-bold">{passData.allowedHours} HOURS ONLY</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accompanying Persons Table */}
        {printSettings.showAccompanyingPersons && passData.persons && passData.persons.length > 0 && (
          <div className="pass-print-accompanying-box">
            <div className="pass-print-accompanying-title">
              Accompanying Persons ({passData.persons.length} Total)
            </div>
            <table className="pass-print-accompanying-table">
              <thead>
                <tr className="border-b-2 border-black text-left">
                  <th className="pass-print-accompanying-th">NAME</th>
                  <th className="pass-print-accompanying-th">CONTACT</th>
                  <th className="pass-print-accompanying-th">GOVT ID NO</th>
                </tr>
              </thead>
              <tbody>
                {passData.persons.map((person, index) => (
                  <tr key={person.id || index} className={index < passData.persons.length - 1 ? "border-b border-dashed border-black" : ""}>
                    <td className="pass-print-accompanying-td">{person.name}</td>
                    <td className="py-1">{person.phoneNo || "-"}</td>
                    <td className="py-1">{person.aadharNumber || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Authorized Signatures Section */}
        <div className="pass-print-signatures-panel">
          <div className="pass-print-signature-box">
            <div className="pass-print-signature-line"></div>
            <span className="pass-print-signature-label">
              Visitor Signature
            </span>
          </div>
          <div className="pass-print-signature-box">
            <div className="pass-print-signature-line"></div>
            <span className="pass-print-signature-label">
              Security Officer / Sign
            </span>
          </div>
        </div>

        {/* Custom Bottom Instructions */}
        {printSettings.bottomInstructions && (
          <div className="pass-print-instructions-panel">
            <div className="pass-print-instructions-title">
              Security Access Terms:
            </div>
            {printSettings.bottomInstructions.split("\n").map((instruction, idx) => (
              <div key={idx} className="mb-0.5">{instruction}</div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
