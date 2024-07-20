import React from "react"

const Back = ({ name, title, cover }) => {
  return (
    <>
      <div className='back'>
        <div className='container'>
          <span>{name}</span>
          <h1>{title}</h1>
        </div>
        <img src='https://img.freepik.com/premium-photo/professional-cleaning-service-team-cleans-living-room-modern-apartment_130111-3783.jpg?size=626&ext=jpg' alt='' />
      </div>
    </>
  )
}

export default Back
