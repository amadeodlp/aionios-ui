'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/atoms/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 px-6 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <Logo />
          <p className="mt-4 text-foreground/60 text-sm">
            Store messages, assets, and memories on the blockchain to be revealed in the future.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-mono mb-4">NAVIGATION</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="text-foreground/60 hover:text-foreground transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/create" className="text-foreground/60 hover:text-foreground transition-colors">
                Create
              </Link>
            </li>
            <li>
              <Link href="/explore" className="text-foreground/60 hover:text-foreground transition-colors">
                Explore
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-mono mb-4">RESOURCES</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/docs" className="text-foreground/60 hover:text-foreground transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-foreground/60 hover:text-foreground transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <a href="https://github.com/aionios" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground transition-colors">
                GitHub
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-mono mb-4">CONNECT</h3>
          <ul className="space-y-2">
            <li>
              <a href="https://twitter.com/aionios" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground transition-colors">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://discord.gg/aionios" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground transition-colors">
                Discord
              </a>
            </li>
            <li>
              <a href="mailto:info@aionios.io" className="text-foreground/60 hover:text-foreground transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} AIONIOS. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;