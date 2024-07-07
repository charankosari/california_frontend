import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Typography } from "@mui/material"; // Assuming you use MUI components
import { useHistory } from "react-router-dom";
import './recent.css';

const RecentCard = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const url = 'http://localhost:9999';
  const history = useHistory();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${url}/api/c3/ser/allservice`);
        setServices(response.data.services);
        setFilteredServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterServices(e.target.value);
  };

  // Function to filter services based on search term
  const filterServices = (term) => {
    const filtered = services.filter(service =>
      service.name.toLowerCase().includes(term.toLowerCase()) ||
      service.service.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  // Function to categorize services based on type
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

  // Function to handle clicking on a service box
  const handleServiceClick = (service) => {
    // Save service details to sessionStorage
    sessionStorage.setItem('selectedService', JSON.stringify(service));
    // Navigate to the detailed view
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
        Object.keys(categorizedServices).map(serviceType => (
          <div key={serviceType} style={{ marginBottom: '20px' }}>
            <h2>{serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</h2>
            <div className='content grid3 mtop'>
              {categorizedServices[serviceType].map((service, index) => {
                const { _id, image, service: serviceName, addresses, name, amount, role } = service;
                const location = addresses.length > 0 ? addresses[0].address : "Location not provided";
                const defaultImage = "https://via.placeholder.com/150"; 

                return (
                  <button key={index} style={{ textDecoration: 'none', border: 'none', backgroundColor: 'transparent' }} onClick={() => handleServiceClick(service)}>
                    <div className='box shadow'>
                      <div className='img'>
                        <img src={image || defaultImage} alt={serviceName} />
                      </div>
                      <div className='text'>
                        <div className='category flex' >
                          <span style={{ background: role === "service" ? "#25b5791a" : "#ff98001a", color: role === "service" ? "#25b579" : "#ff9800" }}>{serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</span>
                          <i className='fa fa-heart'></i>
                        </div>
                        {/* <h4 style={{color:'black'}}>{name.charAt(0).toUpperCase() + name.slice(1)}</h4> */}
                        <p style={{justifyContent:'start',display:'flex',marginTop:'10px',marginBottom:'10px'}}>
                          <i className='fa fa-location-dot'></i> {location}
                        </p>
                      </div>
                      <div className='button flex'>
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
