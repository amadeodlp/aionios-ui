'use client';

import React from 'react';
import Modal from './Modal';
import { Capsule } from '@/store/slices/capsuleSlice';
import Button from '@/components/atoms/Button';
import { subscribeToCapsule, incrementShareCount } from '@/services/capsuleService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface CapsuleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsule: Capsule;
  refreshData?: () => void;
}

const CapsuleDetailsModal: React.FC<CapsuleDetailsModalProps> = ({
  isOpen,
  onClose,
  capsule,
  refreshData
}) => {
  const { address } = useSelector((state: RootState) => state.wallet);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'opened':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };
  
  const getConditionText = (capsule: Capsule) => {
    switch (capsule.openCondition.type) {
      case 'time':
        return `Opens on ${formatDate(capsule.openCondition.value)}`;
      case 'multisig':
        return `Requires ${capsule.openCondition.value?.required || 'multiple'} signatures to open`;
      case 'oracle':
        return `Opens when external condition is met`;
      case 'compound':
        return `Opens when multiple conditions are met`;
      default:
        return `Opens on ${formatDate(capsule.openCondition.value)}`;
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AIONIOS Time Capsule: ${capsule.title}`,
          text: `Check out this time capsule: ${capsule.title}`,
          url: window.location.origin + `/capsule/${capsule.id}`
        });
        
        // Update share count
        await incrementShareCount(parseInt(capsule.id));
        if (refreshData) refreshData();
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      const url = `${window.location.origin}/capsule/${capsule.id}`;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
      
      // Update share count
      await incrementShareCount(parseInt(capsule.id));
      if (refreshData) refreshData();
    }
  };
  
  const handleSubscribe = async () => {
    if (!address) {
      alert('Please connect your wallet to subscribe');
      return;
    }
    
    try {
      await subscribeToCapsule(parseInt(capsule.id), address);
      if (refreshData) refreshData();
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{capsule.title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusClass(capsule.status)}`}>
            {capsule.status.charAt(0).toUpperCase() + capsule.status.slice(1)}
          </span>
        </div>
        
        {/* Description & Content */}
        <div className="space-y-4">
          {capsule.description && (
            <p className="text-foreground/70">{capsule.description}</p>
          )}
          
          <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10 whitespace-pre-wrap">
            {capsule.content}
          </div>
        </div>
        
        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground/60">Details</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span>Created on:</span>
                <span>{formatDate(capsule.createdAt)}</span>
              </li>
              {capsule.status === 'opened' && capsule.openedAt && (
                <li className="flex justify-between">
                  <span>Opened on:</span>
                  <span>{formatDate(capsule.openedAt)}</span>
                </li>
              )}
              <li className="flex justify-between">
                <span>Condition:</span>
                <span>{getConditionText(capsule)}</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground/60">Stats</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex justify-between">
                <span>Views:</span>
                <span>{capsule.viewCount || 0}</span>
              </li>
              <li className="flex justify-between">
                <span>Shares:</span>
                <span>{capsule.shareCount || 0}</span>
              </li>
              {capsule.status === 'sealed' && (
                <li className="flex justify-between">
                  <span>Subscribers:</span>
                  <span>{capsule.subscriptionCount || 0}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Assets (if any) */}
        {capsule.assets && capsule.assets.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground/60">Assets</h3>
            <div className="bg-foreground/5 p-3 rounded-lg border border-foreground/10">
              <ul className="space-y-1">
                {capsule.assets.map((asset, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{asset.type}: {asset.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="pt-4 border-t border-foreground/10 flex flex-wrap gap-2">
          <Button href={`/capsule/${capsule.id}`} variant="secondary">
            View on Blockchain
          </Button>
          
          <Button onClick={handleShare} variant="secondary">
            Share
          </Button>
          
          {capsule.status === 'sealed' && (
            <Button onClick={handleSubscribe} variant="primary">
              Subscribe for Updates
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CapsuleDetailsModal;