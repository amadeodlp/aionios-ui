'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import RotatingGalaxy from '@/components/atoms/RotatingGalaxy';
import AnimatedStars from '@/components/atoms/AnimatedStars';
import TestimonialCarousel from '@/components/molecules/TestimonialCarousel';
import OrbitalFeatures from '@/components/molecules/OrbitalFeatures';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <AnimatedStars />
      <Header />
      
      {/* Hero Section with Galaxy */}
      <div className="flex-grow flex items-center justify-center relative py-20 px-4 overflow-hidden min-h-screen">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <RotatingGalaxy />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">AIONIOS</h1>
            <p className="text-xl md:text-2xl mb-8 text-foreground/90 leading-relaxed">
              Leave messages that transcend time. Create memories that last forever. 
              Connect with the future in ways never before possible.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a 
                href="/create"
                className="btn btn--primary text-lg px-6 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Begin Your Legacy
              </motion.a>
              <motion.a 
                href="/about#stories"
                className="btn text-lg px-6 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Discover Stories
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative p-6 border border-foreground/20 rounded-lg bg-background/5 backdrop-blur-sm">
              <div className="text-sm font-mono mb-2 text-foreground/60">YOUR STORY</div>
              <p className="mb-4 text-lg">
                Some words fade with time. Some memories are lost to history. 
                But on AIONIOS, what matters to you becomes eternal.
              </p>
              
              <div className="text-sm font-mono mb-2 text-foreground/60 mt-6">YOUR LEGACY</div>
              <p className="mb-4 text-lg">
                Preserve wisdom, love, and gifts for those who come after you.
                Speak to the future in your own voice.
              </p>
              
              <div className="text-sm font-mono mb-2 text-foreground/60 mt-6">YOUR IMPACT</div>
              <p className="text-lg">
                Create ripples through time that continue long after today's moment has passed.
                The future is listening.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Features Section */}
      <motion.section 
        className="py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Your Story Through Time</h2>
          <OrbitalFeatures />
        </div>
      </motion.section>
      
      {/* Testimonials Section */}
      <motion.section 
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Voices Across Time</h2>
          <p className="text-center text-xl max-w-2xl mx-auto mb-16 text-foreground/80">
            People are already building bridges to the future. 
            Join them in creating connections that span generations.
          </p>
          <TestimonialCarousel />
        </div>
      </motion.section>
      
      {/* Call to Action */}
      <motion.section 
        className="py-20 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Journey</h2>
          <p className="text-xl mb-10 text-foreground/80">
            Your voice deserves to be heard—not just today, but for all the tomorrows to come.
            Create your first time capsule in minutes.
          </p>
          <motion.a 
            href="/create"
            className="btn btn--primary text-lg px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Legacy
          </motion.a>
        </div>
      </motion.section>
      
      <Footer />
    </main>
  );
}