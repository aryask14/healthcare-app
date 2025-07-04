// server/utils/errorResponse.js
class ErrorResponse extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Distinguish operational errors
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details) {
    return new ErrorResponse(message, 400, details);
  }

  static unauthorized(message = 'Not authorized') {
    return new ErrorResponse(message, 401);
  }

  static notFound(message = 'Resource not found') {
    return new ErrorResponse(message, 404);
  }

  static serverError(message = 'Server error') {
    return new ErrorResponse(message, 500);
  }
}

module.exports = ErrorResponse;