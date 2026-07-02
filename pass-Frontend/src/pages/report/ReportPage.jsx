import { useState, useEffect } from 'react';
import { useEmployees } from "@/features/mastersetting/hooks/useEmployee";
import { useVisitorArea } from "@/features/mastersetting/hooks/useVisitorArea";
import { FileText, Download, ChevronDown, FileSpreadsheet, Printer } from 'lucide-react';
import { Button } from '@/shared/ui/atoms/Button';
import { FilterPanel } from "@/features/report/components/FilterPanel";
import { VisitorGroupTable } from "@/features/report/components/VisitorGroupTable";
import { FullPassLog } from "@/features/report/components/FullPassLog";
import { useReport } from "@/features/report/hooks/useReport";
import { UniversalHeader } from "@/shared/components/UniversalHeader";
import { cn } from "@/shared/utils/cn";

export default function ReportsPage({ mode = "generate" }) {
  const { employees = [], isLoading: loadingEmployees } = useEmployees();
  const { visitorArea = [], isLoading: loadingAreas } = useVisitorArea();

  const reportData = useReport({ mode });
  const {
    groupedVisitors,
    isLoading,
    error,
    datePreset,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    selectedEmployee,
    setSelectedEmployee,
    selectedArea,
    setSelectedArea,
    searchName,
    setSearchName,
    searchMobile,
    setSearchMobile,
    searchId,
    setSearchId,
    handlePresetChange,
    handleGenerateReport
  } = reportData;

  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  useEffect(() => {
    setSelectedVisitor(null);
  }, [mode]);

  useEffect(() => {
    if (!showExportDropdown) return;
    const handleOutsideClick = (e) => {
      const wrapper = document.getElementById('export-dropdown-wrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showExportDropdown]);

  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = employees.find(e => e._id === id || e.id === id);
    return emp ? emp.name : id;
  };

  const handleExportCSV = () => {
    if (selectedVisitor) {
      if (!selectedVisitor.passes || selectedVisitor.passes.length === 0) return;
      const headers = ['Pass ID', 'Date', 'Status', 'Host', 'Location', 'Purpose', 'Time Allowed'];
      const csvContent = [
        headers.join(','),
        ...selectedVisitor.passes.map(p => [
          `"${p.gatePassId || ''}"`,
          `"${new Date(p.createdAt).toLocaleString()}"`,
          `"${p.status}"`,
          `"${getEmployeeName(p.toMeetWith)}"`,
          `"${p.subLocation || ''}"`,
          `"${p.purpose || ''}"`,
          `"${p.allowedHours || ''}"`
        ].join(','))
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `VMS_PassLog_${selectedVisitor.name.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (groupedVisitors.length === 0) return;
    const headers = ['Visitor Name', 'Visitor Type', 'Mobile No', 'Email', 'Company', 'Total Passes', 'Last Visit Date'];
    const csvContent = [
      headers.join(','),
      ...groupedVisitors.map(v => [
        `"${v.name}"`,
        `"${v.visitorType}"`,
        `"${v.mobileNo}"`,
        `"${v.emailId || ''}"`,
        `"${v.companyName || ''}"`,
        v.totalPasses,
        new Date(v.lastVisitDate).toLocaleString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VMS_Visitors_${mode === 'today' ? 'today' : startDate + '_to_' + endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    if (selectedVisitor) {
      if (!selectedVisitor.passes || selectedVisitor.passes.length === 0) return;
      const headers = ['Pass ID', 'Date', 'Status', 'Host', 'Location', 'Purpose', 'Time Allowed'];
      const content = [
        headers.join('\t'),
        ...selectedVisitor.passes.map(p => [
          p.gatePassId || '',
          new Date(p.createdAt).toLocaleString(),
          p.status,
          getEmployeeName(p.toMeetWith),
          p.subLocation || '',
          p.purpose || '',
          p.allowedHours || ''
        ].join('\t'))
      ].join('\n');
      const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `VMS_PassLog_${selectedVisitor.name.replace(/\s+/g, '_')}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    if (groupedVisitors.length === 0) return;
    const headers = ['Visitor Name', 'Visitor Type', 'Mobile No', 'Email', 'Company', 'Total Passes', 'Last Visit Date'];
    const content = [
      headers.join('\t'),
      ...groupedVisitors.map(v => [
        v.name,
        v.visitorType,
        v.mobileNo,
        v.emailId || '',
        v.companyName || '',
        v.totalPasses,
        new Date(v.lastVisitDate).toLocaleString()
      ].join('\t'))
    ].join('\n');

    const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VMS_Visitors_${mode === 'today' ? 'today' : startDate + '_to_' + endDate}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    if (groupedVisitors.length === 0) return;
    const printWindow = window.open('', '_blank');
    const todayStr = new Date().toLocaleDateString();

    const tableRows = groupedVisitors.map(v => `
      <tr>
        <td>
          <strong>${v.name}</strong><br/>
          <small>${v.mobileNo}</small>
        </td>
        <td>${v.visitorType}</td>
        <td>${v.companyName || '-'}</td>
        <td>${v.totalPasses}</td>
        <td>${new Date(v.lastVisitDate).toLocaleDateString()}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Visitor Summary Report - ${todayStr}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; padding: 2rem; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4f46e5; padding-bottom: 1rem; margin-bottom: 2rem; }
            .title { margin: 0; color: #4f46e5; font-size: 1.5rem; font-weight: 800; }
            .meta { font-size: 0.85rem; color: #64748b; text-align: right; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-size: 0.85rem; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 0.75rem 1rem; text-align: left; }
            th { background-color: #f8fafc; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">Visitor Control Center - Master Summary</h1>
              <div style="font-size: 0.85rem; color: #475569; margin-top: 0.25rem;">
                Period: ${mode === 'today' ? "Today's Live Records" : datePreset + ' (' + startDate + ' to ' + endDate + ')'}
              </div>
            </div>
            <div class="meta">
              Generated: <strong>${todayStr}</strong><br/>
              Unique Visitors: <strong>${groupedVisitors.length}</strong>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Type</th>
                <th>Company</th>
                <th>Total Passes</th>
                <th>Last Visit</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); setTimeout(() => { window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header Panel */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText className="w-7 h-7 text-primary" />
            {mode === "generate" ? "Visitor History Report" : "Today's Visitor Report"}
          </h1>
          <p className="page-subtitle">
            {mode === "generate" 
              ? "Query and view comprehensive historical logs grouped by visitor." 
              : "Monitor today's active visitors and view their full pass details."}
          </p>
        </div>

        <div id="export-dropdown-wrapper" className="relative">
          <Button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            disabled={(selectedVisitor ? selectedVisitor.passes.length === 0 : groupedVisitors.length === 0) || isLoading}
            className={`flex items-center gap-2 font-semibold shadow-sm border-0 ${
              (selectedVisitor ? selectedVisitor.passes.length === 0 : groupedVisitors.length === 0) 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary-hover cursor-pointer'
            }`}
          >
            <Download size={16} />
            <span>{selectedVisitor ? "Export Visitor Log" : "Export Master Data"}</span>
            <ChevronDown size={14} className={cn("ml-1 transition-transform duration-200", showExportDropdown && "rotate-180")} />
          </Button>

          {showExportDropdown && (selectedVisitor ? selectedVisitor.passes.length > 0 : groupedVisitors.length > 0) && (
            <div className="absolute right-0 top-[calc(100%+6px)] bg-white border border-slate-200 rounded-lg shadow-xl z-50 min-w-[200px] p-1 flex flex-col gap-0.5">
              <button onClick={() => { handleExportCSV(); setShowExportDropdown(false); }} className="export-dropdown-item flex items-center gap-3 w-full px-3.5 py-2.5 border-0 bg-transparent text-slate-700 text-sm font-medium text-left cursor-pointer rounded-md hover:bg-slate-50 transition-colors">
                <Download size={16} className="text-primary" />
                <span>Export as CSV</span>
              </button>
              <button onClick={() => { handleExportExcel(); setShowExportDropdown(false); }} className="export-dropdown-item flex items-center gap-3 w-full px-3.5 py-2.5 border-0 bg-transparent text-slate-700 text-sm font-medium text-left cursor-pointer rounded-md hover:bg-slate-50 transition-colors">
                <FileSpreadsheet size={16} className="text-success" />
                <span>Export as Excel</span>
              </button>
              {!selectedVisitor && (
                <button onClick={() => { handlePrintReport(); setShowExportDropdown(false); }} className="export-dropdown-item flex items-center gap-3 w-full px-3.5 py-2.5 border-0 bg-transparent text-slate-700 text-sm font-medium text-left cursor-pointer rounded-md hover:bg-slate-50 transition-colors">
                  <Printer size={16} className="text-primary" />
                  <span>Print Master Summary</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="alert-banner alert-danger">
          ⚠️ {error}
        </div>
      )}

      {selectedVisitor ? (
        <FullPassLog visitor={selectedVisitor} onBack={() => setSelectedVisitor(null)} getEmployeeName={getEmployeeName} />
      ) : (
        <>
          <FilterPanel
            mode={mode}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            searchId={searchId} setSearchId={setSearchId}
            searchName={searchName} setSearchName={setSearchName}
            searchMobile={searchMobile} setSearchMobile={setSearchMobile}
            selectedEmployee={selectedEmployee} setSelectedEmployee={setSelectedEmployee}
            selectedArea={selectedArea} setSelectedArea={setSelectedArea}
            status={status} setStatus={setStatus}
            employees={employees} visitorArea={visitorArea}
            loadingEmployees={loadingEmployees} loadingAreas={loadingAreas}
            isLoading={isLoading}
            handleGenerateReport={handleGenerateReport}
            datePreset={datePreset}
            handlePresetChange={handlePresetChange}
          />
          <div className="page-section">
            <VisitorGroupTable
              isLoading={isLoading}
              groupedVisitors={groupedVisitors}
              mode={mode}
              onViewLog={setSelectedVisitor}
            />
          </div>
        </>
      )}
    </div>
  );
}
