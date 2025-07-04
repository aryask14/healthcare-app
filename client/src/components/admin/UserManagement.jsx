import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  PersonAdd
} from '@mui/icons-material';
import {
  fetchUsers,
  updateUserRole,
  deleteUser
} from '../../features/admin/adminSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, totalUsers, isLoading, error } = useSelector((state) => state.admin);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers({ page: page + 1, limit: rowsPerPage, search: searchTerm }));
  }, [dispatch, page, rowsPerPage, searchTerm]);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleRoleChange = (newRole) => {
    if (selectedUser) {
      dispatch(updateUserRole({ userId: selectedUser._id, role: newRole }));
    }
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser._id));
    }
    handleMenuClose();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reset to first page on new search
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const roleColors = {
    admin: 'error',
    doctor: 'primary',
    patient: 'success',
    pharmacist: 'warning'
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        User Management
      </Typography>

      {/* Search and Filter Bar */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by name, email, or phone"
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
            }}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Filters
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            sx={{ ml: 2, whiteSpace: 'nowrap' }}
          >
            Add User
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={user.avatar} sx={{ mr: 2 }} />
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={roleColors[user.role] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleRoleChange('admin')}>
              <Edit sx={{ mr: 1 }} /> Make Admin
            </MenuItem>
            <MenuItem onClick={() => handleRoleChange('doctor')}>
              <Edit sx={{ mr: 1 }} /> Make Doctor
            </MenuItem>
            <MenuItem onClick={() => handleRoleChange('patient')}>
              <Edit sx={{ mr: 1 }} /> Make Patient
            </MenuItem>
            <MenuItem onClick={handleDeleteUser}>
              <Delete sx={{ mr: 1 }} /> Delete User
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default UserManagement;