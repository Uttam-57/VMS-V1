export const ActionButtons = ({
  mode,
  passData,
  isSubmitting,
  handleSubmitAction,
  navigate,
}) => {
  return (
    <div className="mt-12 pt-6 border-t border-slate-200 flex justify-end gap-4 flex-wrap">
      {/* Back/Cancel Button always present */}
      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        Cancel
      </button>

      {/* Mode 1: review-request action buttons */}
      {mode === "review-request" && passData.status === "Requested" && (
        <>
          <button
            onClick={() => handleSubmitAction("Rejected", true)}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold rounded-lg bg-danger hover:bg-danger-hover text-white border-0 transition-colors cursor-pointer shadow-sm"
          >
            Reject Request
          </button>
          <button
            onClick={() => handleSubmitAction("Pending")}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold rounded-lg bg-primary hover:bg-primary-hover text-white border-0 transition-colors cursor-pointer shadow-sm"
          >
            {isSubmitting ? "Processing..." : "Create Pass & Queue for Approval"}
          </button>
        </>
      )}

      {/* Mode 2: approve action buttons */}
      {mode === "approve" && passData.status === "Pending" && (
        <>
          <button
            onClick={() => handleSubmitAction("Rejected", true)}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold rounded-lg bg-danger hover:bg-danger-hover text-white border-0 transition-colors cursor-pointer shadow-sm"
          >
            Reject Pass
          </button>
          <button
            onClick={() => handleSubmitAction("Approved")}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold rounded-lg bg-success hover:bg-success-hover text-white border-0 transition-colors cursor-pointer shadow-sm"
          >
            {isSubmitting ? "Approving..." : "Approve Pass"}
          </button>
        </>
      )}
    </div>
  );
};
