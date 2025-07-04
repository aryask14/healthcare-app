import axios from 'axios';

const API_URL = '/api/admin';

// Get dashboard statistics
const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard`);
  return response.data;
};

// Get paginated users
const getUsers = async (page, limit, search = '') => {
  const params = { page, limit, search };
  const response = await axios.get(`${API_URL}/users`, { params });
  return response.data;
};

// Update user role
const updateUserRole = async (userId, role) => {
  const response = await axios.put(`${API_URL}/users/${userId}/role`, { role });
  return response.data;
};

export default {
  getDashboardStats,
  getUsers,
  updateUserRole
};