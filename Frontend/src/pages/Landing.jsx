import React from 'react'
import Navbar from '../components/Landing/Navbar'
import Hero from '../components/Landing/Hero'
import BackToTop from '../components/Landing/BackToTop'
import Features from '../components/Landing/Features'
import Workflow from '../components/Landing/Workflow'
import HiringSteps from '../components/Landing/Hiringsteps'
import Keeptrack from '../components/Landing/Keeptrack'
import Testimonials from '../components/Landing/Testimonials'
import Darkmode from '../components/Landing/Darkmode'
import Pricing from '../components/Landing/Pricing'
import Footer from '../components/Landing/Footer'

export default function Landing() {
  return (
    <div className="m-2 flex flex-col gap-2 bg-white">
      <Navbar/>
      <Hero/>
      <BackToTop/>
      <Features/>
      <Workflow/>
      <HiringSteps/>
      <Keeptrack/>
      <Testimonials/>
      <Darkmode/>
      <Pricing/>
      <Footer/>
    </div>
  )
}
