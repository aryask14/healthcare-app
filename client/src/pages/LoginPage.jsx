import React from 'react';
import { 
  Box, 
  Typography, 
  Link, 
  Container,
  useTheme
} from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
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
          Sign In to Your Account
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Access your medical records, appointments, and prescriptions
        </Typography>
        
        <LoginForm />
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link href="#" variant="body2" sx={{ display: 'block', mb: 1 }}>
            Forgot password?
          </Link>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;