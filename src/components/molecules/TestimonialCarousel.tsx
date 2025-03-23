'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Testimonial data structure
type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
};

// Sample testimonials (replace with real data)
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Elena Rodriguez",
    role: "Mother & Digital Artist",
    image: "/testimonials/elena.jpg", // Create a public/testimonials folder with placeholder images
    quote: "I left messages for my children to open on their 18th birthdays. Knowing these moments are preserved forever brings me incredible peace."
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Blockchain Developer",
    image: "/testimonials/marcus.jpg",
    quote: "As someone who builds for the future, AIONIOS lets me leave my knowledge for the next generation of developers. It's more than code—it's my legacy."
  },
  {
    id: 3,
    name: "Amara Johnson",
    role: "Digital Nomad",
    image: "/testimonials/amara.jpg",
    quote: "I've traveled to 42 countries. Each capsule holds memories from a place that changed me. My grandchildren will one day walk in my footsteps."
  },
  {
    id: 4,
    name: "Tomas Meyer",
    role: "Author & Futurist",
    image: "/testimonials/tomas.jpg",
    quote: "I sealed predictions about technology in 2050. When they open, I hope they inspire wonder about how far we've come—or prove me right!"
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  return (
    <div 
      className="relative w-full max-w-3xl mx-auto my-12"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Orbital paths for testimonials */}
      <motion.div 
        className="absolute left-1/2 top-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10" 
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute left-1/2 top-1/2 w-[130%] h-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/5" 
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-background/10 backdrop-blur-sm border border-foreground/20 rounded-lg p-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Testimonial image */}
            <motion.div 
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-foreground/30"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-80 animate-pulse-glow"></div>
              {/* Using a gradient placeholder since images are not yet available */}
            </motion.div>
            
            {/* Testimonial content */}
            <div className="flex-1">
              <p className="text-lg md:text-xl italic mb-4">{testimonials[currentIndex].quote}</p>
              <div className="font-semibold">{testimonials[currentIndex].name}</div>
              <div className="text-sm text-foreground/70">{testimonials[currentIndex].role}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-foreground w-6' 
                : 'bg-foreground/30'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Orbital elements - simulating planets */}
      {testimonials.map((_, index) => {
        const isActive = index === currentIndex;
        return (
          <motion.div
            key={`orbit-${index}`}
            className={`absolute left-1/2 top-1/2 rounded-full ${isActive ? 'bg-foreground shadow-glow' : 'bg-foreground/70'}`}
            animate={{
              x: `calc(${Math.cos(2 * Math.PI * index / testimonials.length)} * 75%)`,
              y: `calc(${Math.sin(2 * Math.PI * index / testimonials.length)} * 75%)`,
              opacity: isActive ? 1 : 0.6,
              scale: isActive ? 1.5 : 1,
              width: isActive ? '12px' : '8px',
              height: isActive ? '12px' : '8px'
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            onClick={() => setCurrentIndex(index)}
            whileHover={{ scale: 1.8, cursor: 'pointer' }}
          />
        );
      })}
    </div>
  );
};

export default TestimonialCarousel;