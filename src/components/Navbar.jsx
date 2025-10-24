import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaTwitter, FaFacebookF, FaYoutube, FaChevronDown } from 'react-icons/fa'; // Added FaChevronDown

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [isSticky, setIsSticky] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false); // Dropdown menu

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 90);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);
  const closeDropdown = () => setIsPagesOpen(false);

  const activeClassName = "text-white font-semibold";

  return (
    <div className={`w-full bg-[#20a39e] z-40 transition-all duration-300 ${isSticky ? 'fixed top-0 shadow-lg' : 'relative'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between bg-[#ffc72c] px-0 lg:px-4 py-2 lg:py-0 min-h-[4.5rem]">
          {/* ... (Mobile Menu Title & Button) ... */}

          <div
            className={`absolute top-full left-0 w-full bg-[#ffc72c] shadow-md lg:shadow-none lg:static lg:flex lg:items-center lg:w-auto lg:flex-grow ${isOpen ? 'block' : 'hidden'}`}
            id="navbarCollapse"
          >
            {/* Main Nav Links List */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 px-4 py-3 lg:p-0 lg:mr-auto">
              <NavLink to="/" className={({ isActive }) => `... ${isActive ? activeClassName : ""}` } onClick={closeMenu} end>Home</NavLink>
              <NavLink to="/our-work" className={({ isActive }) => `... ${isActive ? activeClassName : ""}` } onClick={closeMenu}>Service</NavLink>
              <NavLink to="/donate" className={({ isActive }) => `... ${isActive ? activeClassName : ""}` } onClick={closeMenu}>Donation</NavLink>

              {/* --- Pages Dropdown Start --- */}
              <div className="relative" onMouseLeave={() => setIsPagesOpen(false)}>
                <button
                  onClick={() => setIsPagesOpen(!isPagesOpen)}
                  onMouseEnter={() => setIsPagesOpen(true)}
                  className="flex items-center w-full lg:w-auto py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 focus:outline-none"
                >
                  Pages <FaChevronDown className="w-3 h-3 ml-1" />
                </button>
                {/* Dropdown Menu */}
                <div
                  className={`lg:absolute lg:top-full lg:left-0 mt-2 lg:mt-0 w-full lg:w-48 bg-[#fffacd] rounded-md shadow-lg z-50 ${isPagesOpen ? 'block' : 'hidden'}`}
                  onMouseLeave={() => setIsPagesOpen(false)}
                >
                  <NavLink
                    to="/about"
                    className={({ isActive }) => `block px-4 py-2 text-sm text-[#2e4057] hover:bg-[#ffc72c] ${isActive ? 'font-bold' : ''}`}
                    onClick={() => { closeMenu(); closeDropdown(); }}
                  >
                    About Us
                  </NavLink>
                   <NavLink
                    to="/transparency"
                    className={({ isActive }) => `block px-4 py-2 text-sm text-[#2e4057] hover:bg-[#ffc72c] ${isActive ? 'font-bold' : ''}`}
                    onClick={() => { closeMenu(); closeDropdown(); }}
                  >
                    Transparency
                  </NavLink>
                  {/* Add Event, Team, etc. links here later */}
                </div>
              </div>
              {/* --- Pages Dropdown End --- */}

              <NavLink to="/contact" className={({ isActive }) => `... ${isActive ? activeClassName : ""}` } onClick={closeMenu}>Contact</NavLink>
            </div>

            {/* ... (Social Icons) ... */}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;