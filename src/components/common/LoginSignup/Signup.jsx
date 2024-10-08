import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import './Log.css';
import { ClipLoader } from 'react-spinners';
import { Typography } from '@mui/material';
const Signup = () => {
  const navigate = useHistory();
  const [cp,SetCp]=useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    addresses: [
      {
        address: '',
        pincode: '',
      }
    ],
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address' || name === 'pincode') {
      const updatedAddresses = formData.addresses.map((addr, index) => {
        if (index === 0) { 
          return {
            ...addr,
            [name]: value,
          };
        }
        return addr;
      });
      setFormData({
        ...formData,
        addresses: updatedAddresses,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(cp!== formData.password){
      alert("Password and confirm password does'nt match");
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post('https://oneapp.trivedagroup.com/api/c3/user/register', formData);
      const { jwtToken } = response.data;
      localStorage.setItem('jwttoken', jwtToken);
      setIsLoading(false);
      navigate.push('/'); // Use navigate.push to navigate to the home page
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response.data.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{display:'flex',flexDirection:'column'}}>
      <div className="auth-card">
        <h2>Signup</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="number"
            placeholder="Phone Number"
            value={formData.number}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.addresses[0].address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Zipcode"
            value={formData.addresses[0].pincode}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="confirmPassword"
            value={cp}
            onChange={(e)=>{SetCp(e.target.value);console.log(e.target.value)}}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <ClipLoader size={24} color="#ffffff" loading={isLoading} /> : 'Signup'}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
