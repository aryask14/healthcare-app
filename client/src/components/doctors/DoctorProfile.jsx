import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorById } from '../../features/doctors/doctorSlice';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  MedicalServices,
  LocationOn,
  Work,
  Star,
  Schedule,
  Phone,
  Email,
  Person,
  CalendarToday,
  AccessTime,
  Payment,
  Close
} from '@mui/icons-material';
import AppointmentForm from '../appointments/AppointmentForm';

const DoctorProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctor, isLoading, isError, message } = useSelector((state) => state.doctors);
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getDoctorById(id));
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleBookAppointment = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>
          {message || 'Failed to load doctor profile'}
        </Alert>
      </Box>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Doctor Header Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              src={doctor.photo}
              alt={doctor.name}
              sx={{ width: 200, height: 200 }}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h3" gutterBottom>
              Dr. {doctor.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {doctor.specialization}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={4.8}
                precision={0.1}
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography variant="body1">
                4.8 (120 reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip
                icon={<Work />}
                label={`${doctor.experience || 10}+ years experience`}
                variant="outlined"
              />
              <Chip
                icon={<Payment />}
                label={`₹${doctor.consultationFee || 500} consultation fee`}
                variant="outlined"
              />
              <Chip
                icon={doctor.available ? <Schedule color="success" /> : <Close color="error" />}
                label={doctor.available ? 'Available Today' : 'Not Available'}
                color={doctor.available ? 'success' : 'error'}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<CalendarToday />}
              onClick={handleBookAppointment}
              sx={{ mt: 2 }}
            >
              Book Appointment
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Overview" />
              <Tab label="Specializations" />
              <Tab label="Reviews" />
            </Tabs>

            {tabValue === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  About Dr. {doctor.name}
                </Typography>
                <Typography paragraph>
                  {doctor.bio || 'Dr. ' + doctor.name + ' is a highly experienced ' + 
                  doctor.specialization + ' with over ' + (doctor.experience || 10) + 
                  ' years of practice. Specializing in advanced treatments and patient care.'}
                </Typography>

                <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                  Education & Qualifications
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <MedicalServices />
                    </ListItemIcon>
                    <ListItemText
                      primary="MD in Cardiology"
                      secondary="Harvard Medical School, 2010"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MedicalServices />
                    </ListItemIcon>
                    <ListItemText
                      primary="Board Certified"
                      secondary="American Board of Internal Medicine"
                    />
                  </ListItem>
                </List>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Specializations & Services
                </Typography>
                <Grid container spacing={2}>
                  {[
                    'Cardiac Procedures',
                    'Preventive Cardiology',
                    'Heart Failure Management',
                    'Hypertension Treatment',
                    'Cholesterol Management'
                  ].map((service, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1">{service}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Patient Reviews
                </Typography>
                {[1, 2, 3].map((review) => (
                  <Box key={review} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1">Patient {review}</Typography>
                        <Rating value={5} readOnly size="small" />
                      </Box>
                    </Box>
                    <Typography variant="body1">
                      "Dr. {doctor.name} was very professional and took time to explain everything clearly. 
                      The treatment was effective and I'm feeling much better now."
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted 2 months ago
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Contact Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocationOn color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Clinic Address"
                  secondary={doctor.address || "123 Medical Center Drive, Suite 456, City"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary={doctor.phone || "+1 (555) 123-4567"}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Email color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={doctor.email || "contact@dr" + doctor.name.toLowerCase().replace(/\s/g, '') + ".com"}
                />
              </ListItem>
            </List>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Availability
            </Typography>
            <List>
              {[
                { day: 'Monday', time: '9:00 AM - 5:00 PM' },
                { day: 'Wednesday', time: '10:00 AM - 6:00 PM' },
                { day: 'Friday', time: '8:00 AM - 4:00 PM' }
              ].map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <AccessTime color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.day}
                    secondary={item.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Appointment Booking Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Book Appointment with Dr. {doctor.name}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <AppointmentForm doctorId={id} onSuccess={handleCloseModal} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorProfile;