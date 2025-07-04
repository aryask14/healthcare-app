const moment = require('moment-timezone');
const { WORKING_HOURS, TIMEZONE } = require('../config/config');

/**
 * Generate time slots for a given date range
 */
const generateSlots = (startDate, endDate, interval = 30) => {
  const slots = [];
  const current = moment(startDate).tz(TIMEZONE);
  const end = moment(endDate).tz(TIMEZONE);

  while (current.isBefore(end)) {
    if (isWithinWorkingHours(current)) {
      slots.push({
        start: current.clone(),
        end: current.clone().add(interval, 'minutes'),
        isAvailable: true
      });
    }
    current.add(interval, 'minutes');
  }

  return slots;
};

/**
 * Check if time is within working hours
 */
const isWithinWorkingHours = (time) => {
  const day = time.format('dddd');
  const hour = time.hour();
  
  return (
    WORKING_HOURS[day] && 
    hour >= WORKING_HOURS[day].start && 
    hour < WORKING_HOURS[day].end
  );
};

/**
 * Get available slots considering existing appointments
 */
const getAvailableSlots = async (doctorId, date, duration = 30) => {
  const startOfDay = moment(date).startOf('day');
  const endOfDay = moment(date).endOf('day');

  const [existingAppointments, doctor] = await Promise.all([
    Appointment.find({
      doctor: doctorId,
      dateTime: {
        $gte: startOfDay.toDate(),
        $lte: endOfDay.toDate()
      },
      status: { $ne: 'Cancelled' }
    }),
    Doctor.findById(doctorId).select('availableDays')
  ]);

  const allSlots = generateSlots(startOfDay, endOfDay, duration);
  const bookedSlots = existingAppointments.map(appt => 
    moment(appt.dateTime).format('HH:mm')
  );

  return allSlots.filter(slot => {
    const day = slot.start.format('dddd');
    const time = slot.start.format('HH:mm');
    
    return (
      doctor.availableDays.includes(day) &&
      !bookedSlots.includes(time) &&
      isWithinWorkingHours(slot.start)
    );
  });
};

/**
 * Round time to nearest slot
 */
const roundToNearestSlot = (time, interval = 30) => {
  const minutes = moment(time).minutes();
  const remainder = minutes % interval;
  
  if (remainder === 0) return moment(time);
  
  const adjustment = remainder < interval / 2 ? 
    -remainder : 
    (interval - remainder);
    
  return moment(time).add(adjustment, 'minutes').startOf('minute');
};

module.exports = {
  generateSlots,
  getAvailableSlots,
  roundToNearestSlot,
  isWithinWorkingHours
};