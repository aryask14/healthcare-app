import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDoctors } from '../../features/doctors/doctorSlice';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  Chip,
  Avatar
} from '@mui/material';
import {
  MedicalServices,
  LocationOn,
  Work,
  Star,
  Search,
  FilterAlt
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors, isLoading, isError, message } = useSelector((state) => state.doctors);
  const [filters, setFilters] = useState({
    specialization: '',
    search: '',
    page: 1,
    limit: 6
  });

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'General'
  ];

  useEffect(() => {
    dispatch(getDoctors(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handlePageChange = (event, value) => {
    setFilters({ ...filters, page: value });
  };

  const handleBookAppointment = (doctorId) => {
    navigate(`/doctors/${doctorId}/book`);
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
        <Typography color="error" variant="h6">
          {message || 'Failed to load doctors'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Find Your Doctor
      </Typography>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <TextField
          name="search"
          variant="outlined"
          placeholder="Search doctors..."
          size="small"
          value={filters.search}
          onChange={handleFilterChange}
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
          }}
          sx={{ minWidth: 250 }}
        />

        <TextField
          select
          name="specialization"
          variant="outlined"
          label="Specialization"
          size="small"
          value={filters.specialization}
          onChange={handleFilterChange}
          InputProps={{
            startAdornment: <FilterAlt sx={{ color: 'action.active', mr: 1 }} />
          }}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Specializations</MenuItem>
          {specializations.map((spec) => (
            <MenuItem key={spec} value={spec}>
              {spec}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Doctors Grid */}
      {doctors?.data?.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {doctors.data.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    sx={{ height: 200 }}
                    image={doctor.photo || '/default-doctor.jpg'}
                    title={doctor.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Dr. {doctor.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Work color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        {doctor.specialization}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" color="text.secondary">
                        {doctor.hospital || 'City Hospital'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Star color="warning" sx={{ mr: 1 }} />
                      <Typography variant="body1">
                        4.8 (120 reviews)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip
                        avatar={<Avatar>₹</Avatar>}
                        label={`${doctor.consultationFee || 500} per visit`}
                        variant="outlined"
                      />
                      <Chip
                        label={doctor.available ? 'Available Today' : 'Not Available'}
                        color={doctor.available ? 'success' : 'error'}
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<MedicalServices />}
                      onClick={() => handleBookAppointment(doctor._id)}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {doctors.pagination && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(doctors.pagination.total / filters.limit)}
                page={filters.page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </>
      ) : (
        <Box textAlign="center" mt={4}>
          <MedicalServices sx={{ fontSize: 60, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            No doctors found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DoctorList;