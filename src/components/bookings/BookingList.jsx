import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Grid, CircularProgress, Avatar } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DoneIcon from '@mui/icons-material/Done';
import UpcomingIcon from '@mui/icons-material/Schedule';
import TodayIcon from '@mui/icons-material/Today';
import axios from 'axios';
import moment from 'moment';
import Footer from '../common/footer/Footer';
import Header from '../common/header/Header';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('http://localhost:9999/api/c3/user/getbooking', config);
        setBookings(response.data.bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const today = moment().startOf('day');
  const categorizedBookings = bookings.reduce(
    (acc, booking) => {
      const bookingDate = moment(booking.date);

      if (bookingDate.isSame(today, 'day')) {
        acc.today.push(booking);
      } else if (bookingDate.isBefore(today, 'day')) {
        acc.finished.push(booking);
      } else {
        acc.upcoming.push(booking);
      }

      return acc;
    },
    { today: [], finished: [], upcoming: [] }
  );

  const renderBookings = (category, icon, title) => (
    <Box mb={4}>
      <Typography variant="h5" gutterBottom>
        <Box display="flex" alignItems="center">
          {icon}
          {title}
        </Box>
      </Typography>
      <Grid container spacing={3}>
        {category.map((booking) => (
          <Grid item xs={12} sm={6} md={4} key={booking._id}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar alt={booking.service.name} src="/static/images/avatar/1.jpg" />
                  <Box ml={2}>
                    <Typography variant="h6">{booking.service.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {moment(booking.date).format('MMMM Do YYYY')}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1">{booking.service.email}</Typography>
                <Typography variant="body1">{booking.service.number}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Service: {booking.service.service}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Amount Paid: ${booking.amountpaid}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const noBookingsFound =
    categorizedBookings.today.length === 0 &&
    categorizedBookings.finished.length === 0 &&
    categorizedBookings.upcoming.length === 0;

  return (
    <>
    <Header/>
    <Container style={{marginTop:'10px'}}>
      <Typography variant="h4" gutterBottom align="center">
        Bookings
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : noBookingsFound ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <Typography variant="h6">No Bookings Found</Typography>
        </Box>
      ) : (
        <>
          {categorizedBookings.today.length > 0 &&
            renderBookings(
              categorizedBookings.today,
              <TodayIcon color="primary" style={{ marginRight: 8 }} />,
              "Today's Bookings"
            )}
          {categorizedBookings.finished.length > 0 &&
            renderBookings(
              categorizedBookings.finished,
              <DoneIcon color="primary" style={{ marginRight: 8 }} />,
              'Finished Bookings'
            )}
          {categorizedBookings.upcoming.length > 0 &&
            renderBookings(
              categorizedBookings.upcoming,
              <UpcomingIcon color="primary" style={{ marginRight: 8 }} />,
              'Upcoming Bookings'
            )}
        </>
      )}
    </Container>
    <Footer/>

    </>
  );
};

export default Bookings;