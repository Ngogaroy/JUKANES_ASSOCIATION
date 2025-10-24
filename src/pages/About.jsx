import React from 'react';
import { Link } from 'react-router-dom';
import TeamMemberCard from '../components/TeamMemberCard';
// 1. Import icons (Corrected: FaCheck is only imported once)
import { FaUsers, FaLightbulb, FaRocket, FaHandHoldingHeart, FaLeaf } from 'react-icons/fa6';
import { FaCheck, FaProjectDiagram, FaSearch } from 'react-icons/fa';

const About = () => {
  // Button Styles
  const btnSecondary = "inline-block bg-[#1A685B] text-white font-semibold py-2 px-4 rounded hover:bg-opacity-90 transition-colors duration-200 self-center";

  return (
    <>
      {/* Page Header */}
      <div className="w-full bg-[#fffacd] py-10 text-center"> {/* Light BG */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2 text-[#2e4057]">About Us</h1>
          <nav aria-label="breadcrumb">
            <ol className="flex justify-center space-x-2 text-[#797e88]">
              <li className="breadcrumb-item"><Link to="/" className="hover:text-[#ffc72c]">Home</Link></li>
              <li className="breadcrumb-item text-gray-500" aria-current="page">/ About Us</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div><img className="w-full h-auto rounded shadow-lg" src="/img/about.jpg" alt="JUKANES members" /></div>
          <div>
            {/* "About Us" Title with line */}
            <h2 className="inline-block text-lg font-semibold font-heading text-[#ffc72c] mb-2 relative pr-5 after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-10 after:h-0.5 after:bg-[#ffc72c] after:-translate-y-1/2">
              About Us
            </h2>
            {/* Main Heading - Updated Content */}
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight text-[#2e4057]">
              A Family Bound By Purpose
            </h1>
            {/* Updated Content */}
            <p className="mb-6 text-[#797e88]">
              JUKANES Association is more than a group of friends — it is a family bound by purpose, values, and vision. Formed to foster lifelong bonds, we exist not only to strengthen our members but also to impact the lives of the disadvantaged in society.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                {/* Updated to Core Values */}
                <h3 className="font-heading text-2xl font-semibold mb-3 text-[#2e4057]">Our Core Values</h3>
                <p className="flex items-center text-[#2e4057] mb-1"><FaCheck className="text-[#ffc72c] mr-2" />Unity</p>
                <p className="flex items-center text-[#2e4057] mb-1"><FaCheck className="text-[#ffc72c] mr-2" />Integrity</p>
                <p className="flex items-center text-[#2e4057] mb-1"><FaCheck className="text-[#ffc72c] mr-2" />Service</p>
                <p className="flex items-center text-[#2e4057] mb-0"><FaCheck className="text-[#ffc72c] mr-2" />Excellence</p>
              </div>
              {/* CTA Block */}
              <div className="bg-[#ffc72c] p-6 text-center flex flex-col justify-center rounded">
                <p className="text-lg text-[#2e4057] mb-4">Join us in creating a cycle of shared joy and purpose.</p>
                <Link to="/donate" className={btnSecondary}>Donate Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JUKANES Pillars Section */}
      <div className="py-16 lg:py-24 bg-white"> {/* White BG */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mx-auto max-w-lg mb-12">
            <p className="font-heading text-[#ffc72c] font-semibold mb-2">What We Stand For</p>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-[#2e4057]">Our Pillars</h1>
          </div>
          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6 text-center">
            {/* Pillar 1: Journey */}
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-[#fffacd] text-[#20a39e] flex items-center justify-center rounded-full mb-4">
                <FaUsers className="text-3xl" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">Journey</h3>
              <p className="text-sm text-[#797e88]">Walking through life together.</p>
            </div>
            {/* Pillar 2: Unity */}
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-[#fffacd] text-[#20a39e] flex items-center justify-center rounded-full mb-4">
                <FaHandHoldingHeart className="text-3xl" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">Unity</h3>
              <p className="text-sm text-[#797e88]">Building inclusivity and belonging.</p>
            </div>
            {/* Pillar 3: Knowledge */}
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-[#fffacd] text-[#20a39e] flex items-center justify-center rounded-full mb-4">
                <FaLightbulb className="text-3xl" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">Knowledge</h3>
              <p className="text-sm text-[#797e88]">Learning and growing together.</p>
            </div>
            {/* Pillar 4: Adventure */}
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-[#fffacd] text-[#20a39e] flex items-center justify-center rounded-full mb-4">
                <FaSearch className="text-3xl" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">Adventure</h3>
              <p className="text-sm text-[#797e88]">Embracing fun and exploration.</p>
            </div>
            {/* Pillar 5: Networking */}
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-[#fffacd] text-[#20a39e] flex items-center justify-center rounded-full mb-4">
                <FaProjectDiagram className="text-3xl" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">Networking</h3>
              <p className="text-sm text-[#797e88]">Expanding circles and opportunities.</p>
            </div>
            {/* Pillar 6: Empowerment */}
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-[#fffacd] text-[#20a39e] flex items-center justify-center rounded-full mb-4">
                <FaRocket className="text-3xl" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">Empowerment</h3>
              <p className="text-sm text-[#797e88]">Supporting one another to grow.</p>
            </div>
            {/* Pillar 7: Synergy */}
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-[#fffacd] text-[#20a39e] flex items-center justify-center rounded-full mb-4">
                <FaLeaf className="text-3xl" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">Synergy</h3>
              <p className="text-sm text-[#797e88]">Harnessing our collective strength.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section - Updated Content */}
       <div className="bg-[#fffacd] py-16 lg:py-24 rounded"> {/* Light BG */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mx-auto max-w-lg mb-12">
              <p className="font-heading text-[#ffc72c] font-semibold mb-2">Our Family</p>
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-[#2e4057]">Meet Our Members</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Ensure TeamMemberCard uses hex codes & react-icons */}
              <TeamMemberCard imageSrc="/img/team-1.jpg" name="Member 1" title="JUKANES Family" />
              <TeamMemberCard imageSrc="/img/team-2.jpg" name="Member 2" title="JUKANES Family" />
              <TeamMemberCard imageSrc="/img/team-3.jpg" name="Member 3" title="JUKANES Family" />
            </div>
         </div>
       </div>
    </>
  );
};

export default About;