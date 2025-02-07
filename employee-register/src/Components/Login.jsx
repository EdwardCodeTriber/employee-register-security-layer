import { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Picture from '/registerIcon.png';

const Login = ({ setAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(); // Get the Firebase Auth instance

  const handleLogin = async () => {
    try {
      // Use Firebase's signInWithEmailAndPassword to authenticate the user
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      // Pass the user details to setAdmin function
      setAdmin({ username: user.email });

      // Navigate to home page after successful login
      navigate('/');
    } catch (error) {
      setError('Invalid email or password');
      console.error('Login error:', error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: `url(${Picture}) no-repeat center center`,
        backgroundSize: 'cover',
      }}
    >
      <Typography variant="h4" gutterBottom style={{ color: 'white', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        Admin Login
      </Typography>
      {error && <Typography color="error" style={{ marginBottom: '20px' }}>{error}</Typography>}
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
      />
      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
        Login
      </Button>
    </Container>
  );
};

export default Login;
