import React, { useState, useEffect } from 'react';
// 1. Import an arrow icon
import { FaArrowUp } from 'react-icons/fa';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide button based on scroll position
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Cleanup function to remove listener when component unmounts
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Empty dependency array means effect runs only on mount and unmount

  return (
    <>
      {/* Button appears conditionally */}
      <button
        type="button"
        onClick={scrollToTop}
        // Tailwind classes:
        // fixed, bottom-5, right-5: Position bottom right
        // bg-[#FFAC00]: Use primary hex color
        // text-[#051311]: Use dark hex color for icon
        // w-12 h-12: Size (adjust as needed)
        // rounded-md: Slightly rounded corners (original was square)
        // flex items-center justify-center: Center the icon
        // shadow-lg: Add shadow
        // transition-opacity duration-300: Fade effect
        // opacity-100 / opacity-0: Control visibility with fade
        // hover:bg-opacity-80: Slight fade on hover
        // focus:outline-none focus:ring-2 focus:ring-[#FFAC00] focus:ring-offset-2: Focus styles
        className={`fixed bottom-5 right-5 bg-[#FFAC00] text-[#051311] w-12 h-12 rounded-md flex items-center justify-center shadow-lg transition-opacity duration-300 ease-in-out hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-[#FFAC00] focus:ring-offset-2 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none' // Hide visually and disable clicks
        }`}
        aria-label="Scroll back to top" // Accessibility
      >
        {/* 2. Use react-icons component */}
        <FaArrowUp className="text-xl" /> {/* Adjust icon size if needed */}
      </button>
    </>
  );
};

export default BackToTopButton;