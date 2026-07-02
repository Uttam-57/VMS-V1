/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import { getApiError } from "@/shared/services/ApiClient";
import {
  getCompanyRegister,
  updateCompanyRegister,
} from "@/masterCalling/mastersetting/masterSettingApi";
import {
  mapRecordToForm,
  buildCompanyRegisterFormData,
} from "./companyRegisterForm";

export const useCompanyRegister = () => {
  const [form, setForm] = useState(mapRecordToForm(null));
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const record = await getCompanyRegister();
      setForm(mapRecordToForm(record));
      setLogoFile(null);
    } catch (err) {
      setError(getApiError(err, "Failed to load company registration."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccessMessage(null);
  };

  const handleLogoChange = (file) => {
    setLogoFile(file);
    setSuccessMessage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const payload = buildCompanyRegisterFormData(form, logoFile);
      const updated = await updateCompanyRegister(payload);
      setForm(mapRecordToForm(updated));
      setLogoFile(null);
      setSuccessMessage("Company registration updated successfully.");
      return true;
    } catch (err) {
      setError(getApiError(err, "Failed to update company registration."));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    logoFile,
    isLoading,
    isSaving,
    error,
    successMessage,
    setField,
    handleLogoChange,
    handleUpdate,
    refresh: load,
  };
};
