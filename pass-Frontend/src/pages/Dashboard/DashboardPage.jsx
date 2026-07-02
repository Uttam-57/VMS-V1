/* eslint-disable react-hooks/set-state-in-effect */
import { useNavigate } from "react-router-dom";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { ActionFormCard } from "@/features/dashboard/components/ActionFormCard";
import { DashboardTable } from "@/features/dashboard/components/DashboardTable";
import { PrintPassModal } from "@/features/print/components/PrintPassModal";

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
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
  } = useDashboard();

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Top Navbar */}
      <header className="dashboard-home-header">
        <div className="dashboard-home-header-inner">
          <div className="flex items-center gap-4">
            <div className="font-extrabold text-xl text-slate-800 tracking-tight">
              Visitor Control Center
            </div>
            <div className="live-indicator">
              <span className="live-indicator-dot" />
              <span className="live-indicator-text">Real-Time Live</span>
            </div>
          </div>

          <div className="text-sm text-slate-500 font-medium">
            Today:{" "}
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 min-w-0">
        <div className="flex-1 p-8 min-w-0">
          <div className="max-w-[85rem] mx-auto w-full">
            {error && (
              <div className="alert-banner alert-danger">
                ⚠️ {error}
              </div>
            )}

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate("/create-pass")}
                className="h-auto text-lg font-bold flex flex-col items-center justify-center p-8 bg-white border border-slate-200 text-primary hover:border-primary rounded-2xl cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-3xl mb-2 text-primary p-3 bg-indigo-50 rounded-full shrink-0">➕</div>
                <span className="text-slate-800">Create New Gate Pass</span>
                <span className="text-xs font-semibold text-slate-450 mt-1">Generate a fresh guest visitor entry</span>
              </button>

              <StatCard
                title="Total Visitors Registered"
                value={dashboardState.stats.totalCompaniesGuest}
                icon="👥"
                colorHex="#4f46e5"
              />
              <StatCard
                title="Today's Guests"
                value={dashboardState.stats.todaysGuest}
                icon="📅"
                colorHex="#4f46e5"
              />
            </div>

            {/* Quick Actions / Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <ActionFormCard
                title="PASS LOG IN (Check-In)"
                buttonText="Log In"
                onSubmit={(visitorId) => handleUpdateStatus(visitorId, "Checked-In")}
              />
              <ActionFormCard
                title="PASS LOG OUT (Check-Out)"
                buttonText="Log Out"
                onSubmit={(visitorId) => handleUpdateStatus(visitorId, "Checked-Out")}
              />
            </div>

            {/* Loading Indicator */}
            {isLoading ? (
              <div className="loading-center">
                <div className="loading-spinner" />
                <span className="loading-text">Loading real data...</span>
              </div>
            ) : (
              <div className="mt-4 pb-20 min-h-[80vh]">
                <DashboardTable
                  title="Requested Passes (Awaiting Creation)"
                  columns={["PASS", "GATE PASS ID", "Pass Date", "Name", "Employee", "Mobile No", "Email-Id"]}
                  data={dashboardState.requestPassData}
                  actionLabel="Create Pass"
                  actionButtonColor="#f59e0b"
                  onAction={(row) => navigate(`/pass/${row.id}/action?mode=review-request`)}
                  showDeleteAction={true}
                  onDelete={(row) => handleDeletePass(row)}
                />

                <DashboardTable
                  title="Pending Approval Passes"
                  columns={["PASS", "GATE PASS ID", "Pass Date", "Name", "Employee", "Mobile No", "Email-Id"]}
                  data={dashboardState.pendingApprovalPassData}
                  actionLabel="Review & Approve"
                  actionButtonColor="#4f46e5"
                  onAction={(row) => navigate(`/pass/${row.id}/action?mode=approve`)}
                  showDeleteAction={true}
                  onDelete={(row) => handleDeletePass(row)}
                />

                <DashboardTable
                  title="Rejected Passes"
                  columns={["PASS", "GATE PASS ID", "Pass Date", "Name", "Employee", "Mobile No", "Rejected By", "Rejection Reason", "Status"]}
                  data={dashboardState.rejectedPassData}
                  actionLabel="View Details"
                  actionButtonColor="#475569"
                  onAction={(row) => navigate(`/pass/${row.id}/action?mode=view`)}
                  showDeleteAction={true}
                  onDelete={(row) => handleDeletePass(row)}
                />

                <DashboardTable
                  title="Approved Visitor Passes (Ready to Check In)"
                  columns={["PASS", "GATE PASS ID", "Pass Date", "Timer", "Name", "Employee", "Mobile No"]}
                  data={dashboardState.approvedPassData}
                  actionLabel="Check-In"
                  actionButtonColor="#10b981"
                  onAction={(row) => handleCheckIn(row)}
                  showPrintAction={true}
                  onPrint={(row) => handlePrintTrigger(row)}
                  showDeleteAction={true}
                  onDelete={(row) => handleDeletePass(row)}
                />

                <DashboardTable
                  title="Currently Inside Facility"
                  columns={["PASS", "GATE PASS ID", "Pass Date", "Timer", "Name", "Employee", "Mobile No", "Checked-In By", "Checked-In At"]}
                  data={dashboardState.insidePassData}
                  actionLabel="Check-Out"
                  actionButtonColor="#e11d48"
                  onAction={(row) => handleCheckOut(row)}
                  showPrintAction={true}
                  onPrint={(row) => handlePrintTrigger(row)}
                />

                <DashboardTable
                  title="Exited Visitors (Exit Pass)"
                  columns={["PASS", "GATE PASS ID", "Pass Date", "Name", "Employee", "Mobile No", "Checked-In", "Checked-Out"]}
                  data={dashboardState.exitApprovedPassData}
                  actionLabel="View Details"
                  actionButtonColor="#475569"
                  onAction={(row) => navigate(`/pass/${row.id}/action?mode=view`)}
                  showPrintAction={true}
                  onPrint={(row) => handlePrintTrigger(row)}
                />

                <DashboardTable
                  title="Expired Passes (Past Date)"
                  columns={["PASS", "GATE PASS ID", "Pass Date", "Name", "Employee", "Mobile No", "Status"]}
                  data={dashboardState.expiredPassData}
                  actionLabel={(row) => row.checkedInAt ? "Check-Out" : "View Details"}
                  actionButtonColor={(row) => row.checkedInAt ? "#e11d48" : "#475569"}
                  onAction={(row) => {
                    if (row.checkedInAt) {
                      handleCheckOut(row);
                    } else {
                      navigate(`/pass/${row.id}/action?mode=view`);
                    }
                  }}
                  showDeleteAction={true}
                  onDelete={(row) => handleDeletePass(row)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <PrintPassModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        passData={selectedPassForPrint}
      />
    </div>
  );
}
