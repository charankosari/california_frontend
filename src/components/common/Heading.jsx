import React,{useEffect} from "react"
import AOS from "aos";
import "aos/dist/aos.css";
const Heading = ({ title, subtitle }) => {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: false, 
    });
  }, []);
  return (
    <>
      <div className='heading' data-aos='fade-up'  data-aos-easing="ease-out-sine"
          data-aos-duration="1000" > 
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </>
  )
}

export default Heading
