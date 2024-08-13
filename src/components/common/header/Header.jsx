import React, { useState, useEffect } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import logo from '../../images/logo.png';
import AOS from "aos";
import "aos/dist/aos.css";
const Header = () => {
  const history = useHistory();
  const [navList, setNavList] = useState(false);
  const isLoggedIn = localStorage.getItem('jwtToken');
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, 
    });
  }, []);
  return (
    <>
      <header>
        <div className='container flex' data-aos="fade-down" data-aos-easing="ease-out-sine"
          data-aos-duration="1000">
          <Link to='/'>
            <div className='logo'>
              <img src={logo} alt='' data-aos="fade-up" data-aos-easing="ease-out-sine"
                data-aos-duration="1000" />
            </div>
          </Link>
          <div className='nav'>
            <ul className={navList ? "small" : "flex"} data-aos="fade-up" data-aos-easing="ease-out-sine"
              data-aos-duration="1000">
              {nav.map((list, index) => (
                <li key={index}>
                  <Link to={list.path}>{list.text}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='button flex' data-aos="fade-up" data-aos-easing="ease-out-sine"
            data-aos-duration="1000">
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
