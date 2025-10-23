import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center flex flex-col items-center">
      <FaCheckCircle className="text-green-500 text-6xl mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-[#2e4057]">
        Thank You for Your Donation!
      </h1>
      <p className="text-lg text-[#797e88] mb-8 max-w-2xl">
        Your support helps us keep smiles on vulnerable faces. We've received your donation and will send a confirmation email to you shortly.
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

export default PaymentSuccess;