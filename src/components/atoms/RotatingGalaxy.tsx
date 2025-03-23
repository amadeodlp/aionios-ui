'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RotatingGalaxy = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  
  // Adjust size based on window size
  useEffect(() => {
    const handleResize = () => {
      if (outerRef.current) {
        const minSize = Math.min(window.innerWidth, window.innerHeight) * 0.8;
        outerRef.current.style.width = `${minSize}px`;
        outerRef.current.style.height = `${minSize}px`;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <motion.div 
      ref={outerRef} 
      className="relative w-[80vh] h-[80vh]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Outer ring */}
      <motion.div
        className="galaxy-orbit w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 120, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      {/* Middle ring */}
      <motion.div
        className="galaxy-orbit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4"
        animate={{ rotate: -360 }}
        transition={{ 
          duration: 90, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="galaxy-orbit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 60, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      
      {/* Center */}
      <motion.div 
        className="galaxy-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      />
    </motion.div>
  );
};

export default RotatingGalaxy;