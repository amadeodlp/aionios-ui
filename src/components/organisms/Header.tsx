'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/atoms/Logo';
import Button from '@/components/atoms/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSidebar } from '@/store/slices/uiSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { address, isConnected } = useSelector((state: RootState) => state.wallet);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <header className="py-4 px-6 border-b border-foreground/10 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo />
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/create" className="text-foreground/70 hover:text-foreground transition-colors">
            Create
          </Link>
          <Link href="/explore" className="text-foreground/70 hover:text-foreground transition-colors">
            Explore
          </Link>
          
          {isConnected && address ? (
            <div className="flex items-center space-x-4">
              <span className="font-mono text-sm">{formatAddress(address)}</span>
              <Button size="sm" onClick={() => dispatch(setSidebar(true))}>
                Dashboard
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="primary">
              Connect Wallet
            </Button>
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-foreground/10 py-4 px-6">
            <nav className="flex flex-col space-y-4">
              <Link href="/about" className="text-foreground/70 hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/create" className="text-foreground/70 hover:text-foreground transition-colors">
                Create
              </Link>
              <Link href="/explore" className="text-foreground/70 hover:text-foreground transition-colors">
                Explore
              </Link>
              
              {isConnected && address ? (
                <div className="flex flex-col space-y-2">
                  <span className="font-mono text-sm">{formatAddress(address)}</span>
                  <Button size="sm" onClick={() => dispatch(setSidebar(true))}>
                    Dashboard
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="primary">
                  Connect Wallet
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;