/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { LocationService } from "@/shared/utils/location.utill";
export const useLocationUtils = () => {
  const [states] = useState(LocationService.getIndiaStates());
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  // Automatically update cities whenever the state selection changes
  useEffect(() => {
    if (selectedState) {
      setCities(LocationService.getCitiesOfIndiaState(selectedState));
    } else {
      setCities([]);
    }
  }, [selectedState]);
  return {
    states,
    cities,
    selectedState,
    setSelectedState, // Call this from your component's onChange
  };
};
