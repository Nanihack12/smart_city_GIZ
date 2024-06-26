import React from 'react';
import { Container, Typography,  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const ExistingUsersPage = () => {
  const users = [
    {
      username: 'john_doe',
      email: 'john@example.com',
      role: 'Admin',
    },
    {
      username: 'jane_smith',
      email: 'jane@example.com',
      role: 'Manager',
    },
    {
      username: 'bob_johnson',
      email: 'bob@example.com',
      role: 'User',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Existing Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ExistingUsersPage;