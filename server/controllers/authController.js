const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/ErrorResponse');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      name: user.name,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse('Validation Error', 400, errors.array()));
  }

  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      phone
    });

    // Generate token
    const token = generateToken(user);

    // Send welcome email (async - don't await)
    sendEmail({
      email: user.email,
      subject: 'Welcome to Healthcare App',
      html: `
        <h1>Welcome ${user.name}!</h1>
        <p>Your account has been successfully created as a ${user.role}.</p>
      `
    }).catch(err => console.error('Email send error:', err));

    sendTokenResponse(user, 201, res);

  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);

  } catch (err) {
    next(err);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // Security: Don't reveal if user doesn't exist
      return res.status(200).json({ 
        success: true, 
        message: 'If an account exists, a reset email has been sent' 
      });
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>Click this link to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p><strong>This link expires in 10 minutes.</strong></p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        html: message
      });

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
      // Reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// Helper to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};