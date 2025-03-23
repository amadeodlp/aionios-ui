'use client';

import React from 'react';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import CapsuleForm from '@/components/organisms/CapsuleForm';

export default function CreatePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center">Create a Time Capsule</h1>
          <p className="text-foreground/60 mb-8 text-center max-w-2xl mx-auto">
            Preserve your messages, memories, and digital assets on the blockchain, 
            to be revealed at a specific time or under custom conditions.
          </p>          
          <CapsuleForm />
        </div>
      </div>
      
      <Footer />
    </main>
  );
}