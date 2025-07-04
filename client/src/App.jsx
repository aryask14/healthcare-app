import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Box } from '@mui/material';
import { store } from './store';
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
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}>
          <Navbar />
          
          <Box component="main" sx={{ 
            flexGrow: 1,
            py: 3,
            px: { xs: 2, sm: 3 }
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/pharmacy" element={<PharmacyPage />} />
              
              {/* Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </Provider>
  );
}

export default App;