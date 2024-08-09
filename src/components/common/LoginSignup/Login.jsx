import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, CircularProgress, Alert, Box, Modal } from '@mui/material';
import { styled } from '@mui/system';

const AuthContainer = styled(Container)({
  marginTop: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '90vh',
});

const AuthCard = styled(Paper)({
  padding: '20px',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
  borderRadius: '10px',
});

const Login = ({ handleLogin }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false); // State for modal visibility
  const [emailForReset, setEmailForReset] = useState(''); // State for email input in modal
  const url = "https://oneapp.trivedagroup.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${url}/api/c3/user/login`, formData);
      localStorage.setItem('jwtToken', response.data.jwtToken);
      handleLogin();
      setLoading(false);
      history.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setOpenModal(true); // Open the modal when "Forgot Password" is clicked
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${url}/api/c3/user/forgotpassword`, { email: emailForReset });
      console.log('Reset password email sent:', response.data.message);
      setOpenModal(false);
      alert('Reset password email sent! Please check your email.');
    } catch (error) {
      console.error('Error sending reset password email:', error);
      alert('Failed to send reset password email. Please try again later.');
    }
  };

  return (
    <AuthContainer>
      <AuthCard elevation={3}>
        <Typography variant="h5" component="h2" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
        </form>
        <Box mt={2}>
          <Link to="/register">Create an account</Link>
          <span> | </span>
          <Button color="primary" onClick={handleForgotPassword}>Forgot Password?</Button>
        </Box>
      </AuthCard>

      {/* Modal for Forgot Password */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="forgot-password-modal"
        aria-describedby="modal-for-forgot-password"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          minWidth: 300,
          maxWidth: '80%',
          borderRadius: '8px',
        }}>
          <Typography variant="h6" gutterBottom>
            Forgot Password
          </Typography>
          <TextField
            label="Enter your email"
            type="email"
            value={emailForReset}
            onChange={(e) => setEmailForReset(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleResetPassword} fullWidth>
            Send Reset Email
          </Button>
        </Box>
      </Modal>
    </AuthContainer>
  );
};

export default Login;
