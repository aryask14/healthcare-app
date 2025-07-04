const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { ApiError } = require('../middleware/error');
const logger = require('../utils/logger');
const notificationService = require('./notificationService');

/**
 * Book a new appointment
 */
const bookAppointment = async (appointmentData) => {
  const session = await Appointment.startSession();
  session.startTransaction();

  try {
    // 1. Verify doctor availability
    const doctor = await Doctor.findById(appointmentData.doctorId).session(session);
    if (!doctor) {
      throw new ApiError(404, 'Doctor not found');
    }

    // 2. Check if slot is available
    const slotDateTime = new Date(appointmentData.dateTime);
    const slotDay = slotDateTime.toLocaleDateString('en-US', { weekday: 'long' });
    const slotTime = slotDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const availableSlot = doctor.availableSlots.find(
      slot => slot.day === slotDay && slot.time === slotTime && !slot.isBooked
    );

    if (!availableSlot) {
      throw new ApiError(400, 'Selected time slot is not available');
    }

    // 3. Create appointment
    const appointment = new Appointment({
      patient: appointmentData.patientId,
      doctor: appointmentData.doctorId,
      dateTime: slotDateTime,
      reason: appointmentData.reason,
      duration: 30 // Default 30-minute slot
    });

    // 4. Mark slot as booked
    availableSlot.isBooked = true;

    // 5. Save changes
    await appointment.save({ session });
    await doctor.save({ session });
    await session.commitTransaction();

    // 6. Send notifications
    await notificationService.sendAppointmentConfirmation(appointment);

    return appointment;
  } catch (error) {
    await session.abortTransaction();
    logger.error(`AppointmentService::bookAppointment failed - ${error.message}`);
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Get appointments for a user (patient or doctor)
 */
const getUserAppointments = async (userId, role) => {
  try {
    const query = role === 'patient' 
      ? { patient: userId } 
      : { doctor: userId };

    return await Appointment.find(query)
      .populate(role === 'patient' ? 'doctor' : 'patient', 'name')
      .sort({ dateTime: 1 });
  } catch (error) {
    logger.error(`AppointmentService::getUserAppointments failed - ${error.message}`);
    throw error;
  }
};

/**
 * Cancel an appointment
 */
const cancelAppointment = async (appointmentId, userId, role) => {
  const session = await Appointment.startSession();
  session.startTransaction();

  try {
    // 1. Validate appointment
    const appointment = await Appointment.findById(appointmentId).session(session);
    if (!appointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    // 2. Verify ownership
    if (
      (role === 'patient' && !appointment.patient.equals(userId)) ||
      (role === 'doctor' && !appointment.doctor.equals(userId))
    ) {
      throw new ApiError(403, 'Not authorized to cancel this appointment');
    }

    // 3. Free up the time slot
    const doctor = await Doctor.findById(appointment.doctor).session(session);
    const slotDateTime = new Date(appointment.dateTime);
    const slotDay = slotDateTime.toLocaleDateString('en-US', { weekday: 'long' });
    const slotTime = slotDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const bookedSlot = doctor.availableSlots.find(
      slot => slot.day === slotDay && slot.time === slotTime && slot.isBooked
    );

    if (bookedSlot) {
      bookedSlot.isBooked = false;
      await doctor.save({ session });
    }

    // 4. Update appointment status
    appointment.status = 'Cancelled';
    await appointment.save({ session });

    // 5. Commit transaction
    await session.commitTransaction();

    // 6. Send notification
    await notificationService.sendAppointmentCancellation(appointment);

    return appointment;
  } catch (error) {
    await session.abortTransaction();
    logger.error(`AppointmentService::cancelAppointment failed - ${error.message}`);
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  bookAppointment,
  getUserAppointments,
  cancelAppointment
};