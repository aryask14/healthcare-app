// Save token to localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('healthcare_token', token);
};

// Get user role from token
export const getUserRole = () => {
  const token = localStorage.getItem('healthcare_token');
  if (!token) return null;
  
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.role; // 'admin', 'doctor', 'patient'
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('healthcare_token');
  return !!token;
};

// Attach token to API requests (Axios)
export const attachTokenToHeaders = () => {
  const token = localStorage.getItem('healthcare_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};