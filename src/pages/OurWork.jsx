import React from 'react';
import ProjectCard from '../components/ProjectCard';
import { FaHandsHoldingChild } from 'react-icons/fa6';
import { FaDonate, FaHandHoldingHeart } from 'react-icons/fa'; // Correct icons

const OurWork = () => {
  const programDescription = "We’re creating programs that address urgent needs while fostering long-term solutions for sustainable change.";

  return (
    <>
      {/* Page Header */}
      <div className="w-full bg-[#fffacd] py-10 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2 text-[#2e4057]">Our Work</h1>
          <p className="text-lg text-[#797e88]">See the impact we're making together.</p>
        </div>
      </div>
    
      {/* Project Cards Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* --- ADDED SLUG PROP --- */}
          <ProjectCard 
            icon={FaDonate} 
            title="Care Packs & Drives" 
            description="Delivering essential food, clothing, and hygiene supplies." 
            slug="care-packs" 
          />
          <ProjectCard 
            icon={FaHandHoldingHeart} 
            title="Moments of Joy Days" 
            description="Restoring hope and belonging through connection." 
            slug="moments-of-joy" 
          />
          <ProjectCard 
            icon={FaHandsHoldingChild} 
            title="Mentorship & Talent" 
            description="Nurturing skills and confidence for a brighter future." 
            slug="mentorship-talent" 
          />
          {/* You can add more cards here as you create data for them in ProgramPage.jsx */}

        </div>
      </div>
    </>
  );
};

export default OurWork;