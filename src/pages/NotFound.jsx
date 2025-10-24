import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center flex flex-col items-center">
      <FaExclamationTriangle className="text-red-500 text-6xl mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-[#2e4057]">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-[#797e88] mb-8 max-w-2xl">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="inline-block bg-[#20a39e] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-80 transition-colors duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;