import axios from 'axios';

const API_URL = '/api/doctors';

// Get all doctors
const getDoctors = async (filters) => {
  const params = {
    specialization: filters.specialization,
    search: filters.search,
    page: filters.page,
    limit: filters.limit
  };

  const response = await axios.get(API_URL, { params });
  return response.data;
};

export default {
    getDoctors
};