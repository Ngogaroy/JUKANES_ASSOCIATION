import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

// Add 'slug' as a new prop
const ProjectCard = ({ icon: IconComponent, title, description, slug }) => {
  const desc = description || "We’re creating programs that address urgent needs...";

  return (
    <div className="bg-[#fffacd] p-6 rounded-lg shadow-md h-full flex flex-col transition duration-300 hover:shadow-xl">
      <div className="w-20 h-20 bg-white text-[#20a39e] flex items-center justify-center rounded-lg shadow mb-5 flex-shrink-0">
        {IconComponent && <IconComponent className="text-4xl" />}
      </div>
      <h3 className="font-heading text-2xl font-bold text-[#2e4057] mb-3">{title}</h3>
      <p className="text-[#797e88] text-base mb-4 flex-grow">{desc}</p>
      
      {/* --- UPDATED LINK --- */}
      <Link
        to={`/our-work/${slug}`} // Use the slug to build the URL
        className="text-[#ffc72c] font-semibold hover:text-[#daa520] mt-auto self-start"
      >
        Read More <FaArrowRight className="inline text-xs ml-1" />
      </Link>
      {/* --- END OF UPDATE --- */}
    </div>
  );
};

export default ProjectCard;