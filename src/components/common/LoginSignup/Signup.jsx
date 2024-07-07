import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import './Log.css';
import { ClipLoader } from 'react-spinners'; // Import ClipLoader from react-spinners

const Signup = () => {
  const navigate = useHistory();
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
    gender: 'male', // Default gender
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address' || name === 'pincode') {
      const updatedAddresses = formData.addresses.map((addr, index) => {
        if (index === 0) { // Assuming only one address for simplicity, modify as needed
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
    try {
      await axios.post('http://localhost:9999/api/c3/user/register', formData);
      setIsLoading(false); 
      navigate('/login'); 
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response.data.error);
      setIsLoading(false); 
    }
  };
  
  return (
    <div className="auth-container">
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
            placeholder="Pincode"
            value={formData.addresses[0].pincode}
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
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
