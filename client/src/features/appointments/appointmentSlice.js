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

export const getUpcomingAppointments = createAsyncThunk(
  'appointments/getUpcomingAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getUpcomingAppointments();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch upcoming appointments');
    }
  }
);

const initialState = {
  pastAppointments: [],
  upcomingAppointments: [],
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
      // Past Appointments
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
      })
      // Upcoming Appointments
      .addCase(getUpcomingAppointments.pending, (state) => {
        state.loading = true;
        state.isError = false;
        state.status = 'loading';
      })
      .addCase(getUpcomingAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.upcomingAppointments = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getUpcomingAppointments.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.message = action.payload || 'An error occurred';
        state.upcomingAppointments = [];
        state.status = 'failed';
      });
  }
});

export const { resetAppointmentState } = appointmentSlice.actions;
export default appointmentSlice.reducer;