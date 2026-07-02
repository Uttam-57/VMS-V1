import { State, City } from "country-state-city";
// India's ISO code is 'IN'
const INDIA_ISO_CODE = "IN";
export const LocationService = {
  // Get all states of India
  getIndiaStates: () => {
    return State.getStatesOfCountry(INDIA_ISO_CODE);
  },
  // Get cities of a specific state in India
  getCitiesOfIndiaState: (stateCode) => {
    return City.getCitiesOfState(INDIA_ISO_CODE, stateCode);
  },
};
