const { ValidationError } = require('./error');
const Joi = require('joi');

// Schema Validators
const schemas = {
  patientRegistration: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    dob: Joi.date().max('now').required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional()
  }),

  doctorRegistration: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    specialization: Joi.string().required(),
    qualifications: Joi.array().items(Joi.string()).min(1).required(),
    consultationFee: Joi.number().min(0).required()
  }),

  medicineCreate: Joi.object({
    name: Joi.string().min(3).required(),
    genericName: Joi.string().optional(),
    manufacturer: Joi.string().required(),
    dosageForm: Joi.string().valid('tablet', 'capsule', 'syrup', 'injection', 'ointment').required(),
    strength: Joi.string().required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).default(0),
    expiryDate: Joi.date().greater('now').required(),
    prescriptionRequired: Joi.boolean().default(true)
  }),

  appointmentCreate: Joi.object({
    patientId: Joi.string().hex().length(24).required(),
    doctorId: Joi.string().hex().length(24).required(),
    dateTime: Joi.date().greater('now').required(),
    reason: Joi.string().max(500).required()
  })
};

// Validation Middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { 
    abortEarly: false,
    allowUnknown: false
  });

  if (error) {
    const errors = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message.replace(/"/g, '');
      return acc;
    }, {});

    next(new ValidationError(errors));
    return;
  }

  next();
};

// ObjectId Validation (for MongoDB IDs)
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    next(new ValidationError({ id: 'Invalid ID format' }));
    return;
  }
  next();
};

module.exports = {
  schemas,  
  validate,
  validateId
};