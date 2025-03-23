'use client';

import React from 'react';
import Link from 'next/link';

const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 relative">
        <div className="absolute inset-0 border border-foreground rounded-full"></div>
        <div className="absolute inset-2 border border-foreground rounded-full"></div>
        <div className="absolute inset-4 border border-foreground rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-foreground rounded-full"></div>
        </div>
      </div>
      <span className="text-lg font-bold">AIONIOS</span>
    </Link>
  );
};

export default Logo;