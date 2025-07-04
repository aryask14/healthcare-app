import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Box } from '@mui/material';
import store from './store';
import './App.css';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './routes/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PharmacyPage from './pages/PharmacyPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh' 
        }}>
          {/* Header/Navbar */}
          <Navbar />
          
          {/* Main Content Area */}
          <Box component="main" sx={{ 
            flexGrow: 1,
            py: 3, // Add padding top and bottom
            px: { xs: 2, sm: 3 } // Responsive padding
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/pharmacy" element={<PharmacyPage />} />
              <Route 
                path="/appointments" 
                element={
                  <PrivateRoute>
                    <AppointmentsPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </Box>
          
          {/* Footer */}
          <Footer />
        </Box>
      </Router>
    </Provider>
  );
}

export default App;