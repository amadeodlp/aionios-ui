'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import AnimatedStars from '@/components/atoms/AnimatedStars';

import TimelineTestimonials from '@/components/molecules/TimelineTestimonials';

export default function About() {
  useEffect(() => {
    // Check if the URL has a hash and scroll to that element
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        // Remove the '#' character
        const id = hash.substring(1);
        const element = document.getElementById(id);
        
        if (element) {
          // Use a small timeout to ensure the page is fully loaded
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    }
  }, []);
  return (
    <main className="min-h-screen flex flex-col">
      <AnimatedStars />
      <Header />
      
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our Mission
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 leading-relaxed"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            To bridge the gap between generations, preserve meaningful moments, 
            and allow people to send their voice, their love, and their wisdom across time.
          </motion.p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-full overflow-hidden -z-10 opacity-20">
          <div className="relative h-px w-full bg-gradient-to-r from-transparent via-foreground to-transparent">
            <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-foreground animate-pulse"></div>
            <div className="absolute top-0 left-2/3 w-2 h-2 rounded-full bg-foreground animate-pulse delay-100"></div>
          </div>
        </div>
      </motion.section>
      
      {/* About Section with Timeline */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What is AIONIOS?</h2>
              <p className="text-lg mb-4 leading-relaxed">
                AIONIOS is a decentralized blockchain platform that allows you to create digital time capsules containing messages, memories, and even digital assets that can be revealed in the future under specific conditions.
              </p>
              <p className="text-lg mb-4 leading-relaxed">
                Unlike traditional digital storage solutions, AIONIOS is built on blockchain technology, ensuring your messages and memories will remain intact and accessible for decades to come—regardless of what happens to any single company or service.
              </p>
              <p className="text-lg leading-relaxed">
                Your capsules can be programmed to open based on time, specific events, multiple approvals, or even real-world conditions verified through reliable oracles.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-center"
            >
              <div className="w-full h-full max-w-md rounded-lg border border-foreground/20 bg-background/5 backdrop-blur-sm p-6 relative overflow-hidden">
                {/* Simulated capsule interface */}
                <div className="text-xs font-mono mb-2 text-foreground/60">AIONIOS TIME CAPSULE</div>
                <h3 className="text-xl font-semibold mb-4">A Gift For The Future</h3>
                <div className="h-px w-full bg-foreground/20 my-4"></div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm">Securely Sealed</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-sm">Decentralized Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  <span className="text-sm">Programmed Revelation</span>
                </div>
                <div className="h-px w-full bg-foreground/20 my-4"></div>
                <div className="text-xs font-mono mb-1 text-foreground/60">OPENS IN</div>
                <div className="font-mono text-lg">18.05.2042</div>
                
                {/* Capsule decorative elements */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full border border-foreground/10 opacity-30"></div>
                <div className="absolute -top-10 -left-10 w-20 h-20 rounded-full border border-foreground/10 opacity-30"></div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why We Built This</h2>
            <p className="text-xl max-w-3xl mx-auto">
              In a digital age where so much of our communication is ephemeral, we wanted to create 
              something that could preserve what's meaningful for generations to come—securely, reliably, and with the emotional impact that important moments deserve.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Testimonials Section with Timeline */}
      <section className="py-16 px-4 relative" id="stories">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Stories That Span Time
          </motion.h2>
          <motion.p 
            className="text-center text-xl max-w-2xl mx-auto mb-16 text-foreground/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Real people, real connections, real emotions—preserved across generations.
          </motion.p>
          
          <TimelineTestimonials />
        </div>
      </section>
      
      {/* Technology Section */}
      <motion.section 
        className="py-16 px-4 bg-background/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Technology</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-background/5 backdrop-blur-sm p-6 rounded-lg border border-foreground/20"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background/20 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Blockchain Security</h3>
              <p className="text-foreground/80">
                Your messages and memories are secured by the same technology that protects billions in digital assets. Nothing can be altered or deleted once sealed.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-background/5 backdrop-blur-sm p-6 rounded-lg border border-foreground/20"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background/20 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Conditions</h3>
              <p className="text-foreground/80">
                Program your capsules to open based on time, events, multiple approvals, or real-world conditions verified through reliable oracles.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-background/5 backdrop-blur-sm p-6 rounded-lg border border-foreground/20"
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-background/20 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Digital & Physical</h3>
              <p className="text-foreground/80">
                Store text, images, videos, cryptocurrency, tokens, and even NFTs in your capsules. Connect digital memories to physical world events.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Team</h2>
          <p className="text-xl max-w-3xl mx-auto mb-16">
            We're a group of developers, designers, and dreamers who believe technology should help us preserve what matters most: our human connections.
          </p>
          
          {/* Team placeholder - you can replace this with actual team member cards */}
          <div className="flex justify-center">
            <div className="text-lg text-foreground/60 italic">
              Our full team section is coming soon.
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <motion.section 
        className="py-20 px-4 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full border border-foreground/30"></div>
          <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full border border-foreground/30"></div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Legacy</h2>
          <p className="text-xl mb-10 text-foreground/80">
            Create your first time capsule today and send a piece of yourself to the future.
          </p>
          <motion.a 
            href="/create"
            className="btn btn--primary text-lg px-8 py-4 inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.a>
        </div>
      </motion.section>
      
      <Footer />
    </main>
  );
}