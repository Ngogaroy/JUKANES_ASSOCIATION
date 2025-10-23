import React, { useState } from 'react';
// 1. Import an icon for the submit button
import { FaPaperPlane } from 'react-icons/fa';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: Log email or send to an API later
    console.log('Newsletter signup:', email);
    alert(`Thank you for subscribing, ${email}! (Logged to console)`);
    setEmail(''); // Clear input
  };

  return (
    <>
      {/* Newsletter Start - Use JUKANES Primary BG */}
      <div className="w-full bg-[#ffc72c] py-16 mt-16 lg:mt-24"> {/* Yellow BG */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {/* Limit width, center text */}
            <div className="w-full max-w-lg text-center">
              {/* Use JUKANES Dark text */}
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-[#2e4057]">
                Subscribe to Our Newsletter
              </h2>
              <p className="mb-6 text-[#2e4057] opacity-90"> {/* Slightly less emphasis */}
                Stay updated on our activities, impact stories, and ways to get involved.
              </p>
              {/* Form */}
              <form onSubmit={handleSubmit} className="relative w-full mb-2">
                <label htmlFor="newsletter-email" className="sr-only">Your Email</label>
                <input
                  id="newsletter-email"
                  className="w-full pl-4 pr-16 py-4 border-none rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#20a39e] placeholder-gray-500" // Teal focus ring
                  type="email"
                  placeholder="Enter Your Email"
                  style={{ height: '60px' }} // Keep specific height from original
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {/* Submit Button positioned absolutely */}
                <button
                  type="submit"
                  // Style matches original: Square, shadow-none, positioned top-right
                  // Uses JUKANES Secondary BG, White icon
                  className="absolute top-0 end-0 mt-[0.5rem] mr-[0.5rem] w-12 h-12 bg-[#20a39e] text-white flex items-center justify-center rounded hover:bg-opacity-80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#20a39e] focus:ring-offset-2"
                  aria-label="Subscribe"
                >
                  {/* 2. Use react-icon */}
                  <FaPaperPlane className="text-xl" />
                </button>
              </form>
              {/* Use JUKANES Dark text */}
              <p className="text-sm text-[#2e4057] opacity-75 mb-0">
                We respect your privacy and won't spam you.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Newsletter End */}
    </>
  );
};

export default Newsletter;