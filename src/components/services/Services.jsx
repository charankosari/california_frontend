import React from "react"
import img from "../images/services.jpg"
import Back from "../common/Back"
import "../home/featured/Featured.css"
import FeaturedCard from "../home/featured/FeaturedCard"
import Header from "../common/header/Header"
import Footer from "../common/footer/Footer"
import Recent from "../home/recent/Recent"

const Services = () => {
  return (
    <>
    <Header/>
      <section className='services mb'>
        <Back name='Services' title='Services -All Services' cover={img} />
        <div className='featured container'>
          <FeaturedCard />
        </div>
      </section>
      <Recent/>

      <Footer/>
    </>
  )
}

export default Services
