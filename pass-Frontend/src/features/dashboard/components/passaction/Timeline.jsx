import { cn } from "@/shared/utils/cn";

function TimelineNode({ title, time, desc, subDesc, active, isError }) {
  return (
    <div className="flex gap-4 relative z-[2]">
      <div
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0",
          active
            ? isError
              ? "bg-red-100 text-red-600 border-red-300"
              : "bg-green-100 text-green-800 border-green-300"
            : "bg-slate-100 text-slate-400 border-slate-300"
        )}
      >
        {active ? (isError ? "✗" : "✓") : "•"}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("text-sm font-bold", active ? "text-slate-800" : "text-slate-500")}>
            {title}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {time}
          </span>
        </div>
        <span className={cn("text-xs font-medium", active ? "text-slate-600" : "text-slate-400")}>
          {desc}
        </span>
        {subDesc && (
          <span className="text-xs font-semibold text-red-700 mt-0.5">
            {subDesc}
          </span>
        )}
      </div>
    </div>
  );
}

export const Timeline = ({ passData }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="m-0 mb-4 text-slate-800 font-bold text-base border-b border-slate-100 pb-2">
        Pass Lifecycle & Audits
      </h3>

      <div className="flex flex-col gap-4 relative">
        {/* Vertical bar */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 z-[1]" />

        <TimelineNode
          title="Created / Requested"
          time={passData.createdAt ? new Date(passData.createdAt).toLocaleString() : "-"}
          desc={`Pass requested for date: ${new Date(passData.passDate).toLocaleDateString()}`}
          active={true}
        />

        {passData.status === "Rejected" ? (
          <>
            <TimelineNode
              title="Rejected"
              time={passData.rejectedAt ? new Date(passData.rejectedAt).toLocaleString() : "-"}
              desc={`Rejected by: ${passData.rejectedBy || "Admin"}`}
              subDesc={`Reason: "${passData.rejectionReason || "No reason provided"}"`}
              active={true}
              isError={true}
            />
            <TimelineNode
              title="Checked-In"
              desc="Not checked in (Pass is Rejected)"
              active={false}
            />
            <TimelineNode
              title="Checked-Out"
              desc="Not checked out"
              active={false}
            />
          </>
        ) : passData.status === "Expired" ? (
          <>
            <TimelineNode
              title="Approved"
              time={passData.approvedAt ? new Date(passData.approvedAt).toLocaleString() : "-"}
              desc={passData.approvedAt ? `Approved by: ${passData.approvedBy || "Admin"}` : "Awaiting approval"}
              active={!!passData.approvedAt}
            />
            <TimelineNode
              title="Expired"
              time={passData.to ? new Date(passData.to).toLocaleDateString() : new Date(passData.passDate).toLocaleDateString()}
              desc="Pass expired due to past validity date without check-in."
              active={true}
              isError={true}
            />
            <TimelineNode
              title="Checked-In"
              desc="Not checked in (Pass has Expired)"
              active={false}
            />
            <TimelineNode
              title="Checked-Out"
              desc="Not checked out"
              active={false}
            />
          </>
        ) : (
          <>
            <TimelineNode
              title="Approved"
              time={passData.approvedAt ? new Date(passData.approvedAt).toLocaleString() : "-"}
              desc={passData.approvedAt ? `Approved by: ${passData.approvedBy || "Admin"}` : "Awaiting approval"}
              active={!!passData.approvedAt}
            />

            <TimelineNode
              title="Checked-In"
              time={passData.checkedInAt ? new Date(passData.checkedInAt).toLocaleString() : "-"}
              desc={passData.checkedInAt ? `Checked in by: ${passData.checkedInBy || "Security"}` : "Not checked in yet"}
              active={!!passData.checkedInAt}
            />

            <TimelineNode
              title="Checked-Out"
              time={passData.checkedOutAt ? new Date(passData.checkedOutAt).toLocaleString() : "-"}
              desc={passData.checkedOutAt ? `Checked out by: ${passData.checkedOutBy || "Security"}` : "Not checked out yet"}
              active={!!passData.checkedOutAt}
            />
          </>
        )}
      </div>
    </div>
  );
};
