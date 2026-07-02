import React from "react";
import { cn } from "@/shared/utils/cn";

export const DashboardTable = ({
  title,
  columns,
  data,
  actionLabel,
  actionButtonColor,
  onAction,
  showPrintAction = false,
  onPrint,
  showDeleteAction = false,
  onDelete,
}) => (
  <div className="mt-8">
    <h2 className="flex items-center justify-between mb-4">
      <span className="text-slate-800 font-bold text-lg">{title}</span>
      <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-semibold">
        {data.length} records
      </span>
    </h2>
    <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
              {(actionLabel || showPrintAction || showDeleteAction) && (
                <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {columns.map((col, colIndex) => {
                    const key = col.toLowerCase().replace(/ /g, "_");
                    const val = row[key] || "-";

                    if (key === "status" || col === "Status") {
                      return (
                        <td key={colIndex} className="px-5 py-3.5 align-middle">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-semibold inline-block",
                              val === "Approved" ? "bg-green-100 text-green-800" :
                              val === "Pending" ? "bg-amber-100 text-amber-800" :
                              val === "Checked-In" ? "bg-sky-100 text-sky-800" :
                              val === "Checked-Out" ? "bg-slate-100 text-slate-700" :
                              "bg-rose-100 text-rose-800"
                            )}
                          >
                            {val}
                          </span>
                        </td>
                      );
                    }

                    if (key === "pass" || col === "PASS") {
                      const isMulti = val.toLowerCase().includes("multi");
                      return (
                        <td key={colIndex} className="px-5 py-3.5 align-middle">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-full text-xs font-semibold inline-block",
                              isMulti ? "bg-purple-100 text-purple-800" : "bg-sky-100 text-sky-850"
                            )}
                          >
                            {val}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td key={colIndex} className="px-5 py-3.5 align-middle text-slate-700">
                        {val}
                      </td>
                    );
                  })}
                  {(actionLabel || showPrintAction || showDeleteAction) && (
                    <td className="px-5 py-2.5 align-middle text-center">
                      <div className="flex gap-2 justify-center items-center">
                        {actionLabel && (
                          <button
                            onClick={() => onAction && onAction(row)}
                            style={{
                              backgroundColor: typeof actionButtonColor === "function"
                                ? actionButtonColor(row)
                                : (actionButtonColor || "#4f46e5"),
                            }}
                            className="text-white rounded-md px-3.5 h-8 text-xs font-semibold border-0 cursor-pointer inline-flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity"
                          >
                            {typeof actionLabel === "function" ? actionLabel(row) : actionLabel}
                          </button>
                        )}
                        {showPrintAction && (
                          <button
                            onClick={() => onPrint && onPrint(row)}
                            title="Print Access Pass"
                            className="bg-slate-50 hover:bg-slate-105 text-primary border border-slate-300 hover:border-primary rounded-md w-8 h-8 inline-flex items-center justify-center cursor-pointer transition-colors box-border p-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>
                          </button>
                        )}
                        {showDeleteAction && (
                          <button
                            onClick={() => onDelete && onDelete(row)}
                            title="Delete Gate Pass"
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-500 rounded-md w-8 h-8 inline-flex items-center justify-center cursor-pointer transition-colors box-border p-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actionLabel || showPrintAction || showDeleteAction ? 1 : 0)}
                  className="text-center py-12 text-slate-400 text-sm font-medium"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
