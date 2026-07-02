import { useState, useEffect, useCallback } from "react";
import { getApiError } from "@/shared/services/ApiClient";
import {
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/masterCalling/mastersetting/masterSettingApi";

export const useDepartment = () => {
  const [department, setDepartment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartment = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDepartment();
      setDepartment(Array.isArray(data) ? data : data.department || []);
    } catch (err) {
      getApiError(err, "Failed to fetch departments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = async (payload) => {
    setError(null);
    try {
      const newRecord = await createDepartment(payload);
      setDepartment((prev) => [newRecord, ...prev]);
      return true;
    } catch (err) {
      getApiError(err, "Failed to create department record.");
      return false;
    }
  };

  const handleUpdate = async (id, payload) => {
    setError(null);
    try {
      const updated = await updateDepartment(id, payload);
      setDepartment((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updated } : item))
      );
      return true;
    } catch (err) {
      getApiError(err, "Failed to update department.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    const originalList = [...department];
    setDepartment((prev) => prev.filter((item) => item._id !== id));
    try {
      await deleteDepartment(id);
    } catch (err) {
      getApiError(err, "Failed to remove department. Reverting.");
      setDepartment(originalList);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDepartment();
  }, [fetchDepartment]);

  return {
    department,
    isLoading,
    error,
    refresh: fetchDepartment,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };
};
