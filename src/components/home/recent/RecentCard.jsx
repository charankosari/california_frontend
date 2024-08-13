import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { FaStar, FaUserAlt } from "react-icons/fa";
import moment from "moment";
import './recent.css';
import AOS from "aos";
import "aos/dist/aos.css";
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
            <div className='content grid3 mtop'>
              {categorizedServices[serviceType].map((service, index) => {
                const { _id, image, service: serviceName, addresses, name,description, amount, role, overallRating, numReviews } = service;
                const location = addresses.length > 0 ? addresses[0].address : "Location not provided";
                const defaultImage = "https://via.placeholder.com/150";

                return (
                  <button key={index} style={{ textDecoration: 'none', border: 'none', backgroundColor: 'transparent' }} onClick={() => handleServiceClick(service)}>
                    <div className="card">
                      <div className="card-img"> <img src={image || defaultImage} alt={serviceName} /></div>
                      <div className="card-info">
                        <p className="text-title" style={{color:'black'}}>{name}</p>
                      </div>
                      <div className="card-footer">
                        <span className="text-title">${amount}</span>
                        <div className="card-button">
                          
                          <svg className="svg-icon" viewBox="0 0 20 20">
                            <path d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                            <path d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                            <path d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                          </svg>
                          
                        </div>
                        
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: '#7280AA',marginTop:'10px' }}>
                          Ratings: 
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < overallRating ? "#ffd700" : "#e4e5e9"} style={{ marginRight: '2px' }} size={10}/>
                          ))}
                          {overallRating === 0 ? <span style={{fontSize:'10px'}}>(no reviews yet)</span> : (`${numReviews} reviews`)}
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
