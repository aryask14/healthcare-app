import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/appointmentApi';

export const getPastAppointments = createAsyncThunk(
  'appointments/getPastAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPastAppointments();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch past appointments');
    }
  }
);

const initialState = {
  pastAppointments: [],
  loading: false,
  isError: false,
  message: '',
  status: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    resetAppointmentState: (state) => {
      state.loading = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPastAppointments.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.status = 'loading';
      })
      .addCase(getPastAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.pastAppointments = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getPastAppointments.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.message = action.payload || 'An error occurred';
        state.pastAppointments = [];
        state.status = 'failed';
      });
  }
});

export const { resetAppointmentState } = appointmentSlice.actions;
export default appointmentSlice.reducer;