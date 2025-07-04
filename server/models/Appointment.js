const mongoose = require('mongoose');
const validator = require('validator');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient reference is required']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor reference is required']
  },
  dateTime: {
    type: Date,
    required: [true, 'Appointment date/time is required'],
    validate: {
      validator: function (date) {
        return date > new Date();
      },
      message: 'Appointment must be in the future'
    }
  },
  duration: {
    type: Number,
    default: 30, // minutes
    min: [15, 'Minimum appointment duration is 15 minutes'],
    max: [120, 'Maximum appointment duration is 2 hours']
  },
  reason: {
    type: String,
    required: [true, 'Appointment reason is required'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No-Show'],
    default: 'Scheduled'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  },
  paymentAmount: {
    type: Number,
    min: [0, 'Payment amount cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for query optimization
appointmentSchema.index({ patient: 1, dateTime: 1 });
appointmentSchema.index({ doctor: 1, dateTime: 1 });
appointmentSchema.index({ status: 1, dateTime: 1 });

// Pre-save hook to validate appointment slot availability
appointmentSchema.pre('save', async function (next) {
  const doctor = await mongoose.model('Doctor').findById(this.doctor);
  const slot = doctor.availableSlots.find(
    slot => slot.day === this.dateTime.toLocaleString('en-US', { weekday: 'long' }) &&
           slot.time === this.dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  if (!slot || slot.isBooked) {
    throw new Error('Selected slot is not available');
  }

  // Mark slot as booked
  slot.isBooked = true;
  await doctor.save();
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);