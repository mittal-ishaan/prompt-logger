"use client";
import React, { useContext } from 'react'
import Link from 'next/link'
import { useState } from 'react';
import LogoutButton from './logout';
import HomeContext, { HomeContextType } from '@/context/HomeContext';

// Functional component for rendering the Navbar
export default function NavbarComponent() {
  const {auth} = useContext<HomeContextType>(HomeContext);

  const [isNavbarVisible, setIsNavbarVisible] = useState(false);


  const handleToggleNavbar = () => {
    setIsNavbarVisible((prevState) => !prevState);
  };

  return (
    <nav className="bg-white border-gray-200 shadow-lg border-2">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2 md:p-4 md:overflow-visible h-min md:max-h-20 ">
        <span className="block py-2 px-3 text-gray-500 rounded">Hello {auth?.username}</span>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="">
              <LogoutButton/>
          </div>
          <button onClick={handleToggleNavbar} data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-user" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
<div className={`${isNavbarVisible ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-user">
          <ul className="flex flex-col text-lg font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <Link href="/" className="block py-2 px-3 text-gray-400 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-500 md:p-0" aria-current="page">Chat</Link>
            </li>
            <li>
              <Link href="/dashboard" className="block py-2 px-3 text-gray-400 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-500 md:p-0">Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}