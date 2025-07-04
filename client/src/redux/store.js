import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import doctorReducer from '../features/doctors/doctorSlice';
import medicineReducer from '../features/pharmacy/medicineSlice';
import appointmentReducer from '../features/appointments/appointmentSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    pharmacy: medicineReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});
export default store;