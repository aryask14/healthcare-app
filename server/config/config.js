require('dotenv').config();

module.exports = {
  // Application Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  APP_NAME: 'Healthcare MERN',
  APP_VERSION: process.env.npm_package_version || '1.0.0',

  // Database Configuration
  DB: {
    URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-mern',
    OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
    },
  },

  // Authentication Configuration
  AUTH: {
    JWT_SECRET: process.env.JWT_SECRET || 'healthcare-secret-key',
    JWT_EXPIRE: '1d', // 1 day
    OTP_EXPIRE_MINUTES: 5,
    PASSWORD_RESET_EXPIRE: 30 * 60 * 1000, // 30 minutes
  },

  // Email Service Configuration
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE || 'Gmail',
    HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    PORT: process.env.EMAIL_PORT || 587,
    USER: process.env.EMAIL_USER || 'your-email@gmail.com',
    PASS: process.env.EMAIL_PASS || 'your-email-password',
    FROM: process.env.EMAIL_FROM || 'Healthcare App <no-reply@healthcare.com>',
  },

  // CORS Configuration
  CORS_OPTIONS: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },

  // Rate Limiting (for API security)
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },

  // File Upload Configuration
  FILE_UPLOAD: {
    MAX_SIZE: 1024 * 1024 * 5, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    UPLOAD_DIR: 'uploads/',
  },

  // API Documentation
  SWAGGER_OPTIONS: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Healthcare API',
        version: '1.0.0',
      },
    },
    apis: ['./routes/*.js'],
  },
};