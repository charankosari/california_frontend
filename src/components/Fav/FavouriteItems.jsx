import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FavouriteItems.css'; // Import the CSS file
import Header from '../common/header/Header';

const FavoriteItems = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('http://localhost:9999/api/c3/user/me/wishlist', config);
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <div>Loading favorite items...</div>;
  }

  if (error) {
    return <div>Error loading favorite items: {error.message}</div>;
  }

  return (
    <div>
      <Header/>
    <div className="favorite-items">
      <h1>Favorite Items</h1>
      <div className="favorites-container">
        {favorites.map((favorite, index) => (
          <div key={index} className="favorite-item">
            <img src={favorite.image} alt={favorite.service} className="favorite-image" />
            <div className="favorite-details">
              <h2>{favorite.service}</h2>
              <h3>{favorite.name}</h3>
              <p>Price: ${favorite.amountpaid}</p>
              <p>Date: {favorite.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div></div>
  );
};

export default FavoriteItems;
