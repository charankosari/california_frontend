import React, { useState, useEffect } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import logo from '../../images/logo.png';
const Header = () => {
  const history = useHistory();
  const [navList, setNavList] = useState(false);
  const isLoggedIn = localStorage.getItem('jwtToken');
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  return (
    <>
      <header  >
        <div className='container flex' >
          <Link to='/'>
            <div className='logo'>
              <img src={logo} alt=''  />
            </div>
          </Link>
          <div className='nav'>
            <ul className={navList ? "small" : "flex"}>
              {nav.map((list, index) => (
                <li key={index}>
                  <Link to={list.path}>{list.text}</Link>
                </li>
              ))}
              {isLoggedIn && isMobile && (
  <>
    <ul>
      <li>
        <Link to='/bookings'>My Bookings</Link>
      </li>
      <li>
        <Link to='/fav'>Favourites</Link>
      </li>
      <li>
        <Link to='/profile'>Profile</Link>
      </li>
       
    </ul>
  </>
)}
 {!isLoggedIn && isMobile && (
  <li>
        <Link to='/login'>Login</Link>
      </li>
 )}
            </ul>
          </div>
          <div className='button flex'>
            <h4>
              <Link to='/bookings'>   My Bookings</Link>
            </h4>
            <h4>
              <Link to='/fav'>Favourites</Link>
            </h4>
            {isLoggedIn ? (
              <Link to='/profile'>
                <button className='btn1'>
                  <i className='fa fa-sign-out'></i> Profile
                </button>
              </Link>
            ) : (
              <button className='btn1' onClick={() => { history.push('/login') }}>
                <i className='fa fa-sign-out'></i> Sign In
              </button>
            )}
          </div>
          <div className='toggle'>
            <button onClick={() => setNavList(!navList)}>
              {navList ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
            </button>
          </div>
        </div>
      </header>

    </>
  );
};

export default Header;
