const Joi = require('joi');
const { Types } = require('mongoose');

// Custom validation rules
const customValidators = {
  objectId: Joi.string().custom((value, helpers) => {
    if (!Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'ObjectId validation'),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .message('Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character'),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .message('Phone number must be 10-15 digits'),

  timeSlot: Joi.string()
    .pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    .message('Time slot must be in HH:MM format (24-hour)')
};

// Common validation schemas
const schemas = {
  idParam: Joi.object({
    id: customValidators.objectId.required()
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }),

  dateRange: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required()
  })
};

// Validate middleware
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: property === 'query'
    });

    if (error) {
      const errors = error.details.reduce((acc, curr) => {
        const key = curr.path.join('.');
        acc[key] = curr.message.replace(/"/g, '');
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = {
  ...customValidators,
  schemas,
  validate
};