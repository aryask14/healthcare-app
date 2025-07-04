import api from '../../api/authApi';

const register = async (userData) => {
  const response = await api.register(userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.login(credentials);
  return response.data;
};

const logout = async () => {
  return await api.logout();
};

const forgotPassword = async (email) => {
  const response = await api.forgotPassword(email);
  return response.data;
};

const resetPassword = async (data) => {
  const response = await api.resetPassword(data);
  return response.data;
};

export default {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword
};