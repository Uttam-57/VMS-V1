
import { Checkbox } from "@/shared/ui/atoms/Checkbox";

export const VisitAreaSection = ({ formData, visitorArea, setFormData }) => {
  return (
    <div className="form-section">
      <h3 className="form-section-title-mb">Visit Area</h3>
      <div className="grid grid-cols-3 gap-4">
        {visitorArea.map((v) => {
          const checkboxId = `visitArea-${(v._id || v.name).replace(/\s+/g, "-")}`;
          return (
            <label key={v._id || v.name} className="form-radio-label" htmlFor={checkboxId}>
              <Checkbox
                id={checkboxId}
                name="visitArea"
                checked={formData.visitArea.includes(v.name)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visitArea: e.target.checked
                      ? [...prev.visitArea, v.name]
                      : prev.visitArea.filter((item) => item !== v.name),
                  }))
                }
                value={v.name}
              />
              <span className="form-radio-text-sm">{v.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
