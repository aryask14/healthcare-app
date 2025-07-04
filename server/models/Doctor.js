const mongoose = require('mongoose');
const validator = require('validator');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'Cardiology',
      'Neurology',
      'Pediatrics',
      'Orthopedics',
      'Dermatology',
      'Gynecology',
      'General'
    ]
  },
  qualifications: {
    type: [String],
    required: [true, 'At least one qualification is required'],
    validate: {
      validator: function (quals) {
        return quals.length > 0;
      },
      message: 'At least one qualification is required'
    }
  },
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    default: 0
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Fee cannot be negative']
  },
  availableDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
    validate: {
      validator: function (days) {
        return days.length > 0;
      },
      message: 'At least one available day is required'
    }
  },
  availableSlots: [
    {
      day: String,
      time: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }
  ],
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 5
  },
  hospital: {
    type: String,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for doctor's appointments
doctorSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doctor'
});

// Indexes for faster queries
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ 'availableSlots.day': 1, 'availableSlots.time': 1 });

module.exports = mongoose.model('Doctor', doctorSchema);