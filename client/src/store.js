import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import doctorReducer from './features/doctors/doctorSlice';
import appointmentReducer from './features/appointments/appointmentSlice';
import medicineReducer from './features/pharmacy/medicineSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
    medicines: medicineReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});