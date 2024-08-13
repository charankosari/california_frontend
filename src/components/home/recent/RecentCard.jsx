import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Typography, Snackbar, Alert } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useHistory } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import moment from "moment";
import './recent.css';
import AOS from "aos";
import "aos/dist/aos.css";
const RecentCard = () => {

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [wishList, setWishList] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const url = 'https://oneapp.trivedagroup.com';
  const history = useHistory();
  const [ch, setCh] = useState('');



  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(`${url}/api/c3/user/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        });
        const wishlistItems = response.data.user.wishList.map(item => item.service);
        const updatedWishList = { ...wishList };
        wishlistItems.forEach(id => {
          updatedWishList[id] = true;
        });
        setWishList(updatedWishList);
        console.log(wishList)

      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${url}/api/c3/ser/allservice`);
        const allServices = response.data.services;

        const today = moment().format("YYYY-MM-DD");
        const noon = moment().set({ hour: 12, minute: 0, second: 0 });

        const filteredServices = allServices.map(service => {
          const { bookingIds } = service;
          const validDates = {};
          Object.keys(bookingIds).forEach(date => {
            if (moment(date).isSameOrAfter(today)) {
              const validTimes = Object.keys(bookingIds[date]).filter(timeSlot => {
                const slotTime = moment().startOf('day').add(timeSlot, 'hours');
                return moment(date).isAfter(today) || slotTime.isAfter(noon);
              });

              if (validTimes.length > 0) {
                validDates[date] = validTimes.reduce((acc, timeSlot) => {
                  acc[timeSlot] = bookingIds[date][timeSlot];
                  return acc;
                }, {});
              }
            }
          });

          return {
            ...service,
            bookingIds: validDates
          };
        }).filter(service => Object.keys(service.bookingIds).length > 0);

        setServices(filteredServices);
        setFilteredServices(filteredServices);
        const wishListDict = {};
        filteredServices.forEach(service => {
          wishListDict[service._id] = false;
        });
        setWishList(wishListDict);
        fetchWishlist();
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterServices(e.target.value);
  };

  const filterServices = (term) => {
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(term.toLowerCase()) ||
      service.service.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const categorizeServices = () => {
    const categorizedServices = {};

    filteredServices.forEach(service => {
      const { service: serviceName } = service;

      if (!categorizedServices[serviceName]) {
        categorizedServices[serviceName] = [];
      }

      categorizedServices[serviceName].push(service);
    });

    return categorizedServices;
  };

  const categorizedServices = categorizeServices();

  const handleServiceClick = (service) => {
    sessionStorage.setItem('selectedService', JSON.stringify(service));
    history.push(`/details/${service._id}`);
  };
  const handleAlertClose = () => {
    setAlertOpen(false);
  };
  const handleToggleFavorite = async (id) => {
    setLoading(true);
    if (localStorage.getItem('jwtToken') === null) {
      alert('Please login to add to favorites');
      history.push('/login');
      setLoading(false);
      return;
    }
    try {
      const isFavorited = wishList[id] || false;
      await axios.post(
        `https://oneapp.trivedagroup.com/api/c3/user/me/wishlist/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      setWishList(prevWishList => ({
        ...prevWishList,
        [id]: !isFavorited
      }));
      setAlertMessage(
        isFavorited ? "Removed from favorites" : "Added to favorites"
      );
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setAlertMessage("An error occurred while updating favorites");
      setAlertSeverity("error");
    } finally {
      setLoading(false);
      setAlertOpen(true);
    }
  };
  
  return (
    <div>
      <TextField
        label="Search Services"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {Object.keys(categorizedServices).length === 0 ? (
        <Typography variant="body1" style={{ marginTop: 20 }}>No services found matching your search.</Typography>
      ) : (
        Object.keys(categorizedServices).map((serviceType, index) => (
          <div key={serviceType} style={{ marginBottom: '20px' }} data-aos='fade-up'>
            <h2 id={serviceType.toLowerCase().replace(/\s+/g, '-')}>{serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</h2>
            <div className='content grid3 ' style={{marginTop:'20px'}} >
              {categorizedServices[serviceType].map((service, index) => {
                const { _id, image, service: serviceName, name, amount, overallRating, numReviews } = service;
                const defaultImage = "https://via.placeholder.com/150";
                console.log(wishList)
                return (
                  <div className="card">
                    <button key={index} style={{ textDecoration: 'none', border: 'none', backgroundColor: 'transparent' }} onClick={() => handleServiceClick(service)}>

                      <div className="card-img"> <img src={image || defaultImage} alt={serviceName} /></div>
                      <div className="card-info">
                        <p className="text-title" style={{ color: 'black' }}>{name}</p>
                      </div>
                    </button>

                    <div className="card-footer">
                      <span className="text-title">${amount}</span>
                      <div className="card-button" onClick={() => handleToggleFavorite(_id)}>
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        wishList[_id] ? (
          <FaHeart color="red" />
        ) : (
          <FaRegHeart color="gray" />
        )
      )}
    </div>


                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: '#7280AA', marginTop: '10px' }}>
                      Ratings:
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < overallRating ? "#ffd700" : "#e4e5e9"} style={{ marginRight: '2px' }} size={10} />
                      ))}
                      {overallRating === 0 ? <span style={{ fontSize: '10px' }}>(no reviews yet)</span> : (`${numReviews} reviews`)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RecentCard;
