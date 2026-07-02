import { useState, useEffect, useCallback } from "react";
import { getApiError } from "@/shared/services/ApiClient";
import {
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/masterCalling/mastersetting/masterSettingApi";

export const useLocation = () => {
  const [location, setLocation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLocation();
      setLocation(Array.isArray(data) ? data : data.location || []);
    } catch (err) {
      getApiError(err, "Failed to fetch locations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = async (payload) => {
    setError(null);
    try {
      const newRecord = await createLocation(payload);
      setLocation((prev) => [newRecord, ...prev]);
      return true;
    } catch (err) {
      getApiError(err, "Failed to create location record.");
      return false;
    }
  };

  const handleUpdate = async (id, payload) => {
    setError(null);
    try {
      const updated = await updateLocation(id, payload);
      setLocation((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...updated } : item))
      );
      return true;
    } catch (err) {
      getApiError(err, "Failed to update location details.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    const originalList = [...location];
    setLocation((prev) => prev.filter((item) => item._id !== id));
    try {
      await deleteLocation(id);
    } catch (err) {
      getApiError(err, "Failed to remove location. Reverting.");
      setLocation(originalList);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLocation();
  }, [fetchLocation]);

  return {
    location,
    isLoading,
    error,
    refresh: fetchLocation,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
  };
};
