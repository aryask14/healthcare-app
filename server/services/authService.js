const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { ApiError } = require('../middleware/error');
const { generateToken } = require('../utils/auth');
const logger = require('../utils/logger');

/**
 * Register a new patient with user account and profile
 */
const registerPatient = async (userData, patientProfile) => {
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(400, 'Email already in use');
    }

    // Create user account
    const user = new User({
      email: userData.email,
      password: userData.password,
      role: 'patient'
    });

    // Create patient profile
    const patient = new Patient({
      user: user._id,
      ...patientProfile
    });

    // Save in transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
      await user.save({ session });
      await patient.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    // Generate JWT
    const token = generateToken(user);

    return {
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      profile: patient,
      token
    };
  } catch (error) {
    logger.error(`AuthService::registerPatient failed - ${error.message}`);
    throw error;
  }
};

/**
 * Authenticate user and generate token
 */
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Get additional profile based on role
    let profile = null;
    if (user.role === 'patient') {
      profile = await Patient.findOne({ user: user._id });
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ user: user._id });
    }

    return {
      token: generateToken(user),
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      },
      profile
    };
  } catch (error) {
    logger.error(`AuthService::loginUser failed - ${error.message}`);
    throw error;
  }
};

/**
 * Get current user profile based on role
 */
const getProfile = async (userId, role) => {
  try {
    if (role === 'patient') {
      return await Patient.findOne({ user: userId }).populate('user', 'email status');
    } else if (role === 'doctor') {
      return await Doctor.findOne({ user: userId }).populate('user', 'email status');
    }
    return null;
  } catch (error) {
    logger.error(`AuthService::getProfile failed - ${error.message}`);
    throw error;
  }
};

module.exports = {
  registerPatient,
  loginUser,
  getProfile
};