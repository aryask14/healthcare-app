import React from 'react';
import { 
  Box, 
  Typography, 
  Link, 
  Container,
  useTheme
} from '@mui/material';
import RegisterForm from '../components/auth/RegisterForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8,
        p: 4,
        borderRadius: 2,
        boxShadow: theme.shadows[3],
        backgroundColor: theme.palette.background.paper
      }}>
        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
          Create Your Account
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Join our healthcare platform to manage your medical needs
        </Typography>
        
        <RegisterForm />
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;