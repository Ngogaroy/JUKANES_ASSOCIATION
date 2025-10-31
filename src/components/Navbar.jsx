import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
// Import icons
import { FaTwitter, FaFacebookF, FaYoutube, FaChevronDown } from 'react-icons/fa';

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

  const activeClassName = "text-white font-semibold"; // Active link style

  return (
    // Sticky container - JUKANES Secondary color
    <div className={`w-full bg-[#20a39e] z-40 transition-all duration-300 ${isSticky ? 'fixed top-0 shadow-lg' : 'relative'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Inner Nav bar - JUKANES Primary color */}
        <nav className="flex items-center justify-between bg-[#ffc72c] px-0 lg:px-4 py-2 lg:py-0 min-h-[4.5rem]">

          {/* Mobile Menu Title */}
          <h4 className="lg:hidden font-heading text-[#2e4057] text-lg font-semibold m-0 pl-4">Menu</h4>

          {/* Mobile Menu Button */}
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

          {/* Collapsible container */}
          <div
            className={`absolute top-full left-0 w-full bg-[#ffc72c] shadow-md lg:shadow-none lg:static lg:flex lg:items-center lg:w-auto lg:flex-grow ${isOpen ? 'block' : 'hidden'}`}
            id="navbarCollapse"
          >
            {/* Main Nav Links List */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 px-4 py-3 lg:p-0 lg:mr-auto">
              <NavLink
                to="/"
                className={({ isActive }) => `block lg:inline-block py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 ${isActive ? activeClassName : ""}` }
                onClick={closeMenu}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/our-work"
                className={({ isActive }) => `block lg:inline-block py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 ${isActive ? activeClassName : ""}` }
                onClick={closeMenu}
              >
                Our Work
              </NavLink>
              <NavLink
                to="/donate"
                className={({ isActive }) => `block lg:inline-block py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 ${isActive ? activeClassName : ""}` }
                onClick={closeMenu}
              >
                Donation
              </NavLink>

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
                  <NavLink
                    to="/blog"
                    className={({ isActive }) => `block px-4 py-2 text-sm text-[#2e4057] hover:bg-[#ffc72c] ${isActive ? 'font-bold' : ''}`}
                    onClick={() => { closeMenu(); closeDropdown(); }}
                  >
                    Blog
                  </NavLink>
                </div>
              </div>
              {/* --- Pages Dropdown End --- */}

              <NavLink
                to="/contact"
                className={({ isActive }) => `block lg:inline-block py-2 font-medium text-[#2e4057] hover:text-white transition-colors duration-200 ${isActive ? activeClassName : ""}` }
                onClick={closeMenu}
              >
                Contact
              </NavLink>
            </div>

            {/* Social Icons */}
            <div className="hidden lg:flex items-center lg:ml-10 space-x-2 p-4 lg:p-0 border-t border-[#20a39e] lg:border-none mt-3 lg:mt-0">
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