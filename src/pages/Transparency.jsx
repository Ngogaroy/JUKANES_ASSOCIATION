import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartPie, FaCheckCircle, FaHandHoldingUsd } from 'react-icons/fa'; // Icons

const Transparency = () => {
  return (
    <>
      {/* Page Header */}
      <div className="w-full bg-[#fffacd] py-10 text-center"> {/* Light BG */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-2 text-[#2e4057]">Transparency</h1>
          <nav aria-label="breadcrumb">
            <ol className="flex justify-center space-x-2 text-[#797e88]">
              <li className="breadcrumb-item"><Link to="/" className="hover:text-[#ffc72c]">Home</Link></li>
              <li className="breadcrumb-item text-gray-500" aria-current="page">/ Transparency</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Contribution Model Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div>
            <h2 className="inline-block text-lg font-semibold font-heading text-[#ffc72c] mb-2 relative pr-5 after:content-[''] after:absolute after:right-0 after:top-1/2 after:w-10 after:h-0.5 after:bg-[#ffc72c] after:-translate-y-1/2">
              Our Model
            </h2>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight text-[#2e4057]">
              Our Contribution Model (25-50-25)
            </h1>
            <p className="text-lg text-[#797e88] mb-6">
              Every contribution advances you, the community, and sustainable impact. We are committed to full transparency.
            </p>
            {/* Model Breakdown */}
            <div className="space-y-6">
              {/* 25% Member Savings */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#fffacd] text-[#2e4057] flex items-center justify-center rounded-full mr-4">
                  <FaHandHoldingUsd className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">25% — Member Savings (with interest)</h3>
                  <p className="text-[#797e88]">Pooled into a savings pot that earns interest. Benefits: financial discipline, safety net, and access to future member benefits.</p>
                </div>
              </div>
              {/* 50% Direct Donations */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#fffacd] text-[#20a39e] flex items-center justify-center rounded-full mr-4">
                  <FaChartPie className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">50% — Direct Donations (Compassion in Action)</h3>
                  <p className="text-[#797e88]">Goes directly to outreach activities, essentials, and program delivery. Benefits: clear and immediate impact.</p>
                </div>
              </div>
              {/* 25% Sustainability */}
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#fffacd] text-[#ff6b6b] flex items-center justify-center rounded-full mr-4">
                  <FaCheckCircle className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#2e4057] mb-1">25% — Sustainability Projects (Long-term Support)</h3>
                  <p className="text-[#797e88]">Invested in specific centers’ projects (e.g., poultry units, laundry facilities). Benefits: long-lasting solutions and reduced dependency.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image/Graphic */}
          <div className="mt-10 lg:mt-0">
            {/* You could replace this with an actual pie chart graphic */}
            <img className="w-full h-auto rounded shadow-lg" src="/img/donation-2.jpg" alt="Community impact" /> 
          </div>
        </div>
      </div>
    </>
  );
};

export default Transparency;