import React from "react";
import { Button } from "@/shared/ui/atoms/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/molecules/Card";
import { CameraInput } from "@/shared/ui/molecules/CameraInput";
import { FormField } from "@/shared/ui/molecules/FormField";
import { Input } from "@/shared/ui/atoms/Input";

import { useEmployees } from "@/features/mastersetting/hooks/useEmployee";
import { usePurpose } from "@/features/mastersetting/hooks/usePurpose";
import { useCarryWith } from "@/features/mastersetting/hooks/useCarryWith";
import { useVisitorArea } from "@/features/mastersetting/hooks/useVisitorArea";
import { useVisitorType } from "@/features/mastersetting/hooks/useVisitorType";
import { useLocation } from "@/features/mastersetting/hooks/useLocation";
import { useIdType } from "@/features/mastersetting/hooks/useIdType";

import { PersonalInfoSection } from "@/features/createpass/components/PersonalInfoSection";
import { VisitDetailsSection } from "@/features/createpass/components/VisitDetailsSection";
import { AccompanyingPersonsSection } from "@/features/createpass/components/AccompanyingPersonsSection";
import { VisitAreaSection } from "@/features/createpass/components/VisitAreaSection";
import { PurposeSection } from "@/features/createpass/components/PurposeSection";
import { useCreatePass } from "@/features/createpass/hooks/useCreatePass";

const CreatePassPage = () => {
  const {
    formData,
    setFormData,
    isSubmitting,
    states,
    cities,
    cameraInputRef,
    handleInputChange,
    addPerson,
    removePerson,
    handlePersonChange,
    handleAccompanyingCountChange,
    handleClear,
    handleStateChange,
    handleMobileBlur,
    handleSubmit,
  } = useCreatePass();

  const { employees } = useEmployees();
  const { carryWith } = useCarryWith();
  const { purposes } = usePurpose();
  const { visitorArea } = useVisitorArea();
  const { visitorType } = useVisitorType();
  const { location } = useLocation();
  const { idType } = useIdType();

  return (
    <div className="page-container">
      <Card className="page-card">
        <CardHeader>
          <CardTitle>Create Gate Pass</CardTitle>
        </CardHeader>
        <CardContent className="page-card-content">
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-section">
              <h3 className="form-section-title">Pass Information</h3>
              <div className="form-grid-2 gap-6">
                <FormField label="Pass Date" htmlFor="passDate">
                  <Input type="date" id="passDate" name="passDate" value={formData.passDate} onChange={handleInputChange}
                    onClick={(e) => { try { if (e.target.showPicker) e.target.showPicker(); } catch (err) { console.error(err); } }}
                    min={new Date().toISOString().split("T")[0]} required style={{ cursor: "pointer" }} />
                </FormField>
              </div>
            </div>

            <PersonalInfoSection formData={formData} handleInputChange={handleInputChange} handleStateChange={handleStateChange} handleMobileBlur={handleMobileBlur} states={states} cities={cities} />
            <VisitDetailsSection formData={formData} handleInputChange={handleInputChange} visitorType={visitorType} location={location} employees={employees} carryWith={carryWith} idType={idType} setFormData={setFormData} />
            <AccompanyingPersonsSection formData={formData} handlePersonChange={handlePersonChange} handleAccompanyingCountChange={handleAccompanyingCountChange} removePerson={removePerson} addPerson={addPerson} />
            <VisitAreaSection formData={formData} visitorArea={visitorArea} setFormData={setFormData} />
            <PurposeSection formData={formData} handleInputChange={handleInputChange} purposes={purposes} />

            <div className="form-section">
              <h3 className="form-section-title-mb">Additional Details</h3>
              <div className="form-grid-2 gap-6">
                <FormField label="Token" htmlFor="token">
                  <Input type="text" id="token" name="token" value={formData.token} onChange={handleInputChange} placeholder="Enter Token" />
                </FormField>
                <FormField label="Temperature" htmlFor="temperature">
                  <Input type="text" id="temperature" name="temperature" value={formData.temperature} onChange={handleInputChange} placeholder="Enter Temperature" />
                </FormField>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title-mb">Visitor Photo</h3>
              <CameraInput ref={cameraInputRef} width="400px" height="300px" onCapture={() => {}} />
            </div>

            <div className="form-actions">
              <Button type="submit" disabled={isSubmitting} className="btn btn-primary px-8 py-2">
                {isSubmitting ? "Submitting…" : "Submit"}
              </Button>
              <Button type="button" onClick={handleClear} className="btn btn-secondary px-8 py-2">Clear</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePassPage;
