import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { db } from '../firebase';
import { deleteUser } from 'firebase/auth';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const AdminManage = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const snapshot = await getDocs(collection(db, 'admins'));
      const adminsList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAdmins(adminsList.filter((admin) => admin.role !== 'sysadmin'));
    };
    fetchAdmins();
  }, []);

  const handleRemoveAdmin = async (adminId) => {
    try {
      await deleteDoc(doc(db, 'admins', adminId));
      // Assumes Firebase Admin SDK can delete user
      await deleteUser(adminId);  
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
