import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to="/">
     < img src="./src/assets/Logo.png" alt="Logo" className="w-auto h-9" />
    </Link>
  )
}

export default Logo
