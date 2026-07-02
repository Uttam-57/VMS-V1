import { useState, useEffect, useCallback } from "react";
import { getApiError } from "@/shared/services/ApiClient";
import {
  getCarryWith,
  createCarryWith,
  updateCarryWith,
  deleteCarryWith,
} from "@/masterCalling/mastersetting/masterSettingApi";

export const useCarryWith = () => {
  const [carryWith, setCarryWith] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCarryWith = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCarryWith();
      setCarryWith(Array.isArray(data) ? data : data.carryWithItems || []);
    } catch (err) {
      getApiError(err, "Failed to fetch CarryWiths. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = async (payload) => {
    setError(null);
    try {
      const newRecord = await createCarryWith(payload);
      setCarryWith((prev) => [newRecord, ...prev]);
      return true;
    } catch (err) {
      getApiError(err, "Failed to create CarryWith record.");
      return false;
    }
  };

  const handleUpdate = async (id, payload) => {
    setError(null);
    try {
      const updated = await updateCarryWith(id, payload);
      setCarryWith((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updated } : item))
      );
      return true;
    } catch (err) {
      getApiError(err, "Failed to update CarryWith details.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    const originalList = [...carryWith];
    setCarryWith((prev) => prev.filter((item) => item._id !== id));
    try {
      await deleteCarryWith(id);
    } catch (err) {
      getApiError(err, "Failed to remove CarryWith. Reverting.");
      setCarryWith(originalList);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCarryWith();
  }, [fetchCarryWith]);

  return {
    carryWith,
    isLoading,
    error,
    refresh: fetchCarryWith,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };
};
