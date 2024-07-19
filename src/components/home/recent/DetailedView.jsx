import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Grid, Card, CardContent, CardHeader, Divider, Button, IconButton, Box, Container, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import Carousel from 'react-material-ui-carousel'; // MUI Carousel
import Header from '../../common/header/Header';
import Footer from '../../common/footer/Footer';
import './DetailedView.css'
const DetailedView = () => {
  const history = useHistory();
  const service = JSON.parse(sessionStorage.getItem('selectedService'));
  const [isFavorited, setIsFavorited] = useState(false);
  const [bookingSlots, setBookingSlots] = useState({});
  const [availableDates, setAvailableDates] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchFavoriteServiceIds = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/c3/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
        const favoriteServiceIds = response.data.favoriteServices.map(service => service._id);
        setIsFavorited(favoriteServiceIds.includes(service._id));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchBookingSlots = async () => {
      const slotsData = service.bookingIds;
      setBookingSlots(service.bookingIds);
      setAvailableDates(Object.keys(slotsData));
    };

    fetchFavoriteServiceIds();
    fetchBookingSlots();
  }, [service._id]);

  const handleToggleFavorite = async () => {
    try {
      await axios.post(`http://localhost:9999/api/c3/user/me/wishlist/${service._id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBookNow = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePayment = () => {
    // Implement payment logic here
    history.push({
      pathname: '/payment',
      state: { service },
    });
  };

  if (!service) {
    return (
      <>
        <Header />
        <Container style={{ padding: '20px' }}>
          <Typography variant="h3" gutterBottom>
            Service Details
          </Typography>
          <Typography variant="body1" style={{ marginTop: 20 }}>
            Service data not found.
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container style={{ marginTop: '30px' }}>
        <Card style={{ maxWidth: '800px', margin: 'auto' }}>
          <CardContent>
            <Box style={{ position: 'relative', textAlign: 'center' }}>
              <IconButton
                onClick={handleToggleFavorite}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  color: isFavorited ? '#f44336' : '#808080'
                }}
              >
                {isFavorited ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              </IconButton>
              <CardHeader
                title={service.service.charAt(0).toUpperCase() + service.service.slice(1)}
                subheader={`Price: $${service.amount}`}
              />
              <img
                src={service.image || 'https://via.placeholder.com/800x400'}
                alt={service.name}
                style={{ width: '100%', height: 'auto', borderRadius: '8px', marginTop: '20px' }}
              />
              <Typography variant="body1" style={{ marginTop: '20px' }}>
                {service.description}
              </Typography>
              <Divider style={{ margin: '20px 0' }} />
              <Typography variant="body2" color="textSecondary">
                <strong>Email:</strong> {service.email}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Phone:</strong> {service.number}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Address:</strong> {service.addresses.map((addr, index) => (
                  <span key={index}>{`${addr.address}, ${addr.pincode}`}</span>
                ))}
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginTop: '20px' }}>
                <strong>Available Times:</strong> 9 AM to 4 PM
              </Typography>
              <Divider style={{ margin: '20px 0' }} />
              <Typography variant="h6" style={{ marginBottom: '10px' }}>
                <strong>Available Dates</strong>
              </Typography>
              <Carousel
                navButtonsAlwaysVisible
                indicators={false}
                autoPlay={false}
                style={{ marginTop: '20px' }}
              >
                {availableDates.map(date => {
                  const slots = bookingSlots[date];
                  const availableSlots = Object.values(slots).filter(slot => slot.id === null).length;
                  return (
                    <Box key={date} style={{ padding: '20px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
                      <Typography variant="h6">{date}</Typography>
                      <Typography variant="body2" color={availableSlots > 0 ? 'textPrimary' : 'textSecondary'}>
                        {availableSlots > 0 ? `${availableSlots} slots remaining` : 'No slots available'}
                      </Typography>
                    </Box>
                  );
                })}
              </Carousel>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </div>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Payment Options</DialogTitle>
      <DialogContent>
        <section className="add-card page">
          <form className="form">
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
                <span className="title">CVV</span>
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
            <input className="checkout-btn" type="button" value="Checkout" />
          </form>
        </section>
      </DialogContent>
    </Dialog>

      <Footer />
    </>
  );
};

export default DetailedView;
