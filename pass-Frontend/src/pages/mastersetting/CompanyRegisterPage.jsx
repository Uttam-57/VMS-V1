import { useEffect, useMemo } from "react";
import { useCompanyRegister } from "@/features/mastersetting/hooks/useCompanyRegister";
import { resolveUploadUrl } from "@/shared/utils/uploadUrl";

function UnderlineInput({ type = "text", value, onChange, name, id }) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="company-reg-input"
    />
  );
}

export const CompanyRegisterPage = () => {
  const {
    form,
    logoFile,
    isLoading,
    isSaving,
    error,
    successMessage,
    setField,
    handleLogoChange,
    handleUpdate,
  } = useCompanyRegister();

  const logoPreview = useMemo(() => {
    if (logoFile) return URL.createObjectURL(logoFile);
    if (form.logoUrl) return resolveUploadUrl(form.logoUrl);
    return "";
  }, [logoFile, form.logoUrl]);

  useEffect(() => {
    if (!logoFile || !logoPreview.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(logoPreview);
  }, [logoFile, logoPreview]);

  const onChange = (key) => (e) => setField(key, e.target.value);

  if (isLoading) {
    return (
      <div className="company-reg-page">
        <p className="company-reg-loading">Loading company registration…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      <h1 className="company-reg-title">COMPANY REGISTRATION</h1>

      {error && (
        <div className="company-reg-alert company-reg-alert-error">{error}</div>
      )}
      {successMessage && (
        <div className="company-reg-alert company-reg-alert-success">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleUpdate} className="company-reg-form">
        <div className="company-reg-grid">
          <div className="company-reg-field">
            <label className="company-reg-label" htmlFor="companyFullName">
              COMPANY FULL NAME
            </label>
            <UnderlineInput
              id="companyFullName"
              name="companyFullName"
              value={form.companyFullName}
              onChange={onChange("companyFullName")}
            />
          </div>

          <div className="company-reg-field">
            <label className="company-reg-label" htmlFor="companyShortName">
              COMPANY SHORT NAME
            </label>
            <UnderlineInput
              id="companyShortName"
              name="companyShortName"
              value={form.companyShortName}
              onChange={onChange("companyShortName")}
            />
          </div>

          <div className="company-reg-field">
            <label className="company-reg-label" htmlFor="companyContactNo">
              COMPANY CONTACT NO
            </label>
            <UnderlineInput
              id="companyContactNo"
              name="companyContactNo"
              value={form.companyContactNo}
              onChange={onChange("companyContactNo")}
            />
          </div>

          <div className="company-reg-field company-reg-logo-field">
            <label className="company-reg-label" htmlFor="companyLogo">COMPANY LOGO</label>
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="company-reg-logo-preview"
              />
            ) : (
              <div className="company-reg-logo-placeholder">No logo uploaded</div>
            )}
            <input
              type="file"
              id="companyLogo"
              name="logo"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
              className="company-reg-file-input"
              onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="company-reg-field">
            <label className="company-reg-label" htmlFor="hostName">
              HOST NAME
            </label>
            <UnderlineInput
              id="hostName"
              name="hostName"
              value={form.hostName}
              onChange={onChange("hostName")}
            />
          </div>

          <div className="company-reg-field">
            <label className="company-reg-label" htmlFor="portNo">
              PORT NO
            </label>
            <UnderlineInput
              id="portNo"
              name="portNo"
              type="number"
              value={form.portNo}
              onChange={onChange("portNo")}
            />
          </div>

          <div className="company-reg-field">
            <label className="company-reg-label" htmlFor="userEmailId">
              USER EMAIL ID
            </label>
            <UnderlineInput
              id="userEmailId"
              name="userEmailId"
              type="email"
              value={form.userEmailId}
              onChange={onChange("userEmailId")}
            />
          </div>

          <div className="company-reg-field">
            <label className="company-reg-label" htmlFor="emailPassword">
              EMAIL PASSWORD
            </label>
            <UnderlineInput
              id="emailPassword"
              name="emailPassword"
              type="text"
              value={form.emailPassword}
              onChange={onChange("emailPassword")}
            />
          </div>

          <div className="company-reg-field">
            <label className="company-reg-label" htmlFor="startTime">
              START TIME (e.g. 09:00)
            </label>
            <UnderlineInput
              id="startTime"
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={onChange("startTime")}
            />
          </div>

          <div className="company-reg-field">
            <label className="company-reg-label" htmlFor="endTime">
              END TIME (e.g. 19:00)
            </label>
            <UnderlineInput
              id="endTime"
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={onChange("endTime")}
            />
          </div>
        </div>

        <div className="company-reg-actions">
          <button
            type="submit"
            className="company-reg-btn-update"
            disabled={isSaving}
          >
            {isSaving ? "Updating…" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};
