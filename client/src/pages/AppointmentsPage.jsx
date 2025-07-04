import React from 'react';
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import {
  CalendarToday,
  History,
  Schedule
} from '@mui/icons-material';
import UpcomingAppointments from '../components/appointments/UpcomingAppointments';
import PastAppointments from '../components/appointments/PastAppointments';

const AppointmentsPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          <CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />
          My Appointments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your upcoming and past medical appointments
        </Typography>
      </Box>

      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ mb: 4 }}
      >
        <Tab 
          label="Upcoming" 
          icon={<Schedule sx={{ verticalAlign: 'middle' }} />} 
          iconPosition="start" 
        />
        <Tab 
          label="History" 
          icon={<History sx={{ verticalAlign: 'middle' }} />} 
          iconPosition="start" 
        />
      </Tabs>

      {tabValue === 0 ? (
        <UpcomingAppointments />
      ) : (
        <PastAppointments />
      )}
    </Container>
  );
};

export default AppointmentsPage;