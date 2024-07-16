import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Container, Paper, Typography, TextField, Button, CircularProgress, Snackbar } from '@mui/material';
import { styled } from '@mui/system';

const FormContainer = styled(Container)({
  marginTop: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '90vh',
});

const FormCard = styled(Paper)({
  padding: '20px',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
  borderRadius: '10px',
});

const ResetPasswordForm = () => {
  const { id } = useParams();
  const history = useHistory(); 
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:9999/api/c3/user/resetpassword/${id}`, {
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      setSuccess(true);
      setError('');
      console.log('Password reset successful:', response.data);
      
      history.push('/'); // Change '/' to the desired route after resetting password
    } catch (error) {
      console.error('Reset password error:', error.response.data);
      setError(error.response.data.error || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <FormContainer>
      <FormCard elevation={3}>
        <Typography variant="h5" component="h2" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            error={error.length > 0}
            helperText={error}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
          </Button>
        </form>
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="Password reset successfully!"
        />
      </FormCard>
    </FormContainer>
  );
};

export default ResetPasswordForm;