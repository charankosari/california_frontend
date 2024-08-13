import React, { useEffect } from "react";
import Heading from "../../common/Heading";
import "./hero.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, 
    });
  }, []);


  return (
    <>
      <section className='hero' >
        <div className='container' data-aos="fade-up"
          data-aos-easing="ease-out-sine"
          data-aos-duration="1000" >
          <Heading title='Search Your needed service' subtitle='Find a needy service in your area' />
        </div>
      </section>
    </>
  );
}

export default Hero;
