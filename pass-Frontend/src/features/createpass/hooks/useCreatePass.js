import { useState, useRef } from "react";
import { useLocationUtils } from "@/shared/hooks/useLocation";
import { submitCreatePass, getVisitorByMobile } from "@/masterCalling/createpass/createPassApi";

const INITIAL_FORM_DATA = {
  passDate: new Date().toISOString().split("T")[0],
  mobileNo: "",
  name: "",
  emailId: "",
  companyName: "",
  address: "",
  state: "",
  city: "",
  representingVisitorType: "",
  subLocation: "",
  toMeetWith: "",
  carryWith: [],
  idType: "PASSPORT",
  idNumber: "",
  description: "",
  maskCovid: "",
  temperature: "",
  accompanyingPersonsCount: "",
  persons: [{ name: "", phoneNo: "", aadharNumber: "", token: "", aadharFile: null }],
  visitArea: [],
  purpose: "",
  allowedHours: "",
};

export const useCreatePass = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { states, cities, setSelectedState } = useLocationUtils();
  const cameraInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addPerson = () => {
    setFormData((prev) => {
      const newPersons = [...prev.persons, { name: "", phoneNo: "", aadharNumber: "", token: "", aadharFile: null }];
      return { ...prev, persons: newPersons, accompanyingPersonsCount: newPersons.length };
    });
  };

  const removePerson = (index) => {
    setFormData((prev) => {
      const newPersons = prev.persons.filter((_, i) => i !== index);
      return { ...prev, persons: newPersons, accompanyingPersonsCount: newPersons.length };
    });
  };

  const handlePersonChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedPersons = [...prev.persons];
      updatedPersons[index][field] = value;
      return { ...prev, persons: updatedPersons };
    });
  };

  const handleAccompanyingCountChange = (e) => {
    let value = e.target.value;
    if (value === "") {
      setFormData((prev) => ({ ...prev, accompanyingPersonsCount: "" }));
      return;
    }
    const count = parseInt(value, 10);
    if (isNaN(count) || count < 0) return;
    setFormData((prev) => {
      let newPersons = [...prev.persons];
      if (count > newPersons.length) {
        const diff = count - newPersons.length;
        for (let i = 0; i < diff; i++) {
          newPersons.push({ name: "", phoneNo: "", aadharNumber: "", token: "", aadharFile: null });
        }
      } else if (count < newPersons.length) {
        newPersons = newPersons.slice(0, count);
      }
      return { ...prev, accompanyingPersonsCount: count, persons: newPersons };
    });
  };

  const handleClear = () => {
    setFormData(INITIAL_FORM_DATA);
    cameraInputRef.current?.resetCamera();
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(value);
    setFormData((prev) => ({ ...prev, state: value, city: "" }));
  };

  const handleMobileBlur = async () => {
    const mobileNo = formData.mobileNo;
    if (mobileNo && mobileNo.length === 10) {
      try {
        const res = await getVisitorByMobile(mobileNo);
        if (res?.data?.data) {
          const visitor = res.data.data;
          setFormData(prev => ({
            ...prev,
            name: visitor.name || prev.name,
            emailId: visitor.emailId || prev.emailId,
            companyName: visitor.companyName || prev.companyName,
            address: visitor.address || prev.address,
            state: visitor.state || prev.state,
            city: visitor.city || prev.city,
            representingVisitorType: visitor.representingVisitorType || prev.representingVisitorType,
            idType: visitor.idType || prev.idType,
            idNumber: visitor.idNumber || prev.idNumber,
            subLocation: visitor.subLocation || prev.subLocation,
            toMeetWith: visitor.toMeetWith || prev.toMeetWith,
            carryWith: visitor.carryWith || prev.carryWith,
            visitArea: visitor.visitArea || prev.visitArea,
            purpose: visitor.purpose || prev.purpose,
            allowedHours: visitor.allowedHours || prev.allowedHours,
          }));
          if (visitor.state) setSelectedState(visitor.state);
        }
      } catch (err) {
        console.log("Visitor not found for autofill, treating as new entry");
        setFormData(prev => ({
          ...prev,
          name: "", emailId: "", companyName: "", address: "", state: "", city: "",
          representingVisitorType: "", subLocation: "", toMeetWith: "", carryWith: [],
          idType: "PASSPORT", idNumber: "", description: "", maskCovid: "", temperature: "",
          accompanyingPersonsCount: "",
          persons: [{ name: "", phoneNo: "", aadharNumber: "", token: "", aadharFile: null }],
          visitArea: [], purpose: "", allowedHours: "",
        }));
        setSelectedState("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.emailId && !emailRegex.test(formData.emailId)) {
      alert("Please enter a valid email address.");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.mobileNo)) {
      alert("Please enter a valid 10-digit Indian phone number.");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (formData.passDate < today) {
      alert("Pass date cannot be in the past.");
      return;
    }

    setIsSubmitting(true);
    try {
      const photoBlob = await cameraInputRef.current?.takePhoto();
      if (!photoBlob) {
        alert("Please take a photo before submitting!");
        setIsSubmitting(false);
        return;
      }
      const payload = new FormData();
      const scalarFields = [
        "passDate", "mobileNo", "name", "emailId", "companyName", "address", "state", "city",
        "representingVisitorType", "subLocation", "toMeetWith", "idType", "idNumber",
        "description", "maskCovid", "purpose", "allowedHours", "token", "temperature"
      ];
      scalarFields.forEach((key) => payload.append(key, formData[key]));
      payload.append("carryWith", JSON.stringify(formData.carryWith));
      payload.append("visitArea", JSON.stringify(formData.visitArea));
      const personsMetadata = formData.persons.map(({ ...rest }) => rest);
      payload.append("persons", JSON.stringify(personsMetadata));
      formData.persons.forEach((person, index) => {
        if (person.aadharFile) payload.append(`aadharFile_${index}`, person.aadharFile, person.aadharFile.name);
      });
      payload.append("photo", photoBlob, "visitor-photo.jpg");

      await submitCreatePass(payload, { timeout: 60000 });
      alert("Gate pass created successfully!");
      handleClear();
    } catch (error) {
      console.error("Submission error:", error);
      alert(error?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};
