'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

// Testimonial data structure
type Testimonial = {
  id: number;
  name: string;
  location: string;
  image: string;
  story: string;
  emotion: string;
};

// More emotionally impactful stories showcasing the power of time capsules
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carlos Mendes",
    location: "Lisbon, Portugal",
    image: "/testimonials/carlos.jpg",
    story: "After 42 years of waiting, my beloved Sporting CP finally won the league title. I created a capsule with my late father's scarf that will open for my son on his 18th birthday, along with videos of our celebration. Dad never saw us win again, but through AIONIOS, three generations will share this moment together.",
    emotion: "Legacy",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    location: "Chicago, USA",
    image: "/testimonials/sarah.jpg",
    story: "I sealed a message for my daughter to open on her wedding day. Inside is my mother's wedding advice to me—words I cherished but nearly lost. Now they'll live forever, passed from grandmother to mother to daughter, no matter what happens to me.",
    emotion: "Connection",
  },
  {
    id: 3,
    name: "Hiroshi Tanaka",
    location: "Kyoto, Japan",
    image: "/testimonials/hiroshi.jpg",
    story: "I programmed a capsule to reveal itself when my startup reaches $1 million in revenue. Inside is the very first sketch of our product and a message from me to the future team—reminding us of why we started this journey. The blockchain makes this promise unbreakable.",
    emotion: "Inspiration",
  },
  {
    id: 4,
    name: "Anya Petrova",
    location: "St. Petersburg, Russia",
    image: "/testimonials/anya.jpg",
    story: "When I was diagnosed with a terminal illness, I created time capsules for my twin sons to open on every birthday until they turn 25. Each one has different memories, advice, and love that I won't be able to share in person. AIONIOS gave me the gift of still being present in their lives.",
    emotion: "Presence",
  },
];

// Component for a single timeline testimonial
const TimelineItem = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`flex items-start gap-6 mb-24 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Timeline connector */}
      <div className="hidden md:block relative">
        <div className="timeline-connector"></div>
        <div className="timeline-node">
          <span className="font-mono text-foreground/70">{testimonial.emotion}</span>
        </div>
      </div>
      
      {/* Testimonial content */}
      <div className="timeline-card">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile section */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-foreground/30 mb-2">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-80 animate-pulse-glow"></div>
            </div>
            <h4 className="font-semibold text-center">{testimonial.name}</h4>
            <p className="text-sm text-foreground/70 text-center">{testimonial.location}</p>
            
            {/* Mobile emotion badge */}
            <div className="md:hidden mt-2 px-3 py-1 rounded-full bg-background/30 border border-foreground/20 text-sm">
              {testimonial.emotion}
            </div>
          </div>
          
          {/* Story content */}
          <div className="flex-1">
            <p className="text-lg italic leading-relaxed">{testimonial.story}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TimelineTestimonials = () => {
  return (
    <div className="relative">
      {/* Vertical timeline line (desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-foreground/20 -translate-x-1/2 z-0"></div>
      
      {/* Testimonials */}
      <div className="relative z-10">
        {testimonials.map((testimonial, index) => (
          <TimelineItem key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>
    </div>
  );
};

export default TimelineTestimonials;