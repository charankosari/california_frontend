import React from 'react';
import { useLocation } from 'react-router-dom';
import { Typography } from '@mui/material';
import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';

const ThankYouPage = () => {
  const location = useLocation();
  const { service } = location.state || {};

  if (!service) {
    return (
      <>
        <Header />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Thank You
          </Typography>
          <Typography variant="body1" style={{ marginTop: 20 }}>
            Service data not found.
          </Typography>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', textAlign: 'center' }}>
        <div>
          <Typography variant="h3" gutterBottom>
            Thank You for Booking!
          </Typography>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            {service.service.charAt(0).toUpperCase() + service.service.slice(1)}
          </Typography>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Price Paid: ${service.amount}
          </Typography>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThankYouPage;
