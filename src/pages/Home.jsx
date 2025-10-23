import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DonationCauseCard from '../components/DonationCauseCard';
import TeamMemberCard from '../components/TeamMemberCard';
// Import icons (ensure correct fa vs fa6 paths)
import { FaCheck, FaStar, FaQuoteRight } from 'react-icons/fa';
import { FaUsers, FaAward, FaListCheck, FaComments } from 'react-icons/fa6';

const Home = () => {
  // Video Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoUrl = 'https://www.youtube.com/embed/DWRcNpR6Kdc'; // Replace with JUKANES video if available
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Button Styles using JUKANES hex codes
  const btnPrimary = "inline-block bg-[#ffc72c] text-[#2e4057] font-semibold py-3 px-6 rounded hover:bg-opacity-80 transition-colors duration-200"; // Yellow bg, Dark text
  const btnSecondary = "inline-block bg-[#20a39e] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-80 transition-colors duration-200"; // Teal bg, White text
  const btnAccent = "inline-block bg-[#ff6b6b] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-80 transition-colors duration-200"; // Coral bg, White text

  return (
    <>
      {/* */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            {/* JUKANES Vision */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 leading-tight text-[#2e4057]">
              A world where every vulnerable person feels seen, valued, and deeply loved.
            </h1>
            {/* JUKANES Mission */}
            <p className="text-lg text-[#797e88] mb-8">
              To bring emotional, spiritual, and material support to vulnerable individuals by creating safe, joyful spaces that restore hope, love, and belonging as they connect with the outside world.
            </p>
            <div className="flex flex-wrap gap-4">
               {/* Use Accent color for primary action? */}
              <Link to="/donate" className={btnAccent}>Support Our Mission</Link>
              <Link to="/contact" className={btnSecondary}>Get Involved</Link>
            </div>
          </div>
          {/* Image */}
          <div className="mt-10 lg:mt-0">
             {/* Replace with a relevant JUKANES image */}
            <img className="w-full h-auto rounded shadow-lg" src="/img/carousel-1.jpg" alt="JUKANES beneficiaries smiling" />
          </div>
        </div>
      </div>
      {/* */}

      {/* */}
      <div className="w-full bg-[#ffc72c] mb-16 lg:mb-24"> {/* Primary Yellow BG */}
        <div className="container mx-auto px-0">
          <div className="flex">
            <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex items-center">
              <button
                type="button"
                className="btn-play flex-shrink-0 w-16 h-16 bg-white rounded-full flex items-center justify-center mr-6 shadow-lg hover:scale-110 transition-transform duration-200"
                onClick={openModal} aria-label="Play video"
              >
                <svg className="w-8 h-8 text-[#20a39e] ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg> {/* Teal Icon */}
              </button>
              <h3 className="font-heading text-xl md:text-2xl text-[#2e4057] font-semibold mb-0"> {/* Dark Text */}
                See how we keep you smiling. {/* Updated Text */}
              </h3>
            </div>
            <div className="hidden lg:flex w-20 bg-[#20a39e] items-center justify-center flex-shrink-0"> {/* Teal BG */}
              <span className="text-white text-sm transform -rotate-90 whitespace-nowrap">Scroll Down</span>
            </div>
          </div>
        </div>
      </div>
      {/* */}

      {/* --- Video Modal --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-3xl mx-4 bg-white rounded overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <iframe
                className="w-full h-96"
                src={videoUrl}
                title="JUKANES Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 flex justify-end">
              <button
                onClick={closeModal}
                className="inline-block bg-[#20a39e] text-white font-semibold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- Video Modal End --- */}

      {/* */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div><img className="w-full h-auto rounded shadow-lg" src="/img/about.jpg" alt="JUKANES members together" /></div> {/* Replace image */}
          <div>
            {/* Title with line */}
            <h2 className="inline-block text-lg font-semibold font-heading text-[#ffc72c] mb-2 relative pr-5 after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-10 after:h-0.5 after:bg-[#ffc72c] after:-translate-y-1/2">
              About Us
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight text-[#2e4057]">
              A Family Bound By Purpose
            </h1>
            <p className="mb-6 text-[#797e88]">
              JUKANES Association is more than a group of friends — it is a family bound by purpose, values, and vision. Formed to foster lifelong bonds, we exist not only to strengthen our members but also to impact the lives of the disadvantaged in society. Rooted in values of unity, service, and resilience... {/* Shortened */}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <h3 className="font-heading text-2xl font-semibold mb-3 text-[#2e4057]">Our Philosophy</h3>
                <p className="text-[#797e88] mb-2">
                   Members benefit by belonging. Society benefits by our giving. {/* Simplified */}
                </p>
                {/* Core Values could go here instead of mission points */}
                <p className="flex items-center text-[#2e4057] mb-1"><FaCheck className="text-[#ffc72c] mr-2" />Unity</p>
                <p className="flex items-center text-[#051311] mb-1"><FaCheck className="text-[#ffc72c] mr-2" />Integrity</p>
                <p className="flex items-center text-[#051311] mb-0"><FaCheck className="text-[#ffc72c] mr-2" />Service</p>
                {/* Add Innovation, Excellence if space permits */}
              </div>
               {/* CTA block */}
              <div className="bg-[#ffc72c] p-6 text-center flex flex-col justify-center rounded">
                <p className="text-lg text-[#2e4057] mb-4">Join us in creating a cycle of shared joy and purpose.</p>
                <Link to="/contact" className={btnSecondary}>Get Involved</Link> {/* Link to Contact */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* */}


      {/* --- Rest of the sections (Features, Donation Causes, Team, Testimonial) --- */}
      {/* These sections should already be using the JUKANES hex codes */}
      {/* Review text content if needed, e.g., update Stat titles/numbers */}

       {/* */}
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
         {/* ... Stats Grid ... */}
         {/* ... "Why Us!" Text (Update based on "Why JUKANES Matters") ... */}
         <div>
            <p className="font-heading text-[#ffc72c] font-semibold mb-2">Why JUKANES Matters</p>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight text-[#2e4057]">Restoring Hope, Leaving a Legacy</h1>
            <p className="mb-6 text-[#797e88]">For Members: A home of friends, growth, and strength. For Society: A reminder that love exists and transformation can start with small, consistent acts.</p>
            <p className="flex items-center text-[#2e4057] mb-2"><FaCheck className="text-[#ffc72c] mr-2" />Dignity is not a privilege, it’s a right.</p>
            <p className="flex items-center text-[#2e4057] mb-2"><FaCheck className="text-[#ffc72c] mr-2" />True service is presence, not leftovers.</p>
            <p className="flex items-center text-[#2e4057] mb-4"><FaCheck className="text-[#ffc72c] mr-2" />Together, we restore hope.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/donate" className={btnPrimary}>Donate Now</Link>
              <Link to="/contact" className={btnSecondary}>Volunteer</Link>
            </div>
         </div>
       </div>
       {/* */}

      {/* */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mx-auto max-w-lg mb-12">
           <p className="font-heading text-[#ffc72c] font-semibold mb-2">Our Impact</p>
           <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">How Your Support Helps</h1> {/* Updated Title */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Update props if causes change */}
          <DonationCauseCard imageSrc="/img/donation-1.jpg" tag="Support" title="Care Packs & Drives" raised="XX%" goal="Target" percentage="XX"/>
          <DonationCauseCard imageSrc="/img/donation-2.jpg" tag="Joy" title="Moments of Joy Days" raised="XX%" goal="Target" percentage="XX"/>
          <DonationCauseCard imageSrc="/img/donation-3.jpg" tag="Mentorship" title="Mentorship & Talent" raised="XX%" goal="Target" percentage="XX"/>
        </div>
      </div>
      {/* */}

       {/* */}
       <div className="bg-[#fffacd] py-16 lg:py-24 rounded"> {/* Light BG */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mx-auto max-w-lg mb-12">
              <p className="font-heading text-[#ffc72c] font-semibold mb-2">Our Family</p> {/* Updated */}
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Meet Our Members</h1> {/* Updated */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Replace with actual team members later */}
              <TeamMemberCard imageSrc="/img/team-1.jpg" name="Member 1" title="Role/Contribution" />
              <TeamMemberCard imageSrc="/img/team-2.jpg" name="Member 2" title="Role/Contribution" />
              <TeamMemberCard imageSrc="/img/team-3.jpg" name="Member 3" title="Role/Contribution" />
            </div>
         </div>
       </div>
       {/* */}

       {/* */}
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1">
               <h1 className="text-4xl font-bold font-heading mb-4">Voices From Our Community</h1> {/* Updated */}
               <p className="text-lg text-[#797e88]">Hear about the impact we make together.</p> {/* Updated */}
            </div>
            <div className="lg:col-span-2">
              {/* Update with actual testimonial */}
              <div className="bg-[#fffacd] p-8 rounded shadow-lg"> {/* Light BG */}
                 <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-1/3 flex-shrink-0">
                      <img className="w-full h-auto rounded-lg shadow-md" src="/img/testimonial-1.jpg" alt="Testimonial person"/>
                    </div>
                    <div className="md:w-2/3">
                      <div className="mb-3 text-[#ffc72c] flex space-x-1"> {/* Yellow Stars */}
                        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                      </div>
                      <p className="text-lg text-[#797e88] italic mb-6">"JUKANES brought so much joy... their presence made us feel truly seen and loved."</p> {/* Example */}
                      <div className="flex items-center">
                         <div className="w-16 h-16 bg-white text-[#20a39e] flex items-center justify-center rounded-full shadow mr-4 flex-shrink-0"> {/* Teal Quote Icon */}
                            <FaQuoteRight className="text-2xl" />
                         </div>
                         <div>
                            <h5 className="font-heading text-xl font-semibold text-[#2e4057] mb-0">Beneficiary/Partner Name</h5> {/* Dark Name */}
                            <span className="text-[#797e88]">Role/Center</span>
                         </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
       </div>
       {/* */}
    </>
  );
};

export default Home;