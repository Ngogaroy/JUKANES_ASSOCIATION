import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelopeOpen, FaMapMarkerAlt } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className="w-full bg-[#20a39e] text-white py-1"> {/* Teal BG */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between min-h-[4.5rem]">
          {/* Logo Section */}
          <div className="w-auto mb-3 sm:mb-0">
            <Link to="/">
              {/* Changed Logo text to White for better contrast */}
              <img
                src="/img/logo.svg"
                alt="JUKANES Association Logo"
                className="h-12 lg:h-14 filter brightness-0 invert" // Use filter to make PNG logo white if needed
                // If using SVG, you might set fill="white"
              />
              {/* Fallback text if image fails */}
              {/* <h1 className="text-4xl lg:text-5xl font-bold font-heading text-white m-0 leading-none">
                JUKANES
              </h1> */}
            </Link>
          </div>
          {/* Contact Info Section */}
          <div className="w-auto">
            <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 lg:gap-x-10">
              {/* Call Us */}
              <div className="flex items-center">
                 {/* Yellow BG (#ffc72c), Dark Icon (#2e4057) - OK */}
                <div className="flex-shrink-0 w-12 h-12 bg-[#ffc72c] flex items-center justify-center">
                  <FaPhoneAlt className="text-[#2e4057] text-xl" />
                </div>
                <div className="ml-3">
                  {/* Yellow Title (#ffc72c) on Teal BG - Use White for better contrast */}
                  <h6 className="font-heading text-white mb-0 text-base font-semibold tracking-wide">Call Us</h6>
                  <span className="text-gray-200 text-sm">+012 345 6789</span> {/* Slightly lighter gray */}
                </div>
              </div>
              {/* Mail Us */}
              <div className="flex items-center">
                 {/* Yellow BG, Dark Icon - OK */}
                <div className="flex-shrink-0 w-12 h-12 bg-[#ffc72c] flex items-center justify-center">
                  <FaEnvelopeOpen className="text-[#2e4057] text-xl" />
                </div>
                <div className="ml-3">
                  <h6 className="font-heading text-white mb-0 text-base font-semibold tracking-wide">Mail Us</h6>
                  <span className="text-gray-200 text-sm">info@jukanes.org</span>
                </div>
              </div>
              {/* Address */}
              <div className="flex items-center">
                 {/* Yellow BG, Dark Icon - OK */}
                <div className="flex-shrink-0 w-12 h-12 bg-[#ffc72c] flex items-center justify-center">
                  <FaMapMarkerAlt className="text-[#2e4057] text-xl" />
                </div>
                <div className="ml-3">
                  <h6 className="font-heading text-white mb-0 text-base font-semibold tracking-wide">Address</h6>
                  <span className="text-gray-200 text-sm">Nairobi, Kenya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Topbar;