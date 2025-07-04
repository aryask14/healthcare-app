import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './AppointmentCalendar.css';

const AppointmentCalendar = ({ onDateSelect, doctorAvailability }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    if (doctorAvailability) {
      const dates = doctorAvailability.availableDays.map(day => {
        // Convert day name to date in the current week
        const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          .indexOf(day.toLowerCase());
        const today = new Date();
        const nextDay = new Date(today.setDate(today.getDate() + (dayIndex - today.getDay() + 7) % 7));
        return nextDay;
      });
      setAvailableDates(dates);
    }
  }, [doctorAvailability]);

  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const prevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const renderDays = () => {
    const days = [];
    let startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const isAvailable = availableDates.some(availableDate => 
        isSameDay(availableDate, day) && day >= new Date()
      );

      days.push(
        <div 
          key={day}
          className={`calendar-day ${isAvailable ? 'available' : 'unavailable'} 
            ${selectedDate && isSameDay(selectedDate, day) ? 'selected' : ''}`}
          onClick={() => isAvailable && handleDateClick(day)}
        >
          <div className="day-name">{format(day, 'EEE')}</div>
          <div className="day-number">{format(day, 'd')}</div>
          {isAvailable && <div className="day-indicator"></div>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="appointment-calendar">
      <div className="calendar-header">
        <button onClick={prevWeek} className="nav-button">
          <FaChevronLeft />
        </button>
        <h3>{format(currentDate, 'MMMM yyyy')}</h3>
        <button onClick={nextWeek} className="nav-button">
          <FaChevronRight />
        </button>
      </div>
      <div className="calendar-days">
        {renderDays()}
      </div>
    </div>
  );
};

export default AppointmentCalendar;