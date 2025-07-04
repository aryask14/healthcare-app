const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  genericName: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required'],
    trim: true
  },
  dosageForm: {
    type: String,
    required: [true, 'Dosage form is required'],
    enum: [
      'Tablet',
      'Capsule',
      'Syrup',
      'Injection',
      'Ointment',
      'Drops',
      'Inhaler'
    ]
  },
  strength: {
    type: String,
    required: [true, 'Strength is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
    validate: {
      validator: function (date) {
        return date > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  prescriptionRequired: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: [
      'Antibiotic',
      'Analgesic',
      'Antihistamine',
      'Antacid',
      'Vitamin',
      'Other'
    ],
    default: 'Other'
  },
  sideEffects: [String],
  contraindications: [String],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for search optimization
medicineSchema.index({ name: 'text', genericName: 'text' });
medicineSchema.index({ category: 1, prescriptionRequired: 1 });

// Virtual for low stock alert
medicineSchema.virtual('isLowStock').get(function () {
  return this.stock < 10;
});

// Pre-save hook for price history (example)
medicineSchema.pre('save', async function (next) {
  if (this.isModified('price')) {
    // Could log to price history collection
  }
  next();
});

module.exports = mongoose.model('Medicine', medicineSchema);