import { useState, useEffect, useCallback } from "react";
import { getApiError } from "@/shared/services/ApiClient";
import {
  getPurpose,
  createPurpose,
  updatePurpose,
  deletePurpose,
} from "@/masterCalling/mastersetting/masterSettingApi";

export const usePurpose = () => {
  const [purposes, setPurposes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPurposes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPurpose();
      setPurposes(Array.isArray(data) ? data : data.purposes || data.purpose || []);
    } catch (err) {
      getApiError(err, "Failed to fetch purposes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = async (payload) => {
    setError(null);
    try {
      const newRecord = await createPurpose(payload);
      const record = newRecord?.purpose ?? newRecord;
      setPurposes((prev) => [record, ...prev]);
      return true;
    } catch (err) {
      getApiError(err, "Failed to create purpose record.");
      return false;
    }
  };

  const handleUpdate = async (id, payload) => {
    setError(null);
    try {
      const updated = await updatePurpose(id, payload);
      const record = updated?.purpose ?? updated;
      setPurposes((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...record } : item))
      );
      return true;
    } catch (err) {
      getApiError(err, "Failed to update purpose.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    const originalList = [...purposes];
    setPurposes((prev) => prev.filter((item) => item._id !== id));
    try {
      await deletePurpose(id);
    } catch (err) {
      getApiError(err, "Failed to remove purpose. Reverting.");
      setPurposes(originalList);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPurposes();
  }, [fetchPurposes]);

  return {
    purposes,
    isLoading,
    error,
    refresh: fetchPurposes,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };
};
