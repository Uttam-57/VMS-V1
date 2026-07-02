
import { FormField } from "@/shared/ui/molecules/FormField";
import { Input } from "@/shared/ui/atoms/Input";

export const PurposeSection = ({ formData, handleInputChange, purposes }) => {
  return (
    <>
      <div className="form-grid-2 gap-6">
        <FormField label="Description" htmlFor="description">
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter description"
            className="form-textarea"
            rows={3}
          />
        </FormField>

        <div className="space-y-4">
          <FormField label="Mask/Covid Certificate" htmlFor="maskCovid-yes">
            <div className="form-radio-group-compact">
              {["yes", "no"].map((val) => (
                <label key={val} className="form-radio-label" htmlFor={`maskCovid-${val}`}>
                  <input
                    type="radio"
                    id={`maskCovid-${val}`}
                    name="maskCovid"
                    value={val}
                    checked={formData.maskCovid === val}
                    onChange={handleInputChange}
                    className="form-radio-input"
                  />
                  <span className="form-radio-text-sm">{val}</span>
                </label>
              ))}
            </div>
          </FormField>
        </div>
      </div>

      <div className="form-section form-grid-2 gap-6">
        <FormField label="Purpose" htmlFor="purpose">
          <select
            name="purpose"
            id="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select</option>
            {purposes.map((e, index) => (
              <option key={e._id || index} value={e._id}>
                {e.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Allowed Hours" htmlFor="allowedHours">
          <Input
            name="allowedHours"
            id="allowedHours"
            value={formData.allowedHours}
            onChange={handleInputChange}
          />
        </FormField>
      </div>
    </>
  );
};
