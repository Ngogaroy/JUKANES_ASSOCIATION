import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

// --- Placeholder Data ---
// In the future, we could fetch this from your database
const programsData = {
  'care-packs': {
    title: 'Care Packs & Drives',
    imageUrl: '/img/donation-1.jpg', // Use a relevant image
    description: 'Our Care Pack & Drives program is a cornerstone of our material support mission. We gather and deliver essential items like food, clothing, and hygiene products to ensure the basic needs and dignity of individuals in our partner homes are met.',
    details: [
      'Quarterly delivery of bulk food supplies.',
      'Annual clothing drives for children and adults.',
      'Distribution of "Dignity Kits" containing essential hygiene products.'
    ]
  },
  'moments-of-joy': {
    title: 'Moments of Joy Days',
    imageUrl: '/img/donation-2.jpg', // Use a relevant image
    description: "This is the heart of our 'We Keep You Smiling' mission. We conduct regular visits to children's homes and care centers to create safe, joyful spaces that restore hope, love, and belonging.",
    details: [
      'Organizing celebrations for birthdays and holidays.',
      'Engaging in fun activities like music, art, sports, and games.',
      'Providing a loving, family-like presence to remind individuals they are valued.'
    ]
  },
  'mentorship-talent': {
    title: 'Mentorship & Talent',
    imageUrl: '/img/donation-3.jpg', // Use a relevant image
    description: 'We believe in empowering the next generation. This program focuses on nurturing the skills and talents of individuals in our partner homes, providing them with the tools and confidence to build a brighter future.',
    details: [
      'One-on-one mentorship sessions with JUKANES members.',
      'Talent-spotting events to identify and support skills.',
      'Workshops on life skills, career guidance, and entrepreneurship.'
    ]
  },
  // --- Add other programs as needed ---
  'default': {
    title: 'Program Details',
    imageUrl: '/img/about.jpg',
    description: 'This program is currently under development. More details will be available soon.',
    details: ['Coming soon...']
  }
};
// --- End of Placeholder Data ---


const ProgramPage = () => {
  const { slug } = useParams(); // Gets the 'slug' from the URL (e.g., 'care-packs')
  const program = programsData[slug] || programsData['default']; // Find the program data or show default

  return (
    <>
      {/* Page Header */}
      <div className="w-full bg-[#fffacd] py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/our-work" className="text-[#20a39e] hover:text-[#1a8a86] font-semibold flex items-center mb-4">
            <FaArrowLeft className="mr-2" /> Back to Our Work
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-[#2e4057]">
            {program.title}
          </h1>
        </div>
      </div>

      {/* Program Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image */}
          <div>
            <img 
              src={program.imageUrl} 
              alt={program.title} 
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Right Column: Details (using Tailwind 'prose' for nice text styling) */}
          <div className="prose lg:prose-lg max-w-none text-[#2e4057]">
            <p className="text-lg text-[#797e88]">{program.description}</p>
            <h3 className="text-[#2e4057]">Key Activities:</h3>
            <ul>
              {program.details.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <Link 
              to="/donate" 
              className="no-underline inline-block bg-[#ff6b6b] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-80 transition-colors duration-200 mt-6"
            >
              Support This Program
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramPage;