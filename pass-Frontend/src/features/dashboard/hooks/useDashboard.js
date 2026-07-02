import { useState, useEffect, useCallback } from "react";
import { fetchDashboardData, updatePassStatus, deletePass } from "@/masterCalling/dashboard/dashboardApi";

export const useDashboard = () => {
  const [dashboardState, setDashboardState] = useState({
    stats: { totalCompaniesGuest: 0, todaysGuest: 0 },
    requestPassData: [],
    approvedPassData: [],
    insidePassData: [],
    exitApprovedPassData: [],
    pendingApprovalPassData: [],
    expiredPassData: [],
    rejectedPassData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Printing modal state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPassForPrint, setSelectedPassForPrint] = useState(null);

  const handlePrintTrigger = useCallback((row) => {
    setSelectedPassForPrint(row);
    setIsPrintModalOpen(true);
  }, []);

  // Fetch initial data
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchDashboardData();
      if (res.data && res.data.data) {
        setDashboardState(res.data.data);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to fetch initial dashboard data. Check backend connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();

    // SSE connection for Real-time database changes
    const apiUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1").trim();
    const token = localStorage.getItem("token");
    const sseUrl = `${apiUrl}/capture/dashboard/stream${token ? `?token=${token}` : ""}`;
    console.log("Connecting to SSE stream:", sseUrl);

    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log("SSE Message Received:", parsed.event);
        if (parsed.event === "dashboard-update" && parsed.data) {
          setDashboardState(parsed.data);
          setError(null);
        }
      } catch (err) {
        console.error("SSE parse message error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection error, retrying...", err);
      setTimeout(() => {
        setError("Real-time connection interrupted. Offline mode.");
      }, 5000);
    };

    return () => {
      console.log("Closing SSE connection");
      eventSource.close();
    };
  }, [loadDashboardData]);

  const handleUpdateStatus = async (passId, newStatus, additionalData = {}) => {
    try {
      await updatePassStatus(passId, { status: newStatus, ...additionalData });
      // SSE broadcast will update all states automatically
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err?.response?.data?.message || "Failed to update pass status.");
    }
  };

  const handleCheckIn = useCallback((row) => {
    const securityName = prompt(
      "Please enter the name of the security personnel logging this visitor IN:",
      "Security Gate 1"
    );
    if (securityName === null) return;
    if (!securityName.trim()) {
      alert("Security personnel name is required.");
      return;
    }
    handleUpdateStatus(row.id, "Checked-In", { checkedInBy: securityName.trim() });
  }, []);

  const handleCheckOut = useCallback((row) => {
    const securityName = prompt(
      "Please enter the name of the security personnel logging this visitor OUT:",
      "Security Gate 1"
    );
    if (securityName === null) return;
    if (!securityName.trim()) {
      alert("Security personnel name is required.");
      return;
    }
    handleUpdateStatus(row.id, "Checked-Out", { checkedOutBy: securityName.trim() });
  }, []);

  const handleDeletePass = useCallback(async (row) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Gate Pass "${row.gate_pass_id || row.id}"?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await deletePass(row.id);
      // Dashboard will refresh via SSE broadcast from the backend
      // Fallback: reload data manually in case SSE is slow
      await loadDashboardData();
    } catch (err) {
      console.error("Failed to delete pass:", err);
      alert(err?.response?.data?.message || "Failed to delete gate pass.");
    }
  }, [loadDashboardData]);

  return {
    dashboardState,
    isLoading,
    error,
    isPrintModalOpen,
    setIsPrintModalOpen,
    selectedPassForPrint,
    handlePrintTrigger,
    handleUpdateStatus,
    handleCheckIn,
    handleCheckOut,
    handleDeletePass,
    loadDashboardData,
  };
};
