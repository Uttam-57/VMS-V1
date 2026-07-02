export const PassDetailSection = ({
  isEditable,
  passData,
  handleFieldChange,
  employees,
  states,
  cities,
  setSelectedState,
  setPassData,
}) => {
  const LabelEl = isEditable ? "label" : "span";
  const inputClass = "w-full h-10 border border-slate-300 rounded-lg px-3.5 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all";
  const valueClass = "px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700";
  const labelClass = "block text-xs font-semibold text-slate-400 mb-1.5";

  return (
    <div className="flex flex-col gap-7">
      {/* Personal Section */}
      <div>
        <h3 className="m-0 mb-4 text-slate-800 font-bold text-base border-b border-slate-100 pb-2">
          Personal Details
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <LabelEl
              htmlFor={isEditable ? "visitor-name-input" : undefined}
              className={labelClass}
            >
              Visitor Name
            </LabelEl>
            {isEditable ? (
              <input
                type="text"
                id="visitor-name-input"
                name="name"
                value={passData.name || ""}
                onChange={handleFieldChange}
                className={inputClass}
              />
            ) : (
              <div className={valueClass}>{passData.name || "-"}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelEl
                htmlFor={isEditable ? "mobile-no-input" : undefined}
                className={labelClass}
              >
                Mobile No
              </LabelEl>
              {isEditable ? (
                <input
                  type="text"
                  id="mobile-no-input"
                  name="mobileNo"
                  value={passData.mobileNo || ""}
                  onChange={handleFieldChange}
                  className={inputClass}
                />
              ) : (
                <div className={valueClass}>{passData.mobileNo || "-"}</div>
              )}
            </div>
            <div>
              <LabelEl
                htmlFor={isEditable ? "email-id-input" : undefined}
                className={labelClass}
              >
                Email Address
              </LabelEl>
              {isEditable ? (
                <input
                  type="email"
                  id="email-id-input"
                  name="emailId"
                  value={passData.emailId || ""}
                  onChange={handleFieldChange}
                  className={inputClass}
                />
              ) : (
                <div className={valueClass}>{passData.emailId || "-"}</div>
              )}
            </div>
          </div>

          <div>
            <LabelEl
              htmlFor={isEditable ? "company-name-input" : undefined}
              className={labelClass}
            >
              Company Name
            </LabelEl>
            {isEditable ? (
              <input
                type="text"
                id="company-name-input"
                name="companyName"
                value={passData.companyName || ""}
                onChange={handleFieldChange}
                className={inputClass}
              />
            ) : (
              <div className={valueClass}>{passData.companyName || "-"}</div>
            )}
          </div>

          <div>
            <LabelEl
              htmlFor={isEditable ? "address-textarea" : undefined}
              className={labelClass}
            >
              Address
            </LabelEl>
            {isEditable ? (
              <textarea
                id="address-textarea"
                name="address"
                value={passData.address || ""}
                onChange={handleFieldChange}
                className={`${inputClass} h-16 resize-y py-2`}
              />
            ) : (
              <div className={`${valueClass} whitespace-pre-wrap`}>
                {passData.address || "-"}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelEl
                htmlFor={isEditable ? "state-select" : undefined}
                className={labelClass}
              >
                State
              </LabelEl>
              {isEditable ? (
                <select
                  id="state-select"
                  name="state"
                  value={passData.state || ""}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setPassData((prev) => ({ ...prev, state: e.target.value, city: "" }));
                  }}
                  className={inputClass}
                >
                  <option value="">Select State</option>
                  {states.map((s, idx) => (
                    <option key={idx} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className={valueClass}>{passData.state || "-"}</div>
              )}
            </div>
            <div>
              <LabelEl
                htmlFor={isEditable ? "city-select" : undefined}
                className={labelClass}
              >
                City
              </LabelEl>
              {isEditable ? (
                <select
                  id="city-select"
                  name="city"
                  value={passData.city || ""}
                  onChange={handleFieldChange}
                  disabled={!passData.state}
                  className={inputClass}
                >
                  <option value="">Select City</option>
                  {cities.map((c, idx) => (
                    <option key={idx} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className={valueClass}>{passData.city || "-"}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visit Information Section */}
      <div>
        <h3 className="m-0 mb-4 text-slate-800 font-bold text-base border-b border-slate-100 pb-2">
          Visit Details
        </h3>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelEl
                htmlFor={isEditable ? "visitor-type-input" : undefined}
                className={labelClass}
              >
                Visitor Type
              </LabelEl>
              {isEditable ? (
                <input
                  type="text"
                  id="visitor-type-input"
                  name="representingVisitorType"
                  value={passData.representingVisitorType || ""}
                  onChange={handleFieldChange}
                  className={inputClass}
                />
              ) : (
                <div className={valueClass}>{passData.representingVisitorType || "-"}</div>
              )}
            </div>
            <div>
              <LabelEl
                htmlFor={isEditable ? "meet-employee-select" : undefined}
                className={labelClass}
              >
                To Meet Employee
              </LabelEl>
              {isEditable ? (
                <select
                  id="meet-employee-select"
                  name="toMeetWith"
                  value={passData.toMeetWith || ""}
                  onChange={handleFieldChange}
                  className={inputClass}
                >
                  <option value="">Select Employee</option>
                  {employees.map((e, idx) => (
                    <option key={idx} value={e._id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className={valueClass}>
                  {employees.find((e) => e._id === passData.toMeetWith)?.name ||
                    passData.toMeetWith ||
                    "-"}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelEl
                htmlFor={isEditable ? "sub-location-input" : undefined}
                className={labelClass}
              >
                Sub Location
              </LabelEl>
              {isEditable ? (
                <input
                  type="text"
                  id="sub-location-input"
                  name="subLocation"
                  value={passData.subLocation || ""}
                  onChange={handleFieldChange}
                  className={inputClass}
                />
              ) : (
                <div className={valueClass}>{passData.subLocation || "-"}</div>
              )}
            </div>
            <div>
              <LabelEl
                htmlFor={isEditable ? "allowed-hours-input" : undefined}
                className={labelClass}
              >
                Allowed Hours
              </LabelEl>
              {isEditable ? (
                <input
                  type="text"
                  id="allowed-hours-input"
                  name="allowedHours"
                  value={passData.allowedHours || ""}
                  onChange={handleFieldChange}
                  className={inputClass}
                />
              ) : (
                <div className={valueClass}>
                  {passData.allowedHours ? `${passData.allowedHours} hrs` : "-"}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className={labelClass}>
                ID Type
              </span>
              <div className={valueClass}>{passData.idType || "-"}</div>
            </div>
            <div>
              <span className={labelClass}>
                ID Number
              </span>
              <div className={valueClass}>{passData.idNumber || "-"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <LabelEl
                htmlFor={isEditable ? "token-input" : undefined}
                className={labelClass}
              >
                Token
              </LabelEl>
              {isEditable ? (
                <input
                  type="text"
                  id="token-input"
                  name="token"
                  value={passData.token || ""}
                  onChange={handleFieldChange}
                  className={inputClass}
                />
              ) : (
                <div className={valueClass}>{passData.token || "-"}</div>
              )}
            </div>
            <div>
              <LabelEl
                htmlFor={isEditable ? "temperature-input" : undefined}
                className={labelClass}
              >
                Temperature
              </LabelEl>
              {isEditable ? (
                <input
                  type="text"
                  id="temperature-input"
                  name="temperature"
                  value={passData.temperature || ""}
                  onChange={handleFieldChange}
                  className={inputClass}
                />
              ) : (
                <div className={valueClass}>{passData.temperature || "-"}</div>
              )}
            </div>
          </div>

          <div>
            <LabelEl
              htmlFor={isEditable ? "purpose-input" : undefined}
              className={labelClass}
            >
              Purpose
            </LabelEl>
            {isEditable ? (
              <input
                type="text"
                id="purpose-input"
                name="purpose"
                value={passData.purpose || ""}
                onChange={handleFieldChange}
                className={inputClass}
              />
            ) : (
              <div className={valueClass}>{passData.purpose || "-"}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
