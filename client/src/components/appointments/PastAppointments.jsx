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
  Person,
  LocalHospital,
  AccessTime,
  Description,
  Star
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { getPastAppointments } from '../../features/appointments/appointmentSlice';

const PastAppointments = () => {
  const dispatch = useDispatch();
  const { 
    pastAppointments, 
    loading: isLoading, 
    isError, 
    message 
  } = useSelector((state) => state.appointments);

  useEffect(() => {
    dispatch(getPastAppointments());
  }, [dispatch]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {message || 'Failed to load past appointments'}
      </Alert>
    );
  }

  if (!pastAppointments || pastAppointments.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <CalendarToday sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No past appointments found
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
          {pastAppointments.map((appt) => (
            <TableRow key={appt._id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={appt.doctor?.avatar} 
                    sx={{ mr: 2 }}
                  >
                    {appt.doctor?.name ? (
                      appt.doctor.name.charAt(0)
                    ) : (
                      <Person />
                    )}
                  </Avatar>
                  <Box>
                    <Typography>Dr. {appt.doctor?.name || 'Unknown'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appt.doctor?.specialization || 'General Practitioner'}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography>
                    {appt.date ? format(parseISO(appt.date), 'MMM d, yyyy') : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <AccessTime sx={{ verticalAlign: 'middle', fontSize: 16 }} />{' '}
                    {appt.time || 'N/A'}
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
                  label={appt.status || 'completed'}
                  color={
                    appt.status === 'completed' ? 'success' : 
                    appt.status === 'cancelled' ? 'error' : 'default'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Description />}
                  sx={{ mr: 1 }}
                >
                  Details
                </Button>
                {appt.status === 'completed' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<Star />}
                  >
                    Rate
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>    
      </Table>
    </TableContainer>
  );
};

export default PastAppointments;