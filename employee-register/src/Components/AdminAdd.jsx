import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Avatar, Grid, Box } from '@mui/material';
import { db, auth, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePhotoChange = (e) => setFormData({ ...formData, photo: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;

      // Upload photo to Firebase Storage
      let photoURL = '';
      if (formData.photo) {
        const photoRef = ref(storage, `adminPhotos/${userId}`);
        await uploadBytes(photoRef, formData.photo);
        photoURL = await getDownloadURL(photoRef);
      }

      // Save admin details in Firestore
      await setDoc(doc(db, 'admins', userId), {
        name: formData.name,
        surname: formData.surname,
        age: formData.age,
        idNumber: formData.idNumber,
        role: formData.role,
        photoURL,
      });

      alert('Admin added successfully');
      setFormData({ email: '', password: '', name: '', surname: '', age: '', idNumber: '', role: 'admin', photo: null });
    } catch (error) {
      console.error('Error adding admin:', error.message);
      alert('Error adding admin');
    }
  };

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
        <Button type="submit" variant="contained" color="primary">Add Admin</Button>
      </Box>
    </Container>
  );
};

export default AdminAdd;
