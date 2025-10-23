import React from 'react';
import { Link } from 'react-router-dom';
// Import icons if needed (e.g., FaCheck for mission points)
import { FaCheck } from 'react-icons/fa';
// Import TeamMemberCard
import TeamMemberCard from '../components/TeamMemberCard';

const About = () => {
  // Button Styles (consistent with Home.jsx)
  const btnSecondary = "inline-block bg-[#1A685B] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-80 transition-colors duration-200";

  return (
    <>
      {/* Page Header (Optional - Can create a reusable component later) */}
      <div className="w-full bg-[#FDF8EA] py-10 text-center"> {/* Light background */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2">About Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="flex justify-center space-x-2 text-[#797e88]">
              <li className="breadcrumb-item"><Link to="/" className="hover:text-[#FFAC00]">Home</Link></li>
              <li className="breadcrumb-item text-gray-500" aria-current="page">/ About Us</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Reused About Section from Home.jsx */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div><img className="w-full h-auto rounded shadow-lg" src="/img/about.jpg" alt="Volunteers working" /></div>
          <div>
              {/* Updated "About Us" Title with pseudo-element line */}
              <h2 className="inline-block text-lg font-semibold font-heading text-[#FFAC00] mb-2 relative pr-5 after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-10 after:h-0.5 after:bg-[#FFAC00] after:-translate-y-1/2">
                About Us
              </h2>
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight text-[#051311]">
                Join Hands, Change the World
              </h1>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight">Join Hands, Change the World</h1>
            <p className="mb-6 text-[#797e88]">Every hand extended in kindness brings us closer...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <h3 className="font-heading text-2xl font-semibold mb-3 text-[#051311]">Our Mission</h3>
                <p className="text-[#797e88] mb-2">Our mission is to uplift...</p>
                <p className="flex items-center text-[#051311] mb-1"><FaCheck className="text-[#FFAC00] mr-2" />No one should go hungry.</p>
                <p className="flex items-center text-[#051311] mb-1"><FaCheck className="text-[#FFAC00] mr-2" />We spread kindness.</p>
                <p className="flex items-center text-[#051311] mb-0"><FaCheck className="text-[#FFAC00] mr-2" />Change someone’s life.</p>
              </div>
              <div className="bg-[#FFAC00] p-6 text-center flex flex-col justify-center rounded">
                <p className="text-lg text-[#051311] mb-4">Through your donations...</p>
                <Link to="/donate" className={btnSecondary}>Donate Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reused Team Section from Home.jsx */}
       <div className="bg-[#FDF8EA] py-16 lg:py-24 rounded"> {/* Light background */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mx-auto max-w-lg mb-12">
              <p className="font-heading text-[#FFAC00] font-semibold mb-2">Our Team</p>
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Meet Our Dedicated Team</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Ensure TeamMemberCard uses hex codes & react-icons */}
              <TeamMemberCard imageSrc="/img/team-1.jpg" name="Boris Johnson" title="Founder & CEO" />
              <TeamMemberCard imageSrc="/img/team-2.jpg" name="Donald Pakura" title="Project Manager" />
              <TeamMemberCard imageSrc="/img/team-3.jpg" name="Alexander Bell" title="Volunteer" />
            </div>
         </div>
       </div>
    </>
  );
};

export default About;