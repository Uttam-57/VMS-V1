
import { FormField } from "@/shared/ui/molecules/FormField";
import { Input } from "@/shared/ui/atoms/Input";
import { Checkbox } from "@/shared/ui/atoms/Checkbox";
import { SearchableSelect } from "@/shared/ui/molecules/SearchableSelect";

export const VisitDetailsSection = ({
  formData,
  handleInputChange,
  visitorType,
  location,
  employees,
  carryWith,
  idType,
  setFormData,
}) => {
  return (
    <>
      <div className="form-grid-2 gap-6">
        <FormField label="Representing Visitor Type" htmlFor="representingVisitorType">
          <select
            name="representingVisitorType"
            id="representingVisitorType"
            value={formData.representingVisitorType}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select Visitor Type</option>
            {visitorType.map((v, index) => (
              <option key={v._id || v.name || index} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Sub Location" htmlFor="subLocation">
          <select
            name="subLocation"
            id="subLocation"
            value={formData.subLocation}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select Location</option>
            {location.map((v, index) => (
              <option key={v._id || v.name || index} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="form-grid-2 gap-6">
        <FormField label="To Meet with Employee" htmlFor="toMeetWith">
          <SearchableSelect
            name="toMeetWith"
            id="toMeetWith"
            value={formData.toMeetWith}
            onChange={handleInputChange}
            options={employees.map((e) => ({
              value: e._id || e.id,
              label: `${e.name} - ${e.employeeId || e.empId || ""}`,
              searchTerms: `${e.name} ${e.employeeId || e.empId || ""}`.toLowerCase(),
            }))}
            placeholder="Select Employee"
          />
        </FormField>

        <FormField label="Carry With">
          <div className="form-radio-group-compact">
            {carryWith.map((c) => {
              const checkboxId = `carryWith-${(c._id || c.name).replace(/\s+/g, "-")}`;
              return (
                <label key={c._id || c.name} className="form-radio-label" htmlFor={checkboxId}>
                  <Checkbox
                    id={checkboxId}
                    name="carryWith"
                    value={c.name}
                    checked={formData.carryWith.includes(c.name)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        carryWith: e.target.checked
                          ? [...prev.carryWith, c.name]
                          : prev.carryWith.filter((item) => item !== c.name),
                      }))
                    }
                  />
                  <span className="form-radio-text-sm">{c.name}</span>
                </label>
              );
            })}
          </div>
        </FormField>
      </div>

      <div className="form-section form-grid-2 gap-6">
        <FormField label="ID Type" htmlFor="idType">
          <select
            name="idType"
            id="idType"
            value={formData.idType}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Select ID Type</option>
            {idType.map((v, index) => (
              <option key={v._id || v.name || index} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Id Number" htmlFor="idNumber">
          <Input
            type="text"
            name="idNumber"
            id="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            placeholder="Enter ID number"
          />
        </FormField>
      </div>
    </>
  );
};
