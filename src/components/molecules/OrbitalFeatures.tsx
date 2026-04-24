'use client';

import { motion } from 'framer-motion';

type FeatureProps = {
  title: string;
  description: string;
  icon: string; // This would be a simple text emoji or icon class
  angle: number;
  distance: number;
};

const Feature = ({ title, description, icon, angle, distance }: FeatureProps) => {
  // Calculate position based on angle and distance
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;
  
  return (
    <motion.div
      className="absolute p-4 bg-background/20 backdrop-blur-sm border border-foreground/20 rounded-lg w-52 shadow-lg"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: x,
        y: y,
      }}
      whileHover={{ scale: 1.05, zIndex: 30 }}
      transition={{ duration: 0.5 }}
      style={{
        left: '50%',
        top: '50%',
        marginLeft: '-104px', // Half of width
        marginTop: '-48px',  // Approximate half of height
      }}
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-foreground/80">{description}</p>
    </motion.div>
  );
};

const OrbitalFeatures = () => {
  // Features data
  const features = [
    {
      title: "Eternal Memories",
      description: "Your precious moments, preserved forever on the blockchain.",
      icon: "✨",
      angle: 0, // in radians
      distance: 220, // distance from center in pixels
    },
    {
      title: "Digital Legacy",
      description: "Leave wisdom, assets, and love for future generations.",
      icon: "🌱",
      angle: Math.PI * 0.4,
      distance: 220,
    },
    {
      title: "Timed Revelations",
      description: "Schedule messages to appear on special dates in the future.",
      icon: "⏳",
      angle: Math.PI * 0.8,
      distance: 220,
    },
    {
      title: "Emotional Gifts",
      description: "Surprise loved ones with tokens of appreciation across time.",
      icon: "💝",
      angle: Math.PI * 1.2,
      distance: 220,
    },
    {
      title: "Immutable Promises",
      description: "Make commitments that can't be broken or forgotten.",
      icon: "🔒",
      angle: Math.PI * 1.6,
      distance: 220,
    }
  ];
  
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Features in orbit */}
      {features.map((feature, index) => (
        <Feature
          key={index}
          {...feature}
        />
      ))}
    </div>
  );
};

export default OrbitalFeatures;