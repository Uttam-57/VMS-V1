import { useState, useMemo } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Pagination } from "@/shared/ui/molecules/Pagination";
import { queryGet } from "@/shared/services/api";
// ─── Default status colors ───────────────────────────────────────────────────
const DEFAULT_STATUS_COLORS = {
  active: "bg-green-50 text-green-800 border border-green-200",
  blocked: "bg-amber-50 text-amber-800 border border-amber-200",
  deleted: "bg-red-50 text-red-800 border border-red-200",
};
// ─── Helpers ─────────────────────────────────────────────────────────────────
function getNestedValue(obj, key) {
  return key.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object") {
      return acc[part];
    }
    return undefined;
  }, obj);
}
function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
const FormPage = ({ title, fields, initialValues = {}, onSubmit, onCancel }) => {
  const [values, setValues] = useState(() => {
    const defaults = {};
    fields.forEach((f) => {
      defaults[f.key] = initialValues[f.key] ?? f.defaultValue ?? "";
    });
    return defaults;
  });
  const [errors, setErrors] = useState({});

  const handleBlur = async (fieldKey, value) => {
    if (fieldKey === "email" && value) {
      try {
        const isEmployeeForm = title.toLowerCase().includes("employee");
        const endpoint = isEmployeeForm ? "/master/employee/check-email" : "/user/check-email";
        const excludeId = initialValues._id || initialValues.id || "";
        const res = await queryGet(`${endpoint}?email=${encodeURIComponent(value)}&excludeId=${excludeId}`);
        if (res?.data?.data?.exists) {
          setErrors(prev => ({ ...prev, [fieldKey]: "This email is already in use in the system." }));
        } else {
          setErrors(prev => ({ ...prev, [fieldKey]: "" }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChange = (fieldKey, value) => {
    setValues(v => ({ ...v, [fieldKey]: value }));
    if (errors[fieldKey]) {
      setErrors(prev => ({ ...prev, [fieldKey]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some(Boolean)) return;
    onSubmit(values);
  };
  return (
    <div className="p-6 w-full max-w-7xl mx-auto flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between pb-5 border-b-2 border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-800 transition-colors text-sm font-semibold flex items-center gap-2">
          ← Back to List
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 flex-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === "select" && field.options ? (
                  <select
                    id={field.key}
                    name={field.key}
                    value={values[field.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                    required={field.required}
                    className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-500/10 bg-gray-50 transition-all cursor-pointer"
                  >
                    <option value="">Select {field.label}...</option>
                    {field.options.map((opt, optIdx) => (
                      <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
                    ))}
                  </select>
                ) : field.type === "multi-select" && field.options ? (() => {
                  const selectedIds = Array.isArray(values[field.key])
                    ? values[field.key]
                    : (values[field.key] || "").split(",").filter(Boolean);

                  return (
                    <div className="flex flex-col gap-3 border border-gray-200 rounded-xl p-4 bg-gray-50/50 col-span-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Assigned Approvers ({selectedIds.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            // Find first available unselected user to auto-select
                            const available = field.options.find(opt => !selectedIds.includes(opt.value));
                            const newVal = available ? available.value : "";
                            setValues((v) => ({ ...v, [field.key]: [...selectedIds, newVal] }));
                          }}
                          className="text-xs font-semibold text-primary bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
                        >
                          + Add Approver
                        </button>
                      </div>

                      {selectedIds.length === 0 ? (
                        <div className="text-center py-6 text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg bg-white">
                          No approvers assigned to this employee.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {selectedIds.map((selectedId, idx) => {
                            // Exclude options that are selected in other rows
                            const availableOptions = field.options.filter(
                              (opt) => opt.value === selectedId || !selectedIds.includes(opt.value)
                            );

                            return (
                              <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm animate-in fade-in duration-200">
                                <select
                                  value={selectedId}
                                  onChange={(e) => {
                                    const updated = [...selectedIds];
                                    updated[idx] = e.target.value;
                                    setValues((v) => ({ ...v, [field.key]: updated }));
                                  }}
                                  className="flex-1 h-9 px-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:border-teal-700 outline-none"
                                >
                                  <option value="">Select Approving User...</option>
                                  {availableOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = selectedIds.filter((_, i) => i !== idx);
                                    setValues((v) => ({ ...v, [field.key]: updated }));
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all border border-transparent hover:border-red-100"
                                  title="Remove Approver"
                                >
                                  🗑️
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })() : (
                  <>
                    <input
                      type={field.type ?? "text"}
                      id={field.key}
                      name={field.key}
                      value={values[field.key]}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      onBlur={(e) => handleBlur(field.key, e.target.value)}
                      placeholder={field.placeholder ?? `Enter ${field.label.toLowerCase()}...`}
                      required={field.required}
                      disabled={field.disabled}
                      className={`w-full h-10 px-3 text-sm border rounded-lg outline-none transition-all ${errors[field.key] ? 'border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/10' : 'border-gray-300 focus:border-teal-700 focus:ring-2 focus:ring-teal-500/10 bg-gray-50'} disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
                    />
                    {errors[field.key] && (
                      <p className="text-xs text-red-500 font-semibold">{errors[field.key]}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={onCancel} className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={Object.values(errors).some(Boolean)}
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${Object.values(errors).some(Boolean) ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover'}`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
const Cell = ({ col, row, statusColors }) => {
  const value = getNestedValue(row, col.key);
  if (col.render) {
    return <>{col.render(value, row)}</>;
  }
  switch (col.type) {
    case "status": {
      const str = displayValue(value).toLowerCase();
      const cls =
        statusColors[str] ?? "dynamic-status-default";
      return (
        <span
          className={`dynamic-status-badge ${cls}`}
        >
          {str}
        </span>
      );
    }
    case "badge": {
      return (
        <span className="dynamic-badge">
          {displayValue(value)}
        </span>
      );
    }
    case "mono": {
      return (
        <span className="dynamic-mono">
          {displayValue(value)}
        </span>
      );
    }
    case "email": {
      const str = displayValue(value);
      return str === "—" ? (
        <span className="dynamic-empty">—</span>
      ) : (
        <a
          href={`mailto:${str}`}
          className="dynamic-email"
        >
          {str}
        </a>
      );
    }
    case "phone": {
      const str = displayValue(value);
      return str === "—" ? (
        <span className="dynamic-empty">—</span>
      ) : (
        <a
          href={`tel:${str}`}
          className="dynamic-phone"
        >
          {str}
        </a>
      );
    }
    default: {
      const str = displayValue(value);
      return str === "—" ? (
        <span className="dynamic-empty">—</span>
      ) : (
        <span className="dynamic-text">{str}</span>
      );
    }
  }
};
// ─── Main Component ───────────────────────────────────────────────────────────
export const DynamicDataPage = ({
  title,
  subtitle,
  data = [],
  idKey = "_id",
  columns,
  statusColors = DEFAULT_STATUS_COLORS,
  isLoading = false,
  error = null,
  onCreate,
  onEdit,
  onDelete,
  isRowEditable,
  isRowDeletable,
  formFields = [],
}) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [modalMode, setModalMode] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  // ── Merge status colors ──
  const mergedStatusColors = { ...DEFAULT_STATUS_COLORS, ...statusColors };
  // ── Searchable columns ──
  const searchableCols = columns.filter((c) => c.searchable !== false);
  // ── Filter + sort ──
  const processedData = useMemo(() => {
    let result = Array.isArray(data) ? [...data] : [];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        searchableCols.some((col) => {
          const v = getNestedValue(row, col.key);
          return displayValue(v).toLowerCase().includes(q);
        }),
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const av = displayValue(getNestedValue(a, sortKey));
        const bv = displayValue(getNestedValue(b, sortKey));
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, search, sortKey, sortDir]);
  // ── Sort toggle ──
  const handleSort = (key) => {
    if (!columns.find((c) => c.key === key)?.sortable) return;
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  // ── Pagination ──
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Reset to page 1 if data size or search changes
  useMemo(() => {
    // eslint-disable-next-line react-hooks/set-state-in-render
    setCurrentPage(1);
  }, [search, sortKey, sortDir, pageSize]);

  // ── CRUD ──
  const handleCreate = (values) => {
    onCreate?.(values);
    setModalMode(null);
  };
  const handleEdit = (values) => {
    if (!editRow) return;
    const id = String(editRow[idKey] ?? "");
    onEdit?.(id, values);
    setModalMode(null);
    setEditRow(null);
  };
  const handleDelete = (row) => {
    const id = String(row[idKey] ?? "");
    const label = formFields[0]
      ? String(getNestedValue(row, formFields[0].key) ?? id)
      : id;
    if (window.confirm(`Delete "${label}"? This cannot be undone.`)) {
      onDelete?.(id);
    }
  };
  const openEdit = (row) => {
    setEditRow(row);
    setModalMode("edit");
  };
  // ── Sort icon ──
  const SortIcon = ({ col }) => {
    if (!col.sortable) return null;
    const active = sortKey === col.key;
    return (
      <span
        className={`ml-1 inline-block text-xs ${active ? "text-teal-700" : "text-gray-300"}`}
      >
        {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    );
  };
  const hasActions = onCreate || onEdit || onDelete;
  const initialEditValues = editRow
    ? Object.fromEntries(
        formFields.map((f) => {
          const rawVal = getNestedValue(editRow, f.key);
          if (f.type === "multi-select" && Array.isArray(rawVal)) {
            return [f.key, rawVal];
          }
          return [
            f.key,
            displayValue(rawVal) === "—" ? "" : rawVal,
          ];
        }),
      )
    : {};

  if (modalMode === "add" && formFields.length > 0) {
    return (
      <FormPage
        title={`Add New ${title.replace(/s$/, "")}`}
        fields={formFields}
        onSubmit={handleCreate}
        onCancel={() => setModalMode(null)}
      />
    );
  }

  if (modalMode === "edit" && formFields.length > 0 && editRow) {
    return (
      <FormPage
        title={`Edit ${title.replace(/s$/, "")}`}
        fields={formFields}
        initialValues={initialEditValues}
        onSubmit={handleEdit}
        onCancel={() => {
          setModalMode(null);
          setEditRow(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100">
          {
            <div>
              {
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {title}
                </h1>
              }
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          }
          {onCreate && formFields.length > 0 && (
            <button
              onClick={() => setModalMode("add")}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              {<span className="text-lg leading-none">+</span>}Add{" "}
              {title.replace(/s$/, "")}
            </button>
          )}
        </div>
      }
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}
      {
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3">
          {<span className="text-gray-400 text-base">🔍</span>}
          {
            <input
              type="text"
              id="table-search"
              name="tableSearch"
              aria-label={`Search ${title.toLowerCase()}`}
              placeholder={`Search ${title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
          }
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear
            </button>
          )}
          {
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {processedData.length} of {Array.isArray(data) ? data.length : 0}
            </span>
          }
        </div>
      }
      {
        <div className="overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm">
          {
            <div className="overflow-x-auto">
              {
                <table className="w-full text-base text-left border-collapse">
                  {
                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                      {
                        <tr>
                          <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200">
                            Sr No.
                          </th>
                          {columns.map((col) => (
                            <th
                              key={col.key}
                              style={
                                col.width ? { width: col.width } : undefined
                              }
                              onClick={() => handleSort(col.key)}
                              className={`px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 ${col.sortable ? "cursor-pointer select-none hover:bg-gray-200 transition-colors" : ""}`}
                            >
                              {col.label}
                              {<SortIcon col={col} />}
                            </th>
                          ))}
                          {hasActions && (
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">
                              Actions
                            </th>
                          )}
                        </tr>
                      }
                    </thead>
                  }
                  {
                    <tbody className="divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          {
                            <td
                              colSpan={columns.length + (hasActions ? 1 : 0)}
                              className="text-center py-14 text-sm text-gray-400"
                            >
                              {
                                <span className="animate-pulse">
                                  Loading...
                                </span>
                              }
                            </td>
                          }
                        </tr>
                      ) : paginatedData.length === 0 ? (
                        <tr>
                          {
                            <td
                              colSpan={columns.length + (hasActions ? 2 : 1)}
                              className="text-center py-14 text-sm text-gray-400"
                            >
                              {search
                                ? `No results for "${search}"`
                                : "No records found."}
                            </td>
                          }
                        </tr>
                      ) : (
                        // eslint-disable-next-line no-unused-vars
                        paginatedData.map((row, rowIdx) => (
                          <tr key={row[idKey] ?? rowIdx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 font-semibold border-r border-gray-100">
                              {(currentPage - 1) * pageSize + rowIdx + 1}
                            </td>
                            {columns.map((col) => (
                              <td key={col.key} className="px-6 py-4 whitespace-nowrap border-r border-gray-100 text-gray-800">
                                {
                                  <Cell
                                    col={col}
                                    row={row}
                                    statusColors={mergedStatusColors}
                                  />
                                }
                              </td>
                            ))}
                            {hasActions && (
                              <td className="px-6 py-4 text-right whitespace-nowrap">
                                {
                                  <div className="flex items-center justify-end gap-4">
                                      {onEdit && formFields.length > 0 && (!isRowEditable || isRowEditable(row)) && (
                                        <button
                                          onClick={() => openEdit(row)}
                                          className="text-primary hover:text-primary-hover hover:bg-indigo-50 p-2 rounded-lg transition-all"
                                          title="Edit"
                                        >
                                          <Edit2 size={20} />
                                        </button>
                                      )}
                                    {onDelete && (!isRowDeletable || isRowDeletable(row)) && (
                                      <button
                                        onClick={() => handleDelete(row)}
                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                                        title="Delete"
                                      >
                                        <Trash2 size={20} />
                                      </button>
                                    )}
                                  </div>
                                }
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  }
                </table>
              }
            </div>
          }
          {!isLoading && processedData.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalCount={processedData.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => { setPageSize(newSize); setCurrentPage(1); }}
              className="bg-gray-50 border-t border-gray-100"
            />
          )}
        </div>
      }
    </div>
  );
};
export default DynamicDataPage;
