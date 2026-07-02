
import { FormField } from "@/shared/ui/molecules/FormField";
import { Input } from "@/shared/ui/atoms/Input";

export const PersonalInfoSection = ({
  formData,
  handleInputChange,
  handleStateChange,
  handleMobileBlur,
  states,
  cities,
}) => {
  return (
    <div className="form-section">
      <h3 className="form-section-title">Personal Information</h3>
      <div className="form-grid-2 gap-6">
        <FormField label="Name" htmlFor="name">
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            autoComplete="name"
            placeholder="Enter name"
          />
        </FormField>
        <FormField label="Mobile No" htmlFor="mobileNo">
          <Input
            type="tel"
            id="mobileNo"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleInputChange}
            onBlur={handleMobileBlur}
            placeholder="Enter mobile number"
          />
        </FormField>
        <FormField label="Email-Id" htmlFor="Email-Id">
          <Input
            type="email"
            id="Email-Id"
            name="emailId"
            value={formData.emailId}
            onChange={handleInputChange}
            placeholder="Enter email"
          />
        </FormField>
        <FormField label="Address" htmlFor="address">
          <textarea
            name="address"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter address"
            autoComplete="address"
            className="form-textarea"
            rows={3}
          />
        </FormField>
      </div>

      <div className="form-grid-2 gap-6">
        <FormField label="Company Name" htmlFor="CompanyName">
          <Input
            type="text"
            id="CompanyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Enter company name"
          />
        </FormField>
      </div>

      <div className="form-grid-2 gap-6">
        <FormField label="State" htmlFor="state">
          <select
            name="state"
            id="state"
            value={formData.state}
            onChange={handleStateChange}
            className="form-select"
          >
            <option value="">Select State</option>
            {states.map((s, index) => (
              <option key={s.isoCode || index} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="City" htmlFor="city">
          <select
            name="city"
            id="city"
            value={formData.city}
            disabled={!formData.state}
            onChange={handleInputChange}
            className={formData.state ? "form-select" : "form-select-disabled"}
          >
            <option value="">Select City</option>
            {cities.map((c, index) => (
              <option key={c.name || index} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </div>
  );
};
