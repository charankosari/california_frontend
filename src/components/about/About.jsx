import React from "react";
import Back from "../common/Back";
import Heading from "../common/Heading";
import img from "../images/about.jpg";
import "./about.css";
import Header from "../common/header/Header";
import Footer from "../common/footer/Footer";

const About = () => {
  return (
    <>
      <Header />
      <section className='about'>
        <Back name='About Us' title='About Us - Who We Are?' cover={img} />
        <div className='container flex mtop'>
          <div className='left row'>
            <Heading title='One App' subtitle='Learn about our mission and services in California' />

            <p>
              Welcome to our company, a leading service provider in California. We pride ourselves on delivering top-notch services tailored to meet the needs of our clients across various sectors. With a dedicated team and a commitment to excellence, we strive to be the preferred choice for service solutions in the Golden State.
            </p>
            <p>
              Our story began with a vision to provide exceptional service quality and build lasting relationships with our clients. Over the years, we have grown significantly and expanded our service offerings, all while maintaining our core values of integrity, reliability, and innovation.
            </p>
            <button className='btn2'>Learn More About Us</button>
          </div>
          <div className='right row'>
          <img src='./immio.jpg' alt='' />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
