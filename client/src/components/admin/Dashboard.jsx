import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  People,
  CalendarToday,
  LocalHospital,
  Medication,
  BarChart,
  Warning
} from '@mui/icons-material';
import { 
  fetchDashboardStats,
  fetchRecentAppointments
} from '../../features/admin/adminSlice';
import StatCard from '../../components/admin/StatCard';
import AppointmentsTable from '../../components/admin/AppointmentsTable';

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const {
    stats,
    recentAppointments,
    isLoading,
    error
  } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentAppointments());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Warning color="error" sx={{ fontSize: 60 }} />
        <Typography variant="h6" color="error" mt={2}>
          Failed to load dashboard data
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<People fontSize="large" />}
            title="Total Users"
            value={stats?.totalUsers || 0}
            trend={stats?.userGrowth || 0}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalHospital fontSize="large" />}
            title="Active Doctors"
            value={stats?.activeDoctors || 0}
            trend={stats?.doctorGrowth || 0}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CalendarToday fontSize="large" />}
            title="Today's Appointments"
            value={stats?.todaysAppointments || 0}
            trend={stats?.appointmentChange || 0}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<Medication fontSize="large" />}
            title="Pharmacy Orders"
            value={stats?.pharmacyOrders || 0}
            trend={stats?.orderGrowth || 0}
            color={theme.palette.secondary.main}
          />
        </Grid>
      </Grid>

      {/* Recent Appointments */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          <CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />
          Recent Appointments
        </Typography>
        <AppointmentsTable appointments={recentAppointments} />
      </Paper>

      {/* Analytics Placeholder */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          <BarChart sx={{ verticalAlign: 'middle', mr: 1 }} />
          Monthly Analytics
        </Typography>
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">
            Analytics chart will be displayed here
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;