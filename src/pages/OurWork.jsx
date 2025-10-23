import React from 'react';
import ProjectCard from '../components/ProjectCard';
import { FaDroplet, FaHospital, FaHandsHoldingChild, FaBowlFood, FaSchoolFlag } from 'react-icons/fa6'; // Keep these from fa6
import { FaHome } from 'react-icons/fa'; // Import FaHome from fa
// import { FaHome } from 'react-icons/fa'; // If FaHome is from 'fa'

const OurWork = () => {
  const projectDescription = "...";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      {/* Main grid (using flex for breakpoint control might be closer) */}
      <div className="flex flex-wrap lg:flex-nowrap gap-12">

        {/* Title Section (Original: col-md-12 col-lg-4 col-xl-3) */}
        {/* Using flex-basis for width control */}
        <div className="w-full lg:w-1/4 xl:w-1/4 lg:flex-shrink-0"> {/* Adjusted widths */}
          {/* service-title equivalent */}
          <div>
            {/* display-6 equivalent */}
            <h1 className="text-4xl font-bold font-heading mb-4 leading-tight">
              What We Do For Those In Need.
            </h1>
             {/* fs-5 equivalent */}
            <p className="text-lg text-[#797e88] mb-0">
              We work to bring smiles...
            </p>
          </div>
        </div>

        {/* Project Cards Section (Original: col-md-12 col-lg-8 col-xl-9) */}
        {/* flex-grow handles remaining space */}
        <div className="w-full lg:flex-grow">
          {/* Grid for the cards (Original: row g-5 -> col-sm-6 col-md-4) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            {/* Render ProjectCards (ensure they are updated) */}
            <ProjectCard icon={FaDroplet} title="Pure Water" description={projectDescription}/>
            <ProjectCard icon={FaHospital} title="Health Care" description={projectDescription}/>
            <ProjectCard icon={FaHandsHoldingChild} title="Social Care" description={projectDescription}/>
            <ProjectCard icon={FaBowlFood} title="Healthy Food" description={projectDescription}/>
            <ProjectCard icon={FaSchoolFlag} title="Primary Education" description={projectDescription}/>
            <ProjectCard icon={FaHome} title="Residence Facilities" description={projectDescription}/>

          </div>
        </div>

      </div>
    </div>
  );
};

export default OurWork;