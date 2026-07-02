import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchReportPasses } from "@/masterCalling/report/reportApi";

export function useReport({ mode }) {
  const [passes, setPasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters State
  const [datePreset, setDatePreset] = useState(mode === 'today' ? 'Today' : 'Last Month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');

  const [searchName, setSearchName] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [searchId, setSearchId] = useState('');

  const getPresetDates = useCallback((preset) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let start = '';
    let end = '';

    switch (preset) {
      case 'Today':
        start = today.toISOString().split('T')[0];
        end = start;
        break;
      case 'Last 7 Days': {
        const d = new Date(today);
        d.setDate(today.getDate() - 7);
        start = d.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      }
      case 'Last 30 Days': {
        const d = new Date(today);
        d.setDate(today.getDate() - 30);
        start = d.toISOString().split('T')[0];
        end = today.toISOString().split('T')[0];
        break;
      }
      case 'Last Month': {
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        start = startOfLastMonth.toISOString().split('T')[0];
        end = endOfLastMonth.toISOString().split('T')[0];
        break;
      }
      case 'Quarter 1': start = `${currentYear}-01-01`; end = `${currentYear}-03-31`; break;
      case 'Quarter 2': start = `${currentYear}-04-01`; end = `${currentYear}-06-30`; break;
      case 'Quarter 3': start = `${currentYear}-07-01`; end = `${currentYear}-09-30`; break;
      case 'Quarter 4': start = `${currentYear}-10-01`; end = `${currentYear}-12-31`; break;
      default: break;
    }
    return { start, end };
  }, []);

  const fetchPassesData = useCallback(async (start, end) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetchReportPasses(start, end);
      if (response.data && response.data.data) {
        setPasses(response.data.data);
      } else {
        setPasses([]);
      }
    } catch (err) {
      console.error('Error fetching passes:', err);
      setError('Failed to load gate passes. Please verify database connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode === "generate") {
      const { start, end } = getPresetDates("Last 7 Days");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartDate(start);
      setEndDate(end);
      setDatePreset("Last 7 Days");
      fetchPassesData(start, end);
    } else if (mode === "today") {
      const { start, end } = getPresetDates("Today");
      setStartDate(start);
      setEndDate(end);
      setDatePreset("Today");
      fetchPassesData(start, end);
    }
  }, [mode, getPresetDates, fetchPassesData]);

  const handlePresetChange = (preset) => {
    setDatePreset(preset);
    if (preset !== 'Custom') {
      const { start, end } = getPresetDates(preset);
      setStartDate(start);
      setEndDate(end);
      fetchPassesData(start, end);
    }
  };

  const handleGenerateReport = () => {
    if (mode === "generate") {
      fetchPassesData(startDate, endDate);
    }
  };

  const filteredPasses = useMemo(() => {
    return passes.filter(pass => {
      if (status !== 'All' && pass.status !== status) return false;
      if (selectedEmployee !== 'All' && pass.toMeetWith !== selectedEmployee) return false;
      if (selectedArea !== 'All') {
        const areaName = selectedArea.toLowerCase();
        const hasArea = Array.isArray(pass.visitArea)
          ? pass.visitArea.some(a => a.toLowerCase() === areaName)
          : typeof pass.visitArea === 'string' && pass.visitArea.toLowerCase() === areaName;
        if (!hasArea) return false;
      }
      if (searchName.trim() !== '') {
        if (!pass.name || !pass.name.toLowerCase().includes(searchName.toLowerCase().trim())) return false;
      }
      if (searchMobile.trim() !== '') {
        if (!pass.mobileNo || !pass.mobileNo.includes(searchMobile.trim())) return false;
      }
      if (mode === "today" && searchId.trim() !== '') {
        const search = searchId.toLowerCase().trim();
        const matchId = pass.gatePassId && pass.gatePassId.toLowerCase().includes(search);
        if (!matchId) return false;
      }
      return true;
    });
  }, [passes, status, selectedEmployee, selectedArea, searchName, searchMobile, searchId, mode]);

  const groupedVisitors = useMemo(() => {
    const groups = {};
    filteredPasses.forEach(pass => {
      const mobile = pass.mobileNo || "Unknown";
      if (!groups[mobile]) {
        groups[mobile] = {
          mobileNo: mobile,
          name: pass.name,
          emailId: pass.emailId,
          companyName: pass.companyName,
          visitorType: pass.representingVisitorType || pass.purpose || "Visitor",
          totalPasses: 0,
          lastVisitDate: pass.createdAt,
          passes: []
        };
      }
      groups[mobile].totalPasses += 1;
      groups[mobile].passes.push(pass);
      if (new Date(pass.createdAt) > new Date(groups[mobile].lastVisitDate)) {
        groups[mobile].lastVisitDate = pass.createdAt;
        groups[mobile].name = pass.name;
        groups[mobile].companyName = pass.companyName;
      }
    });
    return Object.values(groups).sort((a, b) => new Date(b.lastVisitDate) - new Date(a.lastVisitDate));
  }, [filteredPasses]);

  return {
    passes: filteredPasses,
    groupedVisitors,
    isLoading,
    error,
    datePreset,
    startDate, setStartDate,
    endDate, setEndDate,
    status, setStatus,
    selectedEmployee, setSelectedEmployee,
    selectedArea, setSelectedArea,
    searchName, setSearchName,
    searchMobile, setSearchMobile,
    searchId, setSearchId,
    handlePresetChange,
    handleGenerateReport
  };
}
