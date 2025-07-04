import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/doctorApi';

export const getDoctors = createAsyncThunk(
  'doctors/getDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getDoctors();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch doctors');
    }
  }
);

const initialState = {
  doctors: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastFetched: null
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    resetDoctorsState: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    // Optional: Add a reducer to manually add a doctor
    addDoctor: (state, action) => {
      state.doctors.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.doctors = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || action.payload || 'Failed to fetch doctors';
      });
  }
});

export const { resetDoctorsState, addDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;