import axios from 'axios';

const API_URL = '/api/appointments';

// Create appointment
const createAppointment = async (appointmentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, appointmentData, config);
  return response.data;
};

// Get user appointments
const getAppointments = async (token, filters = {}) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: filters,
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Update appointment status
const updateAppointmentStatus = async (appointmentId, status, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}/${appointmentId}/status`,
    { status },
    config
  );
  return response.data;
};

const appointmentService = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
};


export default appointmentService;