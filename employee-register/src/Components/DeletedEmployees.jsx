import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';

const DeletedEmployees = () => {
  const deletedEmployees = JSON.parse(localStorage.getItem('deletedEmployees')) || [];
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar Section */}
      <AppBar position="static" sx={{ backgroundColor: '#475569' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, }}>
          Left/Previous Employees
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Employee List
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <main style={{ flex: 1 }}>
        <br/>
        {/* Main Content Section */}
        <Container>
          <Typography variant="h6" gutterBottom sx={{ display:'flex', justifyContent:"center"}}>
            Left/Previous Employees
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Surname</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deletedEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.surname}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>
                    {emp.picture && <img src={emp.picture} alt={emp.name} width="50" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </main>
      <Footer /> {/* Footer is pushed to the bottom */}
    </div>
  );
};

export default DeletedEmployees;
