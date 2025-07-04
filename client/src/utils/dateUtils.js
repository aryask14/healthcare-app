import moment from 'moment';

// Format for input[type="datetime-local"]
export const toDateTimeLocal = (date) => {
  return moment(date).format('YYYY-MM-DDTHH:mm');
};

// Calculate age from DOB
export const calculateAge = (dob) => {
  return moment().diff(moment(dob), 'years');
};

// Human-readable dates (e.g., "Today at 2:30 PM")
export const humanizeDate = (date) => {
  return moment(date).calendar(null, {
    sameDay: '[Today at] h:mm A',
    nextDay: '[Tomorrow at] h:mm A',
    nextWeek: 'dddd [at] h:mm A',
    lastDay: '[Yesterday at] h:mm A',
    lastWeek: '[Last] dddd [at] h:mm A',
    sameElse: 'MMMM D, YYYY [at] h:mm A'
  });
};