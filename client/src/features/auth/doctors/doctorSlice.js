import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import doctorService from './doctorService';

const initialState = {
  doctors: null,
  isLoading: false,
  isError: false,
  message: ''
};

export const getDoctors = createAsyncThunk(
  'doctors/getAll',
  async (filters, thunkAPI) => {
    try {
      return await doctorService.getDoctors(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDoctors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
      })
      .addCase(getDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || 'Failed to load doctors';
      });
  }
});

export const { reset } = doctorSlice.actions;
export default doctorSlice.reducer;