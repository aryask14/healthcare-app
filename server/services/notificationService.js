const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { ApiError } = require('../middleware/error');
const logger = require('../utils/logger');
const config = require('../config/config');

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: config.EMAIL.SERVICE,
  auth: {
    user: config.EMAIL.USER,
    pass: config.EMAIL.PASS
  }
});

// Twilio client setup
const twilioClient = twilio(config.TWILIO.ACCOUNT_SID, config.TWILIO.AUTH_TOKEN);

/**
 * Send appointment confirmation
 */
const sendAppointmentConfirmation = async (appointment) => {
  try {
    const [patient, doctor] = await Promise.all([
      User.findById(appointment.patient),
      User.findById(appointment.doctor)
    ]);

    // Email content
    const mailOptions = {
      from: config.EMAIL.FROM,
      to: patient.email,
      subject: 'Appointment Confirmation',
      html: `
        <h2>Your appointment is confirmed</h2>
        <p><strong>Doctor:</strong> Dr. ${doctor.name}</p>
        <p><strong>Date/Time:</strong> ${appointment.dateTime.toLocaleString()}</p>
        <p><strong>Reason:</strong> ${appointment.reason}</p>
      `
    };

    // SMS content
    const smsBody = `Your appointment with Dr. ${doctor.name} is confirmed for ${appointment.dateTime.toLocaleString()}`;

    // Send parallel notifications
    await Promise.all([
      transporter.sendMail(mailOptions),
      twilioClient.messages.create({
        body: smsBody,
        from: config.TWILIO.PHONE_NUMBER,
        to: patient.phone
      })
    ]);

    logger.info(`Notification sent for appointment ${appointment._id}`);
  } catch (error) {
    logger.error(`NotificationService::sendAppointmentConfirmation failed - ${error.message}`);
    throw new ApiError(500, 'Failed to send notification');
  }
};

/**
 * Send appointment cancellation notice
 */
const sendAppointmentCancellation = async (appointment) => {
  // Similar implementation to sendAppointmentConfirmation
  // with cancellation-specific messaging
};

/**
 * Send medicine reminder
 */
const sendMedicineReminder = async (userId, medicineName, time) => {
  // Implementation for medication reminders
};

/**
 * Send low stock alert to admin
 */
const sendLowStockAlert = async (medicine) => {
  // Implementation for inventory alerts
};

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentCancellation,
  sendMedicineReminder,
  sendLowStockAlert
};