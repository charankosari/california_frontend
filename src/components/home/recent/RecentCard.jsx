import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { FaStar, FaUserAlt } from "react-icons/fa";
import moment from "moment";
import './recent.css';

const RecentCard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const url = 'https://oneapp.trivedagroup.com';
  const history = useHistory();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${url}/api/c3/ser/allservice`);
        const allServices = response.data.services;
        
        const today = moment().format("YYYY-MM-DD");
        const noon = moment().set({ hour: 12, minute: 0, second: 0 });

        const filteredServices = allServices.map(service => {
          const { bookingIds } = service;
          const validDates = {};

          // Filter valid dates and times
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
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
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
          <div key={serviceType} style={{ marginBottom: '20px' }}>
            <h2 id={serviceType.toLowerCase().replace(/\s+/g, '-')}>{serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</h2>
            <div className='content grid3 mtop'>
              {categorizedServices[serviceType].map((service, index) => {
                const { _id, image, service: serviceName, addresses, name, amount, role, overallRating, numReviews } = service;
                const location = addresses.length > 0 ? addresses[0].address : "Location not provided";
                const defaultImage = "https://via.placeholder.com/150";

                return (
                  <button key={index} style={{ textDecoration: 'none', border: 'none', backgroundColor: 'transparent' }} onClick={() => handleServiceClick(service)}>
                    <div className='box shadow'>
                      <div className='img'>
                        <img src={image || defaultImage} alt={serviceName} />
                      </div>
                      <div className='text'>
                        <div className='category flex'>
                          <span style={{ background: role === "service" ? "#25b5791a" : "#ff98001a", color: role === "service" ? "#25b579" : "#ff9800" }}>{serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</span>
                          <i className='fa fa-heart'></i>
                        </div>
                      
                        <p style={{ justifyContent: 'start', display: 'flex', marginTop: '10px', marginBottom: '10px' }}>
                          <FaUserAlt style={{ marginRight: '8px' }} />
                          {name}
                        </p>
                       
                        <p style={{ justifyContent: 'start', display: 'flex', marginTop: '10px', marginBottom: '10px' }}>
                          <i className='fa fa-location-dot'></i> {location}
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: '#7280AA' }}>
                          Ratings: 
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < overallRating ? "#ffd700" : "#e4e5e9"} style={{ marginRight: '2px' }} />
                          ))}
                          {overallRating === 0 ? <span>(no reviews yet)</span> : (`${numReviews} reviews`)}
                        </div>
                      </div>
                      
                      <div className='button flex '>
                        <div>
                          <button className='btn1'>${amount}</button>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentCard;
