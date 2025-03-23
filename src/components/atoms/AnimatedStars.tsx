'use client';

import { useEffect, useRef } from 'react';

const AnimatedStars = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full viewport size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Star properties
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      direction: number;
    }> = [];
    
    // Create stars
    const createStars = () => {
      const numStars = Math.floor(canvas.width * canvas.height / 8000); // Adjust density here
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.01 + 0.002,
          opacity: Math.random() * 0.5 + 0.3,
          direction: Math.random() > 0.5 ? 1 : -1
        });
      }
    };
    
    createStars();
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw and update stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        // Twinkle effect
        star.opacity += star.direction * star.speed;
        
        // Reverse direction when reaching opacity bounds
        if (star.opacity >= 0.8 || star.opacity <= 0.2) {
          star.direction *= -1;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};

export default AnimatedStars;