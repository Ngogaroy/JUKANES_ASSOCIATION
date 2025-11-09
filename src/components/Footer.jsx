import React from 'react';
import { Link } from 'react-router-dom';
// Import icons
import { FaTwitter, FaFacebookF, FaYoutube, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    // JUKANES Dark bg (#2e4057), Light text (#fffacd or gray-300)
    <div className="w-full bg-[#2e4057] text-gray-300 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">

          {/* Column 1: Office Info */}
          <div>
            {/* JUKANES Light text (#fffacd) */}
            <h4 className="font-heading text-[#fffacd] text-xl mb-4">Our Office</h4>
            {/* JUKANES Primary text (#ffc72c) for icons */}
            <p className="mb-2 flex items-start text-gray-400">
              <FaMapMarkerAlt className="text-[#ffc72c] mr-3 mt-1 flex-shrink-0 text-lg" />
              <span>Nairobi, Kenya</span> 
            </p>
            <p className="mb-2 flex items-start text-gray-400">
              <FaPhoneAlt className="text-[#ffc72c] mr-3 mt-1 flex-shrink-0 text-lg" />
              <span>+254 748 487789</span> 
            </p>
            <p className="mb-2 flex items-start text-gray-400">
              <FaEnvelope className="text-[#ffc72c] mr-3 mt-1 flex-shrink-0 text-lg" />
              <span>jukanesassociation@gmail.com</span> 
            </p>
            {/* Social Icons - JUKANES Primary bg, Dark text */}
            <div className="flex pt-3 space-x-2">
              <a className="w-9 h-9 bg-[#ffc72c] text-[#2e4057] flex items-center justify-center rounded-full hover:bg-opacity-80 transition-opacity" href="https://x.com/Jukanes_Asso" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a className="w-9 h-9 bg-[#ffc72c] text-[#2e4057] flex items-center justify-center rounded-full hover:bg-opacity-80 transition-opacity" href="https://www.facebook.com/profile.php?id=61583451779165" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a className="w-9 h-9 bg-[#ffc72c] text-[#2e4057] flex items-center justify-center rounded-full hover:bg-opacity-80 transition-opacity" href="https://www.youtube.com/@JukanesAssociation" aria-label="YouTube">
                <FaYoutube />
              </a>
              <a className="w-9 h-9 bg-[#ffc72c] text-[#2e4057] flex items-center justify-center rounded-full hover:bg-opacity-80 transition-opacity" href="https://www.linkedin.com/in/jukanes-association-31ba65395/" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a className="w-9 h-9 bg-[#ffc72c] text-[#2e4057] flex items-center justify-center rounded-full hover:bg-opacity-80 transition-opacity" href="https://www.instagram.com/jukanes_association/" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading text-[#fffacd] text-xl mb-4">Quick Links</h4>
            <Link className="block py-1 text-gray-400 hover:text-[#fffacd] transition-colors" to="/about">About Us</Link>
            <Link className="block py-1 text-gray-400 hover:text-[#fffacd] transition-colors" to="/contact">Contact Us</Link>
            <Link className="block py-1 text-gray-400 hover:text-[#fffacd] transition-colors" to="/our-work">Our Work</Link>
            <Link className="block py-1 text-gray-400 hover:text-[#fffacd] transition-colors" to="/donate">Donate</Link>
            {/* Add Terms, Support links if needed */}
          </div>

          {/* Column 3: Business Hours (Keep or remove?) */}
          <div>
            <h4 className="font-heading text-[#fffacd] text-xl mb-4">Get Involved</h4>
            <p className="text-gray-400 mb-2">Join our mission to bring smiles.</p>
            <Link to="/donate" className="inline-block bg-[#ffc72c] text-[#2e4057] font-semibold py-2 px-4 rounded text-sm hover:bg-opacity-80 transition-colors duration-200">
              Donate Now
            </Link>
            <Link to="/contact" className="inline-block ml-2 bg-[#20a39e] text-white font-semibold py-2 px-4 rounded text-sm hover:bg-opacity-80 transition-colors duration-200">
              Volunteer
            </Link>
          </div>

          {/* Column 4: Add Tagline? */}
          <div>
            <h4 className="font-heading text-[#fffacd] text-xl mb-4">JUKANES Association</h4>
             <p className="text-gray-400 italic">"We Keep You Smiling"</p>
             {/* Maybe add Gallery back later */}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-5 mt-8">
          <div className="flex flex-col md:flex-row justify-between text-sm text-gray-400">
            <div className="text-center md:text-left mb-3 md:mb-0">
               {/* Use JUKANES colors */}
              &copy; <a className="font-semibold text-[#fffacd] hover:text-[#ffc72c]" href="#!">JUKANES Association {new Date().getFullYear()}</a>, All Right Reserved.
            </div>
             {/* Removed template credits */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;