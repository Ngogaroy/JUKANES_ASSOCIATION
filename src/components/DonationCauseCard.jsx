import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; // Icon for button

const DonationCauseCard = ({
  imageSrc, tag, title, description, raised, goal, percentage,
}) => {
  const desc = description || "Join us in making a difference in the lives of vulnerable individuals."; // Updated default description

  return (
    <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col h-full bg-white p-4">
      <div className="flex">
        {/* Progress Bar */}
        <div className="flex flex-col items-center text-center mr-4 flex-shrink-0 w-16">
          <h6 className="text-sm font-semibold text-[#797e88] mb-0">Raised</h6>
          <span className="text-lg font-bold text-[#2e4057] mb-1">{raised}</span> {/* Dark text */}
          <div className="relative w-4 h-32 bg-gray-200 rounded-full overflow-hidden mb-1">
            <div
              className="absolute bottom-0 left-0 w-full bg-[#20a39e] transition-all duration-500" // Teal progress
              style={{ height: `${percentage}%` }}
              role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100"
            ></div>
             <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white mix-blend-difference">
               {percentage}%
             </span>
          </div>
          <h6 className="text-sm font-semibold text-[#797e88] mb-0">Goal</h6>
          <span className="text-base font-medium text-[#2e4057]">{goal}</span> {/* Dark text */}
        </div>

        {/* Details */}
        <div className="flex-grow">
          <div className="relative mb-4">
            <img className="w-full h-40 object-cover rounded" src={imageSrc} alt={title} />
             {/* Teal tag */}
            <div className="absolute top-2 right-2 bg-[#20a39e] text-white text-xs font-semibold px-2 py-1 rounded">
              {tag}
            </div>
          </div>
          {/* Dark title, Yellow hover */}
          <Link to="/donate" className="text-xl font-bold font-heading text-[#2e4057] hover:text-[#ffc72c] mb-2 inline-block">{title}</Link>
          <p className="text-[#797e88] text-sm mb-4">{desc}</p> {/* Gray text */}
          {/* Yellow button, Dark text */}
          <Link to="/donate" className="w-full bg-[#ffc72c] text-[#2e4057] font-semibold py-2 px-4 rounded text-center block hover:bg-opacity-80 transition-colors duration-200">
            <FaPlus className="inline mr-2 mb-1" /> Donate Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonationCauseCard;