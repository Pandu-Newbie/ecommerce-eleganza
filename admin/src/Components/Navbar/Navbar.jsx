import React from 'react'
import './Navbar.css'
import navLogo from '../../assets/logo-crown.png'
import navProfile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={navLogo} alt="" className="nav-logo" />
        <img src={navProfile} alt="" className="nav-profile" />
    </div>
  )
}

export default Navbar