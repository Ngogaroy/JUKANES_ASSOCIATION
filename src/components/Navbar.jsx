import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaYoutube } from 'react-icons/fa'; // Icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 90);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  // Active link style: White text and slightly bolder/semibold
  const activeClassName = "text-white font-semibold";

  return (
    // Sticky container - JUKANES Secondary color (#20a39e)
    <div className={`w-full bg-[#20a39e] z-40 transition-all duration-300 ${isSticky ? 'fixed top-0 shadow-lg' : 'relative'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Inner Nav bar - JUKANES Primary color (#ffc72c) */}
        <nav className="flex items-center justify-between bg-[#ffc72c] px-0 lg:px-4 py-2 lg:py-0 min-h-[4.5rem]">

          {/* Mobile Menu Title - JUKANES Dark color (#2e4057) */}
          <h4 className="lg:hidden font-heading text-[#2e4057] text-lg font-semibold m-0 pl-4">Menu</h4>

          {/* Mobile Menu Button - JUKANES Dark text, Secondary hover bg */}
          <button
            type="button"
            className="lg:hidden text-[#2e4057] p-2 rounded hover:bg-[#20a39e] hover:text-white focus:outline-none mr-4"
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="navbarCollapse"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">{isOpen ? ( <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/> ) : ( <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/> )}</svg>
          </button>

          {/* Collapsible container - JUKANES Primary bg */}
          <div
            className={`absolute top-full left-0 w-full bg-[#ffc72c] shadow-md lg:shadow-none lg:static lg:flex lg:items-center lg:w-auto lg:flex-grow ${isOpen ? 'block' : 'hidden'}`}
            id="navbarCollapse"
          >
            {/* Main Nav Links List - JUKANES Dark text */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 px-4 py-3 lg:p-0 lg:mr-auto">
              <NavLink to="/" className={({ isActive }) => `block lg:inline-block py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 ${isActive ? activeClassName : ""}` } onClick={closeMenu} end>Home</NavLink>
              <NavLink to="/about" className={({ isActive }) => `block lg:inline-block py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 ${isActive ? activeClassName : ""}` } onClick={closeMenu}>About</NavLink>
              <NavLink to="/our-work" className={({ isActive }) => `block lg:inline-block py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 ${isActive ? activeClassName : ""}` } onClick={closeMenu}>Our Services</NavLink>
              <NavLink to="/donate" className={({ isActive }) => `block lg:inline-block py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 ${isActive ? activeClassName : ""}` } onClick={closeMenu}>Donation</NavLink>
              {/* Add Pages Dropdown later */}
              <NavLink to="/contact" className={({ isActive }) => `block lg:inline-block py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 ${isActive ? activeClassName : ""}` } onClick={closeMenu}>Contact</NavLink>
            </div>

            {/* Social Icons (Desktop only) - JUKANES Dark bg */}
            <div className="hidden lg:flex items-center lg:ml-10 space-x-2 p-4 lg:p-0 border-t border-[#20a39e] lg:border-none mt-3 lg:mt-0"> {/* JUKANES Secondary border */}
              <a className="w-10 h-10 bg-[#2e4057] text-white flex items-center justify-center hover:bg-opacity-80 transition-opacity" href="#!" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a className="w-10 h-10 bg-[#2e4057] text-white flex items-center justify-center hover:bg-opacity-80 transition-opacity" href="#!" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a className="w-10 h-10 bg-[#2e4057] text-white flex items-center justify-center hover:bg-opacity-80 transition-opacity" href="#!" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;