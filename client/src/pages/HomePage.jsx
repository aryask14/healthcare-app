import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid,
  Paper,
  useTheme
} from '@mui/material';
import {
  MedicalServices,
  CalendarToday,
  LocalPharmacy,
  People
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <MedicalServices fontSize="large" color="primary" />,
      title: "Find Doctors",
      description: "Book appointments with specialized healthcare professionals",
      action: () => navigate('/doctors')
    },
    {
      icon: <CalendarToday fontSize="large" color="primary" />,
      title: "Manage Appointments",
      description: "View and manage your upcoming medical appointments",
      action: () => navigate('/appointments')
    },
    {
      icon: <LocalPharmacy fontSize="large" color="primary" />,
      title: "Pharmacy",
      description: "Order medications and healthcare products online",
      action: () => navigate('/pharmacy')
    },
    {
      icon: <People fontSize="large" color="primary" />,
      title: "Health Records",
      description: "Access your medical history and test results",
      action: () => navigate('/records')
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ 
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        py: 10,
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Your Health, Our Priority
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Comprehensive healthcare solutions at your fingertips
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/doctors')}
          >
            Find a Doctor
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease'
                  }
                }}
                onClick={feature.action}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;