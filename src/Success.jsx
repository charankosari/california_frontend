import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { CircularProgress, Typography, Container, Snackbar, Alert, Box, Card, CardContent, CardMedia } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';

const BookingConfirmation = () => {
  const [loading, setLoading] = useState(true);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const processBooking = async () => {
      const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

      if (!userDetails) {
        setConfirmationMessage('Restricted area: No user details found.');
        setAlertSeverity('error');
        setLoading(false);
        setAlertOpen(true);
        return;
      }

      const bookingData = {
        name: userDetails.name,
        phoneNumber: userDetails.number,
        email: userDetails.email,
        amountpaid: userDetails.amount, // Default to 0 if undefined
        serviceId: userDetails.serviceId,
        date: userDetails.date,
      };

      try {
        const response = await axios.post(
          'https://oneapp.trivedagroup.com/api/c3/user/addbooking',
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          }
        );

        if (response.status === 201) {
          setConfirmationMessage('Booking confirmed successfully.');
          setAlertSeverity('success');
        } else {
          setConfirmationMessage('Failed to confirm booking.');
          setAlertSeverity('error');
        }
      } catch (error) {
        setConfirmationMessage('Error occurred while confirming booking.');
        setAlertSeverity('error');
        console.error('Booking error:', error);
      } finally {
        setLoading(false);
        sessionStorage.removeItem('userDetails'); 
        setAlertOpen(true);
      }
    };

    processBooking();
  }, [history]);

  useEffect(() => {
    if (!loading && alertSeverity === 'success') {
      const timer = setTimeout(() => {
        history.push('/');
      }, 1000); // Redirect after 1 second
      return () => clearTimeout(timer);
    }
  }, [loading, alertSeverity, history]);

  const handleAlertClose = () => {
    setAlertOpen(false);
    history.push('/');
  };

  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Card style={{ maxWidth: 400, margin: 'auto', padding: '20px' }}>
            <CardContent>
              <Box display="flex" justifyContent="center">
                <CheckCircleOutlineIcon style={{ fontSize: 80, color: 'green' }} />
              </Box>
              <Typography variant="h4" style={{ marginTop: '20px' }}>
                {confirmationMessage}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {confirmationMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookingConfirmation;
