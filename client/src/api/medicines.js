import axios from 'axios';

const API_URL = '/api/medicines';

// Get all medicines
const getMedicines = async (filters = {}) => {
  const response = await axios.get(API_URL, { params: filters });
  return response.data;
};

// Create medicine (Admin/Pharmacist only)
const createMedicine = async (medicineData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, medicineData, config);
  return response.data;
};

// Update medicine stock
const updateMedicineStock = async (medicineId, stockData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/${medicineId}/stock`,
    stockData,
    config
  );
  return response.data;
};

const medicineService = {
  getMedicines,
  createMedicine,
  updateMedicineStock,
};

export default medicineService;