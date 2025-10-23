import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa'; // Keep arrow icon

const ProjectCard = ({ icon: IconComponent, title, description }) => {
  const desc = description || "We’re creating programs...";

  return (
    // Card container - Use light bg, padding, no explicit border needed if using shadow
    <div className="bg-[#FDF8EA] p-6 rounded-lg shadow-md h-full flex flex-col transition duration-300 hover:shadow-xl">
      {/* Icon wrapper: Matches btn-square bg-light */}
      {/* Increased size w-20 h-20, mb-5 */}
      <div className="w-20 h-20 bg-white text-[#1A685B] flex items-center justify-center rounded-lg shadow mb-5 flex-shrink-0"> {/* Use light bg (#FDF8EA) or white? Original used bg-light */}
        {IconComponent && <IconComponent className="text-4xl" />} {/* Increased icon size */}
      </div>
      {/* Title: Matches h3 */}
      <h3 className="font-heading text-2xl font-bold text-[#051311] mb-3">{title}</h3>
      {/* Description: Matches p mb-2 */}
      <p className="text-[#797e88] text-base mb-4 flex-grow">{desc}</p> {/* Adjusted text size */}
      {/* Read More Link: Matches a */}
      <Link
        to="#!"
        className="text-[#FFAC00] font-semibold hover:underline mt-auto self-start"
      >
        Read More <FaArrowRight className="inline text-xs ml-1" />
      </Link>
    </div>
  );
};

export default ProjectCard;