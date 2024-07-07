import React from "react"
import Heading from "../../common/Heading"
import "./recent.css"
import RecentCard from "./RecentCard"

const Recent = () => {
  return (
    <>
      <section className='recent padding'>
        <div className='container'>
          <Heading title='Our Services Listed' subtitle='These are the services provided by us.' />
          <RecentCard />
        </div>
      </section>
    </>
  )
}

export default Recent
