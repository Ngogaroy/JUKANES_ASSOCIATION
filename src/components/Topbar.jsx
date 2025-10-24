import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelopeOpen, FaMapMarkerAlt } from 'react-icons/fa';

const Topbar = () => {
  return (
    // Use teal background (#20a39e)
    <div className="w-full bg-[#20a39e] text-white py-2">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Use flex, items-center, justify-between */}
        <div className="flex flex-wrap items-center justify-center lg:justify-between min-h-[4.5rem]">

          {/* Logo Section */}
          {/* On mobile (default): w-full, text-center. On large (lg): w-auto, text-left */}
          <div className="w-full text-center lg:w-auto lg:text-left mb-3 lg:mb-0">
            <Link to="/">
              <img
                src="/img/logo.svg" // Path to your logo
                alt="JUKANES Association Logo"
                className="h-12 lg:h-14 inline-block" // Use inline-block for centering
              />
            </Link>
          </div>

          {/* Contact Info Section */}
          {/* HIDDEN on mobile by default, flex on large screens */}
          <div className="hidden lg:flex w-auto">
            <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 lg:gap-x-10">

              {/* Call Us */}
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-[#ffc72c] flex items-center justify-center">
                  <FaPhoneAlt className="text-[#2e4057] text-xl" />
                </div>
                <div className="ml-3">
                  <h6 className="font-heading text-white mb-0 text-base font-semibold tracking-wide">Call Us</h6>
                  <span className="text-gray-200 text-sm">+254 7XX XXXX</span>
                </div>
              </div>

              {/* Mail Us */}
              <div className="flex items-center">
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