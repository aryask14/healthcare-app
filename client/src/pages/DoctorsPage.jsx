import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  MenuItem,
  Grid,
  Pagination,
  useTheme
} from '@mui/material';
import {
  MedicalServices,
  Search,
  FilterList
} from '@mui/icons-material';
import DoctorList from '../components/doctors/DoctorList';

const DoctorsPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [page, setPage] = useState(1);

  const specializations = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'General Medicine',
    'Orthopedics'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          <MedicalServices sx={{ verticalAlign: 'middle', mr: 1 }} />
          Our Medical Specialists
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Book appointments with qualified healthcare professionals
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search doctors by name or specialty"
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Specialization"
          variant="outlined"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: <FilterList sx={{ color: 'action.active', mr: 1 }} />
          }}
        >
          <MenuItem value="">All Specialties</MenuItem>
          {specializations.map((spec) => (
            <MenuItem key={spec} value={spec}>
              {spec}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Doctor List */}
      <DoctorList 
        searchTerm={searchTerm}
        specialization={specialization}
        page={page}
      />

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={10}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default DoctorsPage;