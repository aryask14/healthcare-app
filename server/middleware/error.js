const logger = require('../utils/logger');
const { NODE_ENV } = require('../config/config');

// Custom Error Classes
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApiError {
  constructor(errors) {
    super(400, 'Validation failed');
    this.errors = errors;
  }
}

// Error Converter (for non-ApiError exceptions)
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false);
  }

  next(error);
};

// Error Handler (format response)
const errorHandler = (err, req, res, next) => {
  const { statusCode, message, errors } = err;

  // Log operational errors
  if (err.isOperational) {
    logger.error(`[Operational Error] ${statusCode} - ${message}`);
  } else {
    logger.error(`[Critical Error] ${err.stack}`);
  }

  // Response format
  const response = {
    success: false,
    message,
    ...(errors && { errors }), // Include validation errors if present
    ...(NODE_ENV === 'development' && { stack: err.stack }) // Add stack in dev
  };

  res.status(statusCode || 500).json(response);
};

// 404 Not Found Handler
const notFound = (req, res, next) => {
  next(new ApiError(404, `Not found - ${req.originalUrl}`));
};

module.exports = {
  ApiError,
  ValidationError,
  errorConverter,
  errorHandler,
  notFound
};