const winston = require('winston');
const { combine, timestamp, printf, colorize, errors } = winston.format;
const path = require('path');
const { NODE_ENV } = require('../config/config');

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Base logger configuration
const logger = winston.createLogger({
  level: NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log') 
    })
  ]
});

// Pretty console logging in development
if (NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: 'HH:mm:ss' }),
      logFormat
    )
  }));
}

// API request logging middleware
const requestLogger = (req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    body: req.body,
    params: req.params,
    query: req.query
  });
  next();
};

module.exports = {
  logger,
  requestLogger
};