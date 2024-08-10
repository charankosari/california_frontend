import React, { useEffect, useState } from "react";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import BoltIcon from '@mui/icons-material/Bolt';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import YardIcon from '@mui/icons-material/Yard';
import { TbAirConditioning } from "react-icons/tb";
import axios from 'axios';
import moment from 'moment';

const normalizeString = (str) => {
  return str.toLowerCase().replace(/[\s\-]+/g, ''); // Convert to lowercase and remove spaces and dashes
};

const filterValidServices = (services) => {
  const currentDate = moment();
  const currentTime = currentDate.hour();

  return services.filter(service => {
    const slotsData = service.bookingIds || {};
    const validDates = Object.keys(slotsData).filter(date => {
      const slotDate = moment(date);
      return slotDate.isAfter(currentDate, 'day') || 
             (slotDate.isSame(currentDate, 'day') && currentTime < 12);
    });

    return validDates.length > 0; // Keep the service if it has any valid dates
  });
};

const FeaturedCard = () => {
  const [services, setServices] = useState([]);
  const [serviceCounts, setServiceCounts] = useState({});

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://oneapp.trivedagroup.com/api/c3/ser/allservice');
        let fetchedServices = response.data.services;
        
        // Filter services based on valid booking dates
        fetchedServices = filterValidServices(fetchedServices);

        setServices(fetchedServices);

        // Normalize and count services
        const counts = fetchedServices.reduce((acc, service) => {
          const normalizedService = normalizeString(service.service);
          acc[normalizedService] = (acc[normalizedService] || 0) + 1;
          return acc;
        }, {});

        setServiceCounts(counts);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const serviceDetails = [
    {
      icon: <TbAirConditioning style={{ fontSize: 60, color: 'blue' }} />,
      name: "Air Conditioner Repair",
      target: "air-conditioner-repair" // This should be in the normalized form as well
    },
    {
      icon: <PlumbingIcon style={{ fontSize: 60, color: 'orange' }} />,
      name: "Plumbers",
      target: "plumbers"
    },
    {
      icon: <BoltIcon style={{ fontSize: 60, color: 'yellow' }} />,
      name: "Electricians",
      target: "electricians"
    },
    {
      icon: <CleaningServicesIcon style={{ fontSize: 60, color: 'green' }} />,
      name: "Home Cleaners",
      target: "home-cleaners"
    },
    {
      icon: <YardIcon style={{ fontSize: 60, color: 'purple' }} />,
      name: "Landscaping",
      target: "landscaping"
    },
  ];

  return (
    <div className='content grid5 mtop'>
      {serviceDetails.map((item, index) => (
        <a href={`#${item.target}`} key={index} className='box'>
          {item.icon}
          <h4>{item.name}</h4>
          <label>{serviceCounts[normalizeString(item.name)] || "0 Services"}</label>
        </a>
      ))}
    </div>
  );
};

export default FeaturedCard;
