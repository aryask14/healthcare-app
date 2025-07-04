import React, { useState, useEffect } from 'react';

import {
  Grid,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  AccessTime,
  Today,
  Schedule
} from '@mui/icons-material';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { TimeSlotPickerPropTypes } from './TimeSlotPicker.propTypes';
TimeSlotPicker.propTypes = TimeSlotPickerPropTypes;

const TimeSlotPicker = ({ 
  doctorId, 
  selectedDate, 
  onDateChange, 
  onTimeSelect,
  availableSlots = [],
  isLoading
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Generate time slots (e.g., every 30 minutes from 9AM to 5PM)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const interval = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const prevWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const handleDateSelect = (date) => {
    onDateChange(date);
    setSelectedSlot(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedSlot(time);
    onTimeSelect(time);
  };

  const isSlotAvailable = (date, time) => {
    return availableSlots.some(slot => {
      const slotDate = parseISO(slot.startTime);
      return (
        isSameDay(slotDate, date) && 
        format(slotDate, 'HH:mm') === time
      );
    });
  };

  const renderDays = () => {
    const days = [];
    const startDate = new Date(currentWeekStart);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const dayHasAvailability = availableSlots.some(slot => 
        isSameDay(parseISO(slot.startTime), day)
      );

      days.push(
        <Grid item xs key={day}>
          <Button
            fullWidth
            variant={isSameDay(day, selectedDate) ? 'contained' : 'outlined'}
            onClick={() => handleDateSelect(day)}
            disabled={!dayHasAvailability}
            sx={{
              py: 2,
              borderRadius: 1,
              borderColor: dayHasAvailability ? 'primary.main' : 'text.disabled'
            }}
          >
            <Box>
              <Typography variant="body2">
                {format(day, 'EEE')}
              </Typography>
              <Typography variant="h6">
                {format(day, 'd')}
              </Typography>
              {dayHasAvailability && (
                <Box sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: 'success.main',
                  borderRadius: '50%',
                  margin: '0 auto',
                  mt: 1
                }} />
              )}
            </Box>
          </Button>
        </Grid>
      );
    }

    return days;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Schedule sx={{ verticalAlign: 'middle', mr: 1 }} />
          Select Appointment Time
        </Typography>
        <IconButton onClick={prevWeek}>
          <ArrowBack />
        </IconButton>
        <Typography variant="subtitle1" sx={{ mx: 2 }}>
          {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
        </Typography>
        <IconButton onClick={nextWeek}>
          <ArrowForward />
        </IconButton>
      </Box>

      {/* Weekday Selector */}
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {renderDays()}
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Time Slot Grid */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : !selectedDate ? (
        <Box textAlign="center" py={4}>
          <Today sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary">
            Please select a date to view available time slots
          </Typography>
        </Box>
      ) : availableSlots.length === 0 ? (
        <Alert severity="info" sx={{ my: 2 }}>
          No available slots on {format(selectedDate, 'MMMM d')}. Please try another day.
        </Alert>
      ) : (
        <>
          <Typography variant="subtitle1" gutterBottom>
            <AccessTime sx={{ verticalAlign: 'middle', mr: 1 }} />
            Available times for {format(selectedDate, 'EEEE, MMMM d')}
          </Typography>
          <Grid container spacing={1}>
            {timeSlots.map((time) => {
              const isAvailable = isSlotAvailable(selectedDate, time);
              const isSelected = selectedSlot === time && isAvailable;

              return (
                <Grid item xs={6} sm={4} md={3} key={time}>
                  <Button
                    fullWidth
                    variant={isSelected ? 'contained' : 'outlined'}
                    onClick={() => isAvailable && handleTimeSelect(time)}
                    disabled={!isAvailable}
                    sx={{
                      py: 1.5,
                      borderRadius: 1,
                      borderColor: isAvailable ? 'primary.main' : 'text.disabled'
                    }}
                  >
                    {time}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Paper>
  );
};

export default TimeSlotPicker;