import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation variants for a simple fade-in-up effect
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const HeroSection = () => {
  // Using your button styles
  const btnAccent = "inline-block bg-[#ff6b6b] text-white font-semibold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-colors duration-200 shadow-md hover:shadow-lg";
  const btnGhost = "inline-block bg-transparent border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200";

  return (
    <section className="bg-white"> {/* Or a very light gray like bg-gray-50 */}
      <div className="container mx-auto px-6 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* 1. Text Content (Takes 60% width on large screens) */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 font-heading mb-6"
            >
              Empowering communities, one life at a time.
            </motion.h1>
            
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 mb-8"
            >
              We are dedicated to providing sustainable solutions for education,
              health, and economic opportunity to those who need it most.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
            >
              <Link to="/donate" className={btnAccent}>
                Donate Now
              </Link>
              <Link to="/get-involved" className={btnGhost}>
                Learn More
              </Link>
            </motion.div>
          </div>
          
          {/* 2. Image (Takes 40% width on large screens) */}
          <div className="w-full lg:w-2/5">
            <motion.img
              src="./public/img/carousel-1.jpg" // TODO: Replace with your image
              alt="Happy children in a community program"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-2xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;