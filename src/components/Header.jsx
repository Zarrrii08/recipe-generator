import React from 'react'
import './navbar.css'
import Logo from '../assets/chief-svgrepo-com.svg'
const navbar = () => {
  return (
    <div className='py-[12px] bg-slate-300'>
      <ul className='flex list-none items-center gap-[20px] justify-center'>
        <li className=''>
        <img src={Logo} alt="" width='30px' />
          </li>
        <li className='font-mono font-bold'>Z-Cheif</li>
      </ul>
    </div>
  )
}

export default navbar
