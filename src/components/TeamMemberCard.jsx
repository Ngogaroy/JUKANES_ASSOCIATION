import React from 'react';
// Import social icons
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'; // Assuming these are needed

const TeamMemberCard = ({ imageSrc, name, title }) => {
  return (
    // Card: White bg, shadow
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex">
      {/* Details */}
      <div className="p-5 flex-grow">
        <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-md" src={imageSrc} alt={name} />
        {/* Dark text for name */}
        <h3 className="font-heading text-2xl font-bold text-center text-[#2e4057] mb-1">{name}</h3>
        {/* Yellow text for title */}
        <p className="text-[#ffc72c] text-center font-medium">{title}</p>
      </div>
      {/* Social Links Sidebar: Light bg */}
      <div className="bg-[#fffacd] p-4 flex flex-col justify-center items-center space-y-2 flex-shrink-0 w-16">
         {/* Buttons: Yellow bg, Dark text, Teal hover bg, White hover text */}
        <a className="w-8 h-8 bg-[#ffc72c] text-[#2e4057] flex items-center justify-center rounded-full hover:bg-[#20a39e] hover:text-white transition-colors duration-200" href="#!" aria-label={`${name} Facebook`}>
          <FaFacebookF />
        </a>
        <a className="w-8 h-8 bg-[#ffc72c] text-[#2e4057] flex items-center justify-center rounded-full hover:bg-[#20a39e] hover:text-white transition-colors duration-200" href="#!" aria-label={`${name} Twitter`}>
          <FaTwitter />
        </a>
        <a className="w-8 h-8 bg-[#ffc72c] text-[#2e4057] flex items-center justify-center rounded-full hover:bg-[#20a39e] hover:text-white transition-colors duration-200" href="#!" aria-label={`${name} Instagram`}>
          <FaInstagram />
        </a>
         {/* Add other social links like YouTube if needed */}
         {/* <a className="w-8 h-8 bg-[#ffc72c] text-[#2e4057] flex items-center justify-center rounded-full hover:bg-[#20a39e] hover:text-white transition-colors duration-200" href="#!" aria-label={`${name} Youtube`}>
            <FaYoutube />
         </a> */}
      </div>
    </div>
  );
};

export default TeamMemberCard;