import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CalendarToday,
  LocalHospital,
  AccessTime,
  Cancel,
  Edit
} from '@mui/icons-material';
import { getUpcomingAppointments } from '../../features/appointments/appointmentSlice';
import { format, parseISO } from 'date-fns';

const UpcomingAppointments = () => {
  const dispatch = useDispatch();
  const { 
    upcomingAppointments = [], 
    loading, 
    isError, 
    message 
  } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(getUpcomingAppointments());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {message || 'Failed to load appointments'}
      </Alert>
    );
  }

  if (!upcomingAppointments || upcomingAppointments.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <CalendarToday sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No upcoming appointments
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Book an appointment with one of our doctors
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Doctor</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {upcomingAppointments.map((appt) => (
            <TableRow key={appt._id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={appt.doctor?.avatar} 
                    sx={{ mr: 2 }}
                  >
                    <LocalHospital />
                  </Avatar>
                  <Box>
                    <Typography>Dr. {appt.doctor?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appt.doctor?.specialization}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography>
                    {format(parseISO(appt.date), 'MMM d, yyyy')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <AccessTime sx={{ verticalAlign: 'middle', fontSize: 16 }} />{' '}
                    {appt.time}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography>
                  {appt.reason || 'General Consultation'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={appt.status}
                  color={
                    appt.status === 'confirmed' ? 'success' :
                    appt.status === 'pending' ? 'warning' : 'error'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Edit />}
                  sx={{ mr: 1 }}
                >
                  Reschedule
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UpcomingAppointments;