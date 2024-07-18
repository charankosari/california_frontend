import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import { Typography, Grid, Card, CardContent, CardHeader, Divider, Button } from '@mui/material';
import Header from '../../common/header/Header';
import Footer from '../../common/footer/Footer';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import React icons
import axios from 'axios';

const DetailedView = () => {
  const history = useHistory(); // Initialize useHistory for navigation
  const service = JSON.parse(sessionStorage.getItem('selectedService'));
  const [isFavorited, setIsFavorited] = useState(false);

  console.log(service)

  useEffect(() => {
    const fetchFavoriteServiceIds = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/c3/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Replace with your actual JWT token handling
          },
        });
        const favoriteServiceIds = response.data.favoriteServices.map(service => service._id);
        setIsFavorited(favoriteServiceIds.includes(service._id)); // Check if current service ID is in favorite list
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchFavoriteServiceIds();
  }, [service._id]);

  // Function to handle adding/removing from wishlist
  const handleToggleFavorite = async () => {
    try {
      const response = await axios.post(`http://localhost:9999/api/c3/user/me/wishlist/${service._id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Replace with your actual JWT token handling
        },
      });
      setIsFavorited(!isFavorited); // Toggle favorite state
      console.log(response.data); // Handle success or further operations
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBookNow = () => {
    history.push({
      pathname: '/payment',
      state: { service }, // Pass service data to the payment page
    });
  };

  if (!service) {
    return (
      <>
        <Header />
        <div style={{ padding: '20px' }}>
          <Typography variant="h3" gutterBottom>
            Service Details
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', marginTop: '30px' }} className='something'>
        <Card style={{ width: '80%', maxWidth: '800px', marginBottom: '20px', position: 'relative' }}>
          <CardContent style={{ textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }} id='heart'>
              <button onClick={handleToggleFavorite} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                {isFavorited ? <FaHeart color="#f44336" size={24} /> : <FaRegHeart color="#808080" size={24} />}
              </button>
            </div>
            <CardHeader title={service.service.charAt(0).toUpperCase() + service.service.slice(1)} />
            <img src={service.image || 'https://via.placeholder.com/150'} alt={service.name} style={{ width: '100%', height: 'auto', borderRadius: '8px', marginTop: '20px' }} />
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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <Typography variant="h5" style={{ marginRight: '20px' }}>
                <strong>Price:</strong> ${service.amount}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleBookNow}>
                Book Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default DetailedView;
