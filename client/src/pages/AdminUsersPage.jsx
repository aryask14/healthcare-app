import React from 'react';
import { Container } from '@mui/material';
import UserManagement from '../components/admin/UserManagement';
import AdminLayout from '../layouts/AdminLayout';

const AdminUsersPage = () => {
  return (
    <AdminLayout>
      <Container maxWidth="xl">
        <UserManagement />
      </Container>
    </AdminLayout>
  );
};

export default AdminUsersPage;