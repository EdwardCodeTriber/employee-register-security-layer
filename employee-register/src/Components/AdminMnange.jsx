import { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';

const AdminManage = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('https://employee-register-security-layer.onrender.com/api/admins/admins');
        const adminsList = response.data;
        setAdmins(adminsList.filter((admin) => admin.role !== 'sysadmin'));
      } catch (error) {
        console.error('Error retrieving admins:', error.message);
      }
    };
    fetchAdmins();
  }, []);

  const handleRemoveAdmin = async (adminId) => {
    try {
      await axios.delete(`https://employee-register-security-layer.onrender.com/api/admins/${adminId}`);
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== adminId));
      alert('Admin rights removed');
    } catch (error) {
      console.error('Error removing admin:', error.message);
      alert('Failed to remove admin rights');
    }
  };

  return (
    <Container>
      <Typography variant="h6">Manage Admins</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Surname</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.name}</TableCell>
              <TableCell>{admin.surname}</TableCell>
              <TableCell>{admin.role}</TableCell>
              <TableCell>
                <Button onClick={() => handleRemoveAdmin(admin.id)} color="secondary">Remove Rights</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminManage;
