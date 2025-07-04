const Doctor = require('../models/Doctor');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { validateDoctorSpecialization } = require('../utils/validation');

// @desc    Register a new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const registerDoctor = asyncHandler(async (req, res) => {
  const { email, password, name, specialization, qualifications, availableDays } = req.body;

  if (!validateDoctorSpecialization(specialization)) {
    res.status(400);
    throw new Error('Invalid specialization');
  }

  const user = await User.create({
    email,
    password,
    role: 'doctor'
  });

  const doctor = await Doctor.create({
    user: user._id,
    name,
    specialization,
    qualifications,
    availableDays,
    consultationFee: req.body.consultationFee || 500,
    availableSlots: generateDefaultSlots(availableDays)
  });

  res.status(201).json({
    _id: doctor._id,
    name: doctor.name,
    specialization: doctor.specialization,
    availableDays: doctor.availableDays
  });
});

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = asyncHandler(async (req, res) => {
  const { specialization } = req.query;
  const filter = {};

  if (specialization) {
    filter.specialization = { $regex: specialization, $options: 'i' };
  }

  const doctors = await Doctor.find(filter)
    .populate('user', 'email status')
    .select('-__v -availableSlots');

  res.json(doctors);
});

// @desc    Get doctor availability
// @route   GET /api/doctors/:id/availability
// @access  Public
const getDoctorAvailability = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id)
    .select('availableDays availableSlots consultationFee');

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  res.json({
    availableDays: doctor.availableDays,
    slots: doctor.availableSlots,
    fee: doctor.consultationFee
  });
});

// Helper: Generate default time slots
const generateDefaultSlots = (availableDays) => {
  const slots = [];
  availableDays.forEach(day => {
    ['09:00', '10:00', '11:00', '14:00', '15:00'].forEach(time => {
      slots.push({ day, time, isBooked: false });
    });
  });
  return slots;
};

module.exports = {
  registerDoctor,
  getAllDoctors,
  getDoctorAvailability
};