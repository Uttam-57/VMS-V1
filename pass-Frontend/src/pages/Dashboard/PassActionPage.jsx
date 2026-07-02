/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getPassById, updatePassStatus } from "@/masterCalling/dashboard/dashboardApi";
import { useEmployees } from "@/features/mastersetting/hooks/useEmployee";
import { useLocationUtils } from "@/shared/hooks/useLocation";

import { Timeline } from "@/features/dashboard/components/passaction/Timeline";
import { PassDetailSection } from "@/features/dashboard/components/passaction/PassDetailSection";
import { PhotoSection } from "@/features/dashboard/components/passaction/PhotoSection";
import { AccompanyingPersonsTable } from "@/features/dashboard/components/passaction/AccompanyingPersonsTable";
import { ActionButtons } from "@/features/dashboard/components/passaction/ActionButtons";
import { UniversalHeader } from "@/shared/components/UniversalHeader";

/** Returns a centralized CSS class name for each pass status. */
function getStatusBadgeClass(status) {
  switch (status) {
    case "Approved":    return "status-badge status-badge-approved";
    case "Pending":     return "status-badge status-badge-pending";
    case "Requested":   return "status-badge status-badge-requested";
    case "Checked-In":  return "status-badge status-badge-checked-in";
    case "Checked-Out": return "status-badge status-badge-checked-out";
    case "Rejected":    return "status-badge status-badge-rejected";
    default:            return "status-badge status-badge-expired";
  }
}

export default function PassActionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "view";

  const [passData, setPassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { employees } = useEmployees();
  const { states, cities, setSelectedState } = useLocationUtils();

  const fetchPassData = async () => {
    try {
      setIsLoading(true);
      const res = await getPassById(id);
      if (res.data && res.data.data) {
        setPassData(res.data.data);
        if (res.data.data.state) {
          setSelectedState(res.data.data.state);
        }
      } else {
        setError("Pass not found.");
      }
    } catch (err) {
      console.error("Error fetching pass data:", err);
      setError("Failed to fetch pass details. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPassData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setPassData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAction = async (status, isRejection = false) => {
    let rejectionReason = "";
    if (isRejection) {
      rejectionReason = prompt("Please enter the reason for rejection:");
      if (rejectionReason === null) return;
      if (!rejectionReason.trim()) {
        alert("Rejection reason is required.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const payload = { status };
      if (isRejection) {
        payload.rejectionReason = rejectionReason.trim();
        payload.rejectedBy = "System Admin";
      }
      if (mode === "review-request" && status === "Pending") {
        Object.assign(payload, {
          name: passData.name,
          mobileNo: passData.mobileNo,
          emailId: passData.emailId,
          companyName: passData.companyName,
          address: passData.address,
          state: passData.state,
          city: passData.city,
          representingVisitorType: passData.representingVisitorType,
          subLocation: passData.subLocation,
          toMeetWith: passData.toMeetWith,
          allowedHours: passData.allowedHours,
          purpose: passData.purpose,
        });
      }
      if (status === "Approved") payload.approvedBy = "System Admin";

      await updatePassStatus(id, payload);
      alert(`Gate pass successfully ${status === "Pending" ? "created" : status.toLowerCase()}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Action failed:", err);
      alert(err?.response?.data?.message || "Failed to update gate pass.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-center">
        <div className="loading-spinner" />
        <span className="loading-text">Loading pass details...</span>
      </div>
    );
  }

  if (error || !passData) {
    return (
      <div className="error-box">
        <h2 className="error-box-title">⚠️ Error</h2>
        <p className="font-medium">{error || "Gate pass not found."}</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-5 py-2.5 rounded-lg font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors border-0 cursor-pointer shadow-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const backendHost = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").replace("/api/v1", "");
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${backendHost}${url}`;
  };
  const photoUrl = getImageUrl(passData.photoUrl);
  const isEditable = mode === "review-request";

  return (
    <div className="pass-action-page">
      <button onClick={() => navigate("/dashboard")} className="back-btn">
        ← Back to Dashboard
      </button>

      <div className="page-section">
        <div className="p-8 border-b border-slate-200 bg-slate-50 flex flex-col">
          <UniversalHeader title="Detailed Pass Record" />
          <div className="flex justify-between items-center mt-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="m-0 text-2xl font-extrabold text-slate-800 tracking-tight">{passData.name}</h1>
                <span className={getStatusBadgeClass(passData.status)}>
                  {passData.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pass ID</div>
              <div className="text-lg font-extrabold text-slate-800 font-mono tracking-wider">{passData.gatePassId || "N/A"}</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PassDetailSection isEditable={isEditable} passData={passData} handleFieldChange={handleFieldChange} employees={employees} states={states} cities={cities} setSelectedState={setSelectedState} setPassData={setPassData} />
            <div className="flex flex-col gap-8">
              <PhotoSection photoUrl={photoUrl} passData={passData} />
              <Timeline passData={passData} />
            </div>
          </div>
          <AccompanyingPersonsTable passData={passData} backendHost={backendHost} />
          <ActionButtons mode={mode} passData={passData} isSubmitting={isSubmitting} handleSubmitAction={handleSubmitAction} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}
