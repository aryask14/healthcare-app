import PropTypes from 'prop-types';

export const TimeSlotPickerPropTypes = {
  doctorId: PropTypes.string.isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onDateChange: PropTypes.func.isRequired,
  onTimeSelect: PropTypes.func.isRequired,
  availableSlots: PropTypes.arrayOf(
    PropTypes.shape({
      startTime: PropTypes.string.isRequired,
      endTime: PropTypes.string.isRequired
    })
  ),
  isLoading: PropTypes.bool
};