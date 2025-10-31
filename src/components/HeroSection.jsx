import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// 1. Import Swiper (including Navigation and Pagination)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

const HeroSection = () => {
  // Button Styles
  const btnAccent = "inline-block bg-[#ff6b6b] text-white font-semibold py-3 px-6 rounded hover:bg-opacity-80 transition-colors duration-200";
  // The 'Get Involved' button is now a ghost button with a white border
  const btnGhost = "inline-block bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded hover:bg-white hover:text-[#2e4057] transition-colors duration-200";

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] lg:h-[80vh] overflow-hidden">
      <Swiper
        // 2. Add ALL modules
        modules={[Navigation, Autoplay, EffectFade, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        navigation={true} // <-- Show navigation arrows
        pagination={{ clickable: true }} // <-- Show pagination dots
        className="w-full h-full relative hero-swiper" // Custom class for styling
      >
        {/* Slide 1 - Using an Image */}
        <SwiperSlide>
          <div className="relative w-full h-full flex items-center justify-center text-center">
            {/* TODO: Replace '/img/carousel-1.jpg' with your actual hero image */}
            <img src="/img/carousel-1.jpg" alt="JUKANES children smiling" className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover" />
            <div className="absolute inset-0 z-10 bg-black/40"></div> {/* Dark overlay */}
            
            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-white">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading mb-6"
              >
                A world where every vulnerable person feels seen, valued, and loved.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl max-w-3xl mx-auto mb-8"
              >
                We are a family, not just an NGO. We bring emotional, spiritual, and material support to vulnerable individuals by creating safe, joyful spaces that restore hope and belonging.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/donate" className={btnAccent}>Support Our Mission</Link>
                <Link to="/contact" className={btnGhost}>Get Involved</Link>
              </motion.div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 - Using another Image */}
        <SwiperSlide>
          <div className="relative w-full h-full flex items-center justify-center text-center">
            {/* TODO: Replace '/img/carousel-2.jpg' with your second hero image */}
            <img src="/img/carousel-2.jpg" alt="JUKANES community work" className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover" />
            <div className="absolute inset-0 z-10 bg-black/40"></div> {/* Dark overlay */}
            
            <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-white">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-7xl font-bold font-heading mb-6"
              >
                Join a Family Bound by Purpose
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl max-w-3xl mx-auto mb-8"
              >
                We are a vibrant community united by a shared vision of empowerment, collaboration, and growth.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/donate" className={btnAccent}>Support Our Mission</Link>
                <Link to="/about" className={btnGhost}>Learn More</Link>
              </motion.div>
            </div>
          </div>
        </SwiperSlide>

        {/* You can add more SwiperSlides here for additional images */}
        
      </Swiper>
    </div>
  );
};

export default HeroSection;