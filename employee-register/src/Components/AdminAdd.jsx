import { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Snackbar, CircularProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

const AdminAdd = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    age: '',
    idNumber: '',
    role: 'admin',
    photo: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePhotoChange = (e) => setFormData({ ...formData, photo: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ open: false, message: '', severity: '' });

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => formDataObj.append(key, formData[key]));

    try {
      await axios.post('http://localhost:5001/api/admins/add-admin', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAlert({ open: true, message: 'Admin added successfully', severity: 'success' });
      setFormData({ email: '', password: '', name: '', surname: '', age: '', idNumber: '', role: 'admin', photo: null });
    } catch (error) {
      console.error('Error adding admin:', error);
      setAlert({ open: true, message: 'Error adding admin', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>Add New Admin</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth required />
        <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
        <TextField label="Surname" name="surname" value={formData.surname} onChange={handleChange} fullWidth required />
        <TextField label="Age" name="age" value={formData.age} onChange={handleChange} fullWidth required />
        <TextField label="ID Number" name="idNumber" value={formData.idNumber} onChange={handleChange} fullWidth required />
        <Button variant="outlined" component="label" fullWidth>
          Upload Photo
          <input type="file" accept="image/*" onChange={handlePhotoChange} hidden required />
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Admin'}
        </Button>
      </Box>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default AdminAdd;
