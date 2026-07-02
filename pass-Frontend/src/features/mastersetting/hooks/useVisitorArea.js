import { useState, useEffect, useCallback } from "react";
import { getApiError } from "@/shared/services/ApiClient";
import {
  getVisitingArea,
  createVisitingArea,
  updateVisitingArea,
  deleteVisitingArea,
} from "@/masterCalling/mastersetting/masterSettingApi";

export const useVisitorArea = () => {
  const [visitorArea, setVisitorArea] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVisitorArea = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVisitingArea();
      setVisitorArea(Array.isArray(data) ? data : data.visitingAreas || []);
    } catch (err) {
      getApiError(err, "Failed to fetch visiting areas. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = async (payload) => {
    setError(null);
    try {
      const newRecord = await createVisitingArea(payload);
      setVisitorArea((prev) => [newRecord, ...prev]);
      return true;
    } catch (err) {
      getApiError(err, "Failed to create visiting area.");
      return false;
    }
  };

  const handleUpdate = async (id, payload) => {
    setError(null);
    try {
      const updated = await updateVisitingArea(id, payload);
      setVisitorArea((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updated } : item))
      );
      return true;
    } catch (err) {
      getApiError(err, "Failed to update visiting area.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    const originalList = [...visitorArea];
    setVisitorArea((prev) => prev.filter((item) => item._id !== id));
    try {
      await deleteVisitingArea(id);
    } catch (err) {
      getApiError(err, "Failed to remove visiting area. Reverting.");
      setVisitorArea(originalList);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVisitorArea();
  }, [fetchVisitorArea]);

  return {
    visitorArea,
    isLoading,
    error,
    refresh: fetchVisitorArea,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };
};
