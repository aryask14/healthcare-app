// client/src/api/medicineApi.js

import axios from 'axios';

const API_URL = '/api/medicines';

const getMedicines = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createMedicine = async (medicineData) => {
  const response = await axios.post(API_URL, medicineData);
  return response.data;
};

// Remove any mongoose-related code
export default {
  getMedicines,
  createMedicine
  // Add other medicine-related API calls
};