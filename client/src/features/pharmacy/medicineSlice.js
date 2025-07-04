import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/medicineApi';

export const fetchMedicines = createAsyncThunk(
  'medicines/fetchMedicines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getMedicines();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  medicines: [],
  status: 'idle',
  error: null
};

const medicineSlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.medicines = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch medicines';
      });
  }
});

export default medicineSlice.reducer;
