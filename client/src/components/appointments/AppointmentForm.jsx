// components/AppointmentForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bookAppointment } from '../features/appointments/appointmentSlice';
import { getDoctorAvailability } from '../features/doctors/doctorSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const AppointmentForm = ({ doctorId }) => {
  const dispatch = useDispatch();
  const { availableSlots } = useSelector((state) => state.doctors);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    dispatch(getDoctorAvailability(doctorId));
  }, [dispatch, doctorId]);

  const initialValues = {
    date: new Date(),
    time: '',
    reason: '',
    notes: ''
  };

  const validationSchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    reason: Yup.string().required('Reason is required')
  });

  const onSubmit = (values, { setSubmitting }) => {
    const appointmentData = {
      doctorId,
      date: values.date,
      time: values.time,
      reason: values.reason,
      notes: values.notes
    };
    dispatch(bookAppointment(appointmentData));
    setSubmitting(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="appointment-form">
        <h2>Book Appointment</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <div className="form-group">
                <label>Date</label>
                <DateTimePicker
                  value={values.date}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setFieldValue('date', date);
                  }}
                  minDate={new Date()}
                  disablePast
                />
                <ErrorMessage name="date" component="div" className="error" />
              </div>

              <div className="form-group">
                <label>Available Time Slots</label>
                <Field as="select" name="time">
                  <option value="">Select a time slot</option>
                  {availableSlots
                    .filter(slot => new Date(slot.startTime).toDateString() === selectedDate.toDateString())
                    .map((slot, index) => (
                      <option key={index} value={slot.startTime}>
                        {new Date(slot.startTime).toLocaleTimeString()} - {new Date(slot.endTime).toLocaleTimeString()}
                      </option>
                    ))}
                </Field>
                <ErrorMessage name="time" component="div" className="error" />
              </div>

              <div className="form-group">
                <label>Reason for Visit</label>
                <Field as="textarea" name="reason" rows="3" />
                <ErrorMessage name="reason" component="div" className="error" />
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <Field as="textarea" name="notes" rows="2" />
              </div>

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </LocalizationProvider>
  );
};

export default AppointmentForm;