const moment = require('moment-timezone');

// Validate appointment slot (30-minute intervals)
const isValidAppointmentSlot = (dateTime) => {
  const minutes = moment(dateTime).minutes();
  return minutes % 30 === 0; // Only allows :00 or :30
};

// Check if slot is in the future
const isFutureDateTime = (dateTime) => {
  return moment(dateTime).isAfter(moment());
};

// Format for display (e.g., "July 5, 2024, 2:30 PM")
const formatDisplayDate = (dateTime, timezone = 'America/New_York') => {
  return moment(dateTime).tz(timezone).format('MMMM D, YYYY, h:mm A');
};

// Get available time slots for a doctor
const getAvailableSlots = (doctorId, existingAppointments) => {
  const slots = [];
  const start = moment().startOf('day').add(9, 'hours'); // 9 AM
  const end = moment().startOf('day').add(17, 'hours');  // 5 PM

  for (let time = start; time.isBefore(end); time.add(30, 'minutes')) {
    const slot = time.clone();
    const isBooked = existingAppointments.some(appt => 
      moment(appt.dateTime).isSame(slot)
    );
    if (!isBooked) {
      slots.push(slot.toISOString());
    }
  }
  return slots;
};

module.exports = {
  isValidAppointmentSlot,
  isFutureDateTime,
  formatDisplayDate,
  getAvailableSlots
};