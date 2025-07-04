const User = require('../models/User');
const Patient = require('../models/Patient');
const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');

// @desc    Register a new patient
// @route   POST /api/users/register
// @access  Public
const registerPatient = asyncHandler(async (req, res) => {
  const { email, password, name, phone, dob, gender, address } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user account
  const user = await User.create({
    email,
    password,
    role: 'patient'
  });

  // Create patient profile
  const patient = await Patient.create({
    user: user._id,
    name,
    phone,
    dob,
    gender,
    address,
    bloodGroup: req.body.bloodGroup || '',
    allergies: req.body.allergies || []
  });

  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
    profile: patient
  });
});

// @desc    Get all patients
// @route   GET /api/users/patients
// @access  Private/Admin
const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({})
    .populate('user', 'email status')
    .select('-medicalHistory -__v');

  res.json(patients);
});

// @desc    Get patient profile
// @route   GET /api/users/me
// @access  Private/Patient
const getMyProfile = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ user: req.user._id })
    .populate('user', 'email')
    .select('-__v');

  if (!patient) {
    res.status(404);
    throw new Error('Patient profile not found');
  }

  res.json(patient);
});

// @desc    Update patient profile
// @route   PUT /api/users/me
// @access  Private/Patient
const updateMyProfile = asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'phone', 'dob', 'gender', 'address', 'bloodGroup', 'allergies'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400);
    throw new Error('Invalid updates!');
  }

  const patient = await Patient.findOne({ user: req.user._id });
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }

  updates.forEach(update => patient[update] = req.body[update]);
  await patient.save();

  res.json(patient);
});

module.exports = {
  registerPatient,
  getAllPatients,
  getMyProfile,
  updateMyProfile
};