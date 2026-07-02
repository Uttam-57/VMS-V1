import { useState, useEffect, useCallback } from "react";
import { getApiError } from "@/shared/services/ApiClient";
import {
  getVisitorType,
  createVisitorType,
  updateVisitorType,
  deleteVisitorType,
} from "@/masterCalling/mastersetting/masterSettingApi";

export const useVisitorType = () => {
  const [visitorType, setVisitorType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVisitorType = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVisitorType();
      setVisitorType(Array.isArray(data) ? data : data.visitorTypes || []);
    } catch (err) {
      getApiError(err, "Failed to fetch visitor types. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = async (payload) => {
    setError(null);
    try {
      const newRecord = await createVisitorType(payload);
      setVisitorType((prev) => [newRecord, ...prev]);
      return true;
    } catch (err) {
      getApiError(err, "Failed to create visitor type.");
      return false;
    }
  };

  const handleUpdate = async (id, payload) => {
    setError(null);
    try {
      const updated = await updateVisitorType(id, payload);
      setVisitorType((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updated } : item))
      );
      return true;
    } catch (err) {
      getApiError(err, "Failed to update visitor type.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    const originalList = [...visitorType];
    setVisitorType((prev) => prev.filter((item) => item._id !== id));
    try {
      await deleteVisitorType(id);
    } catch (err) {
      getApiError(err, "Failed to remove visitor type. Reverting.");
      setVisitorType(originalList);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVisitorType();
  }, [fetchVisitorType]);

  return {
    visitorType,
    isLoading,
    error,
    refresh: fetchVisitorType,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };
};
