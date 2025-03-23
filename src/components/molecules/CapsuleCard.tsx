'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentCapsule } from '@/store/slices/capsuleSlice';
import Button from '@/components/atoms/Button';
import Link from 'next/link';
import { openModal } from '@/store/slices/uiSlice';
import { Capsule } from '@/store/slices/capsuleSlice';

interface CapsuleCardProps {
  capsule: Capsule;
  onView?: () => void;
}

const CapsuleCard: React.FC<CapsuleCardProps> = ({ capsule, onView }) => {
  const dispatch = useDispatch();
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'opened':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-blue-400';
    }
  };
  
  const handleViewDetails = () => {
    dispatch(setCurrentCapsule(capsule));
    dispatch(openModal({ type: 'viewCapsule', data: capsule }));
    
    // Track view if callback provided
    if (onView) {
      onView();
    }
  };
  
  return (
    <div className="border border-foreground/20 rounded-lg p-4 backdrop-blur-sm hover:border-foreground/40 transition-all">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium truncate">{capsule.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(capsule.status)}`}>
          {capsule.status.charAt(0).toUpperCase() + capsule.status.slice(1)}
        </span>
      </div>
      
      <p className="text-foreground/60 text-sm mb-4 line-clamp-2">{capsule.content}</p>
      
      <div className="space-y-2 text-xs text-foreground/60">
        <div className="flex justify-between">
          <span>Created:</span>
          <span>{formatDate(capsule.createdAt)}</span>
        </div>
        
        {capsule.openCondition.type === 'time' && (
          <div className="flex justify-between">
            <span>Opens:</span>
            <span>{formatDate(capsule.openCondition.value)}</span>
          </div>
        )}
        
        {capsule.status === 'opened' && capsule.openedAt && (
          <div className="flex justify-between">
            <span>Opened:</span>
            <span>{formatDate(capsule.openedAt)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-foreground/10 flex items-center text-xs text-foreground/60 space-x-4">
        {capsule.viewCount !== undefined && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {capsule.viewCount}
          </div>
        )}
        
        {capsule.subscriptionCount !== undefined && capsule.status === 'sealed' && (
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            {capsule.subscriptionCount}
          </div>
        )}
        
        {capsule.featured && (
          <div className="flex items-center text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Featured
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 flex justify-between items-center">
        <Button size="sm" onClick={handleViewDetails}>
          View Details
        </Button>
        
        <Link href={`/capsule/${capsule.id}`} className="text-xs text-foreground/60 hover:text-foreground transition-colors">
          Blockchain Info ↗
        </Link>
      </div>
    </div>
  );
};

export default CapsuleCard;