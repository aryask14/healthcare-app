const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let query;
    
    // Patients can see only their appointments
    if (req.user.role === 'patient') {
      query = Appointment.find({ patientId: req.user.id })
        .populate('doctorId', 'userId specialization')
        .populate('doctorId.userId', 'name');
    } 
    // Doctors can see only their appointments
    else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      query = Appointment.find({ doctorId: doctor._id })
        .populate('patientId', 'name email phone');
    } 
    // Admin can see all appointments
    else {
      query = Appointment.find()
        .populate('patientId', 'name email phone')
        .populate('doctorId', 'userId specialization')
        .populate('doctorId.userId', 'name');
    }

    const appointments = await query.sort({ date: -1 });

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, msg: 'Doctor not found' });
    }

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({ 
      doctorId, 
      date, 
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ success: false, msg: 'Time slot already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      reason,
      status: 'pending'
    });

    await appointment.save();

    // Populate doctor and patient details for response
    await appointment.populate('doctorId', 'userId specialization').execPopulate();
    await appointment.populate('doctorId.userId', 'name').execPopulate();
    await appointment.populate('patientId', 'name email').execPopulate();

    // Send notification emails
    await sendEmail({
      email: appointment.patientId.email,
      subject: 'Appointment Booked',
      message: `Your appointment with Dr. ${appointment.doctorId.userId.name} has been booked for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`
    });

    const doctorUser = await User.findById(doctor.userId);
    await sendEmail({
      email: doctorUser.email,
      subject: 'New Appointment Request',
      message: `You have a new appointment request from ${appointment.patientId.name} for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}.`
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    const { status } = req.body;

    let appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'userId specialization')
      .populate('doctorId.userId', 'name email');

    if (!appointment) {
      return res.status(404).json({ success: false, msg: 'Appointment not found' });
    }

    // Check if user is authorized to update
    if (req.user.role === 'patient' && appointment.patientId._id.toString() !== req.user.id) {
      return res.status(401).json({ success: false, msg: 'Not authorized' });
    }

    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ userId: req.user.id });
      if (appointment.doctorId._id.toString() !== doctor._id.toString()) {
        return res.status(401).json({ success: false, msg: 'Not authorized' });
      }
    }

    appointment.status = status;
    await appointment.save();

    // Send status update email
    await sendEmail({
      email: appointment.patientId.email,
      subject: 'Appointment Status Updated',
      message: `Your appointment with Dr. ${appointment.doctorId.userId.name} has been ${status}.`
    });

    res.json({ success: true, data: appointment });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};