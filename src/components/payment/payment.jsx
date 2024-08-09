import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Typography, CardContent, Divider, CardHeader } from '@mui/material';
import Header from '../common/header/Header';
import Footer from '../common/footer/Footer';
import './PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const history = useHistory();
  const { service } = location.state || {};
  const [error, setError] = useState('');

  const token = localStorage.getItem('jwtToken'); // Retrieve the JWT token from localStorage

  if (!service) {
    return (
      <>
        <Header />
        <div style={{ padding: '20px' }}>
          <Typography variant="h3" gutterBottom>
            Payment
          </Typography>
          <Typography variant="body1" style={{ marginTop: 20 }}>
            Service data not found.
          </Typography>
        </div>
        <Footer />
      </>
    );
  }

  const handleCheckout = async () => {
    try {
        const response = await axios.post('https://oneapp.trivedagroup.com/api/c3/user/addbooking', {
            name: 'John Doe',
            phoneNumber: '9876543210',
            email: 'johndoe@example.com',
            amountpaid: service.amount,
            serviceId: service._id,
            date: new Date().toISOString().split('T')[0]
          }, {
            headers: {
              Authorization: `Bearer ${token}` // Include the JWT token in the request headers
            }
          });
      if (response.status === 200) {
        history.push('/confirm', { service });
      } else {
        setError('Booking not confirmed');
      }
    } catch (error) {
      setError('Booking not confirmed');
    }
  };

  return (
    <>
      <Header />
      <div className="payment-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', marginTop: '30px' }}>
        <div className="left-column">
          <div className="card-container">
            <CardContent>
              <CardHeader title="Payment Details" />
              <Typography variant="h6" style={{ marginTop: '20px' }}>{service.service.charAt(0).toUpperCase() + service.service.slice(1)}</Typography>
              <img src={service.image || 'https://via.placeholder.com/150'} alt={service.name} style={{ width: '40%', height: 'auto', borderRadius: '8px', marginTop: '20px' }} />
              <Typography variant="body1" style={{ marginTop: '20px' }}>{service.description}</Typography>
              <Divider style={{ margin: '20px 0' }} />
              <Typography variant="body2" color="textSecondary">
                <strong>Email:</strong> {service.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Phone:</strong> {service.number}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Address:</strong>{' '}
                {service.addresses.map((addr, index) => (
                  <span key={index}>{`${addr.address}, ${addr.pincode}`}</span>
                ))}
              </Typography>
              <Typography variant="h5" style={{ marginTop: '20px' }}>
                <strong>Price:</strong> ${service.amount}
              </Typography>
            </CardContent>
          </div>
        </div>
        <div className="right-column">
          <div className="card-container">
            <form className="form" onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
              <label htmlFor="name" className="label">
                <span className="title">Card holder full name</span>
                <input
                  className="input-field"
                  type="text"
                  name="input-name"
                  title="Input title"
                  placeholder="Enter your full name"
                />
              </label>
              <label htmlFor="serialCardNumber" className="label">
                <span className="title">Card Number</span>
                <input
                  id="serialCardNumber"
                  className="input-field"
                  type="number"
                  name="input-name"
                  title="Input title"
                  placeholder="0000 0000 0000 0000"
                />
              </label>
              <div className="split">
                <label htmlFor="ExDate" className="label">
                  <span className="title">Expiry Date</span>
                  <input
                    id="ExDate"
                    className="input-field"
                    type="text"
                    name="input-name"
                    title="Expiry Date"
                    placeholder="01/23"
                  />
                </label>
                <label htmlFor="cvv" className="label">
                  <span className="title"> CVV</span>
                  <input
                    id="cvv"
                    className="input-field"
                    type="number"
                    name="cvv"
                    title="CVV"
                    placeholder="CVV"
                  />
                </label>
              </div>
              <input className="checkout-btn" type="submit" value="Checkout" />
            </form>
            {error && (
              <Typography variant="body1" style={{ color: 'red', marginTop: '20px' }}>
                {error}
              </Typography>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
