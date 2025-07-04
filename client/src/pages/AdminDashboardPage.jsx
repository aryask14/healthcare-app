import React from 'react';
import { Container } from '@mui/material';
import Dashboard from '../components/admin/Dashboard';
import AdminLayout from '../layouts/AdminLayout';

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <Dashboard />
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboardPage;