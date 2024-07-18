import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookingList.css'; // Import the CSS file

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }
  
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
  
        const response = await axios.get('http://localhost:9999/api/c3/user/getbooking', config);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="booking-list">
      <h1>Bookings</h1>
      <ul>
        {bookings.map((booking, index) => (
          <li key={index} className="booking-item">
            <img src={booking.image} alt={booking.service} className="booking-image" />
            <div className="booking-details">
              <h2>{booking.service}</h2>
              <h3>{booking.name}</h3>
              <p>Price: ${booking.amountpaid}</p>
              <p>Date: {booking.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingList;
