const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/auth');
const { validate, validateId } = require('../middleware/validate');
const { schemas } = require('../middleware/validate');

// Appointment Booking
router.post(
  '/',
  verifyToken,
  validate(schemas.appointmentCreate),
  appointmentController.createAppointment
);

// Get Appointments
router.get('/my-appointments', verifyToken, appointmentController.getMyAppointments);
router.get(
  '/doctor/:doctorId',
  verifyToken,
  checkRole(['doctor', 'admin']),
  appointmentController.getDoctorAppointments
);

// Appointment Management
router.get(
  '/:id',
  verifyToken,
  validateId,
  appointmentController.getAppointmentDetails
);

router.put(
  '/:id/reschedule',
  verifyToken,
  validateId,
  appointmentController.rescheduleAppointment
);

router.put(
  '/:id/cancel',
  verifyToken,
  validateId,
  appointmentController.cancelAppointment
);

// Admin Reports
router.get(
  '/reports/daily',
  verifyToken,
  checkRole(['admin']),
  appointmentController.getDailyAppointmentsReport
);

module.exports = router;