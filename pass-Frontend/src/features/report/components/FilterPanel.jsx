import { Button } from "@/shared/ui/atoms/Button";
import { Calendar, Clock, Search } from "lucide-react";

export const FilterPanel = ({
  mode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  searchId,
  setSearchId,
  selectedEmployee,
  setSelectedEmployee,
  selectedArea,
  setSelectedArea,
  searchName,
  setSearchName,
  searchMobile,
  setSearchMobile,
  status,
  setStatus,
  employees,
  visitorArea,
  loadingEmployees,
  loadingAreas,
  isLoading,
  handleGenerateReport,
  datePreset,
  handlePresetChange,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-end">
        {/* Preset Select Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="datePreset">Date Preset</label>
          <select
            id="datePreset"
            name="datePreset"
            value={datePreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full h-10 px-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            {mode === "today" && <option value="Today">Today</option>}
            {mode === "generate" && <option value="Last Month">Last Month</option>}
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Quarter 1">Quarter 1 (Jan-Mar)</option>
            <option value="Quarter 2">Quarter 2 (Apr-Jun)</option>
            <option value="Quarter 3">Quarter 3 (Jul-Sep)</option>
            <option value="Quarter 4">Quarter 4 (Oct-Dec)</option>
            {mode === "generate" && <option value="Custom">Custom</option>}
          </select>
        </div>

        {/* Mode Generate Inputs */}
        {mode === "generate" && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="startDate">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 px-3 pr-9 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="endDate">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-10 px-3 pr-9 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </>
        )}

        {/* Mode Today Lock Indicator */}
        {mode === "today" && (
          <div>
            <span className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Reporting Period</span>
            <div className="h-10 border border-slate-300 rounded-lg px-3 bg-slate-100 text-slate-700 text-sm font-semibold flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              <span>
                {datePreset === 'Today' 
                  ? `Today (${new Date().toLocaleDateString()})` 
                  : `${datePreset} (${startDate} to ${endDate})`}
              </span>
            </div>
          </div>
        )}

        {/* Search by Name */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="searchName">Visitor Name</label>
          <div className="relative">
            <input
              type="text"
              id="searchName"
              name="searchName"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full h-10 px-3 pr-9 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Search by Mobile */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="searchMobile">Mobile No.</label>
          <div className="relative">
            <input
              type="text"
              id="searchMobile"
              name="searchMobile"
              placeholder="Search by mobile..."
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              className="w-full h-10 px-3 pr-9 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Find by ID Search - for Today mode */}
        {mode === "today" && (
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="searchId">Pass ID</label>
            <div className="relative">
              <input
                type="text"
                id="searchId"
                name="searchId"
                placeholder="Enter Pass ID..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full h-10 px-3 pr-9 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Host Employee Select */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="hostEmployee">Host Employee</label>
          <select
            id="hostEmployee"
            name="hostEmployee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            disabled={loadingEmployees}
            className="w-full h-10 px-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            <option value="All">All Employees</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Visiting Area Select */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="visitingArea">Visiting Area</label>
          <select
            id="visitingArea"
            name="visitingArea"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            disabled={loadingAreas}
            className="w-full h-10 px-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            <option value="All">All Visiting Areas</option>
            {visitorArea.map((area) => (
              <option key={area._id || area.id} value={area.name}>
                {area.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider" htmlFor="passStatus">Pass Status</label>
          <select
            id="passStatus"
            name="passStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-10 px-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Requested">Requested</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Checked-In">Checked-In</option>
            <option value="Checked-Out">Checked-Out</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Generate Button - only visible for generate mode */}
        {mode === "generate" && (
          <Button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-white h-10 font-semibold border-0 cursor-pointer shadow-sm rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Search size={16} /> Generate Report
          </Button>
        )}
      </div>
    </div>
  );
};
