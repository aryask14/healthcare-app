import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';

const initialState = {
  stats: null,
  users: [],
  totalUsers: 0,
  recentAppointments: [],
  isLoading: false,
  error: null
};

export const fetchDashboardStats = createAsyncThunk(
  'admin/dashboardStats',
  async (_, thunkAPI) => {
    try {
      return await adminService.getDashboardStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ page, limit, search }, thunkAPI) => {
    try {
      return await adminService.getUsers(page, limit, search);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateRole',
  async ({ userId, role }, thunkAPI) => {
    try {
      return await adminService.updateUserRole(userId, role);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to load stats';
      })
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to load users';
      });
  }
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;