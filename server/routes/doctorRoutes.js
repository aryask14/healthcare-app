const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { schemas } = require('../middleware/validate');

// Doctor Registration (Admin Only)
router.post(
  '/',
  verifyToken,
  checkRole(['admin']),
  validate(schemas.doctorRegistration),
  doctorController.registerDoctor
);

// Public Doctor Listings
router.get('/', doctorController.getAllDoctors);
router.get('/:id/availability', doctorController.getDoctorAvailability);

// Doctor Profile Management
router.get(
  '/profile',
  verifyToken,
  checkRole(['doctor']),
  doctorController.getDoctorProfile
);

router.put(
  '/profile',
  verifyToken,
  checkRole(['doctor']),
  doctorController.updateDoctorProfile
);

// Admin Doctor Management
router.delete(
  '/:id',
  verifyToken,
  checkRole(['admin']),
  doctorController.deleteDoctor
);

module.exports = router;