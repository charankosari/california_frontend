import React, { useEffect, useState } from "react";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import BoltIcon from '@mui/icons-material/Bolt';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import YardIcon from '@mui/icons-material/Yard';
import { TbAirConditioning } from "react-icons/tb";
import axios from 'axios';
import moment from 'moment';
import AOS from "aos";
import "aos/dist/aos.css";
const normalizeString = (str) => {
  return str.toLowerCase().replace(/[\s\-]+/g, '');
};

const filterValidServices = (services) => {
  const currentDate = moment().startOf('day');
  const currentTime = moment();

  return services.map(service => {
    const slotsData = service.bookingIds || {};
    let hasValidBooking = false;

    Object.keys(slotsData).forEach(date => {
      const slotDate = moment(date);

      if (slotDate.isSameOrAfter(currentDate)) {
        const validTimes = Object.keys(slotsData[date]).filter(timeSlot => {
          const slotTime = moment(date).startOf('day').add(timeSlot, 'hours');
          return slotDate.isAfter(currentDate) || slotTime.isAfter(currentTime);
        });

        if (validTimes.length > 0) {
          hasValidBooking = true;  // Mark this service as having a valid booking
        }
      }
    });

    return {
      ...service,
      hasValidBooking,
    };
  });
};



const FeaturedCard = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, 
    });
  }, []);
  const [services, setServices] = useState([]);
  const [serviceCounts, setServiceCounts] = useState({});
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://oneapp.trivedagroup.com/api/c3/ser/allservice');
        let fetchedServices = response.data.services;
        fetchedServices = filterValidServices(fetchedServices);
        setServices(fetchedServices);
  
        const counts = fetchedServices.reduce((acc, service) => {
          if (service.hasValidBooking) {
            const normalizedService = normalizeString(service.service);
            acc[normalizedService] = (acc[normalizedService] || 0) + 1;  
          }
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
      target: "air-conditioner-repair" 
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
    <div className='content grid5 mtop' >
   {serviceDetails.map((item, index) => (
  <a 
    href={`#${item.target}`} 
    key={index} 
    className='box' 
    data-aos='fade-up' 
    data-aos-easing="ease-out-sine"
    data-aos-duration="1000"
    data-aos-delay={`${index * 200}`} 
  >
    {item.icon}
    <h4>{item.name}</h4>
    <label>{serviceCounts[normalizeString(item.name)] || "0 Services"}</label>
  </a>
))}

    </div>
  );
};

export default FeaturedCard;
