import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip
} from '@mui/material';
import { CalendarToday, Person, LocalHospital } from '@mui/icons-material';

const AppointmentsTable = ({ appointments }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Patient</TableCell>
          <TableCell>Doctor</TableCell>
          <TableCell>Date & Time</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {appointments.map((appt) => (
          <TableRow key={appt._id}>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={appt.patient.avatar} sx={{ mr: 2 }} />
                {appt.patient.name}
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalHospital color="primary" sx={{ mr: 1 }} />
                Dr. {appt.doctor.name}
              </Box>
            </TableCell>
            <TableCell>
              {new Date(appt.date).toLocaleDateString()} at {appt.time}
            </TableCell>
            <TableCell>
              <Chip
                label={appt.status}
                color={
                  appt.status === 'completed' ? 'success' :
                  appt.status === 'cancelled' ? 'error' : 'primary'
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AppointmentsTable;