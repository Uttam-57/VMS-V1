import { useState, useEffect, useCallback } from "react";
import { getApiError } from "@/shared/services/ApiClient";
import {
  getIdType,
  createIdType,
  updateIdType,
  deleteIdType,
} from "@/masterCalling/mastersetting/masterSettingApi";

export const useIdType = () => {
  const [idType, setIdType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIdType = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getIdType();
      setIdType(Array.isArray(data) ? data : data.idType || []);
    } catch (err) {
      getApiError(err, "Failed to fetch ID types. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = async (payload) => {
    setError(null);
    try {
      const newRecord = await createIdType(payload);
      setIdType((prev) => [newRecord, ...prev]);
      return true;
    } catch (err) {
      getApiError(err, "Failed to create ID type record.");
      return false;
    }
  };

  const handleUpdate = async (id, payload) => {
    setError(null);
    try {
      const updated = await updateIdType(id, payload);
      setIdType((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updated } : item))
      );
      return true;
    } catch (err) {
      getApiError(err, "Failed to update ID type.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    const originalList = [...idType];
    setIdType((prev) => prev.filter((item) => item._id !== id));
    try {
      await deleteIdType(id);
    } catch (err) {
      getApiError(err, "Failed to remove ID type. Reverting.");
      setIdType(originalList);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIdType();
  }, [fetchIdType]);

  return {
    idType,
    isLoading,
    error,
    refresh: fetchIdType,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };
};
