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
  LocalPharmacy,
  Search,
  FilterList,
  MedicalServices
} from '@mui/icons-material';
import MedicineList from '../components/pharmacy/MedicineList';

const PharmacyPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const categories = [
    'Pain Relief',
    'Antibiotics',
    'Vitamins',
    'Allergy',
    'Digestive Health',
    'Diabetes'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          <LocalPharmacy sx={{ verticalAlign: 'middle', mr: 1 }} />
          Pharmacy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Order prescription and over-the-counter medications
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
          placeholder="Search medications"
          InputProps={{
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Category"
          variant="outlined"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: <FilterList sx={{ color: 'action.active', mr: 1 }} />
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Medicine List */}
      <MedicineList 
        searchTerm={searchTerm}
        category={category}
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

export default PharmacyPage;