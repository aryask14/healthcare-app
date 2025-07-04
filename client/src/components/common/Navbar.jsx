import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  MedicalServices,
  CalendarToday,
  LocalPharmacy,
  Dashboard
} from '@mui/icons-material';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleMenuClose();
  };

  const navItems = [
    { icon: <MedicalServices />, label: 'Doctors', path: '/doctors', roles: ['patient', 'admin'] },
    { icon: <CalendarToday />, label: 'Appointments', path: '/appointments', roles: ['patient', 'doctor', 'admin'] },
    { icon: <LocalPharmacy />, label: 'Pharmacy', path: '/pharmacy', roles: ['patient', 'pharmacist', 'admin'] },
    { icon: <Dashboard />, label: 'Dashboard', path: '/dashboard', roles: ['doctor', 'admin'] }
  ];

  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'primary.main', boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo/Brand */}
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <MedicalServices sx={{ mr: 1, fontSize: '2rem' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            HealthCare+
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {filteredNavItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{ color: 'primary.main' }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* User Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              <IconButton
                size="large"
                edge="end"
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ ml: 2 }}
              >
                {user.avatar ? (
                  <Avatar src={user.avatar} alt={user.name} />
                ) : (
                  <AccountCircle sx={{ fontSize: '2rem' }} />
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  <AccountCircle sx={{ mr: 1.5 }} /> My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {isMobile ? (
                <IconButton
                  size="large"
                  color="inherit"
                  component={Link}
                  to="/login"
                >
                  <AccountCircle />
                </IconButton>
              ) : (
                <Button
                  variant="outlined"
                  component={Link}
                  to="/login"
                  sx={{ ml: 2 }}
                >
                  Login
                </Button>
              )}
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;