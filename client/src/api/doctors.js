import axios from 'axios';

const API_URL = '/api/doctors';

// Get all doctors
const getDoctors = async (specialization = '') => {
  const params = specialization ? { specialization } : {};
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Get doctor availability
const getDoctorAvailability = async (doctorId) => {
  const response = await axios.get(`${API_URL}/${doctorId}/availability`);
  return response.data;
};

// Create doctor (Admin only)
const createDoctor = async (doctorData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, doctorData, config);
  return response.data;
};

const doctorService = {
  getDoctors,
  getDoctorAvailability,
  createDoctor,
};

export default doctorService;