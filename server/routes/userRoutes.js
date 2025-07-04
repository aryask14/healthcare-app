const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { schemas } = require('../middleware/validate');

// Patient Registration
router.post(
  '/register',
  validate(schemas.patientRegistration),
  userController.registerPatient
);

// Patient Profile Routes
router.get(
  '/me',
  verifyToken,
  checkRole(['patient']),
  userController.getMyProfile
);

router.put(
  '/me',
  verifyToken,
  checkRole(['patient']),
  userController.updateMyProfile
);

// Admin Patient Management
router.get(
  '/patients',
  verifyToken,
  checkRole(['admin']),
  userController.getAllPatients
);

module.exports = router;