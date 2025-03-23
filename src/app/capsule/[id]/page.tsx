'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Capsule } from '@/store/slices/capsuleSlice';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import Button from '@/components/atoms/Button';
import { getCapsule, incrementViewCount } from '@/services/capsuleService';
import { getIPFSUrl } from '@/services/capsuleService';
import { useDispatch } from 'react-redux';
import { openModal } from '@/store/slices/uiSlice';
import { setCurrentCapsule } from '@/store/slices/capsuleSlice';

export default function CapsuleBlockchainInfoPage() {
  const params = useParams();
  const id = params.id as string;
  const dispatch = useDispatch();
  
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockchainData, setBlockchainData] = useState<any>(null);
  
  useEffect(() => {
    const fetchCapsuleData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // For development, use mock data
        // In production, this should call the API
        
        // Mock blockchain data
        const mockBlockchainData = {
          blockchainId: `0x${Math.random().toString(16).substring(2, 10)}`,
          contractAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          creationTransaction: `0x${Math.random().toString(16).substring(2, 66)}`,
          blockNumber: Math.floor(Math.random() * 10000000) + 15000000,
          blockTimestamp: Date.now() - Math.floor(Math.random() * 10000000),
          gasUsed: Math.floor(Math.random() * 1000000) + 50000,
          networkName: 'Ethereum Mainnet',
          networkId: 1,
        };
        
        // Find capsule from our mock data
        const mockCapsules = [
          {
            id: '1',
            title: 'Letter to my future grandchildren',
            content: 'A heartfelt message about life lessons and family traditions, to be opened on the 100th anniversary of our family reunion.',
            openCondition: { type: 'time', value: Date.now() + 3600000 * 24 * 365 },
            assets: [
              { type: 'image', value: 'family_photo.jpg' },
              { type: 'document', value: 'family_recipe.pdf' }
            ],
            recipientAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            status: 'sealed',
            createdAt: Date.now() - 3600000 * 24 * 30,
            viewCount: 1254,
            subscriptionCount: 487,
            featured: true,
            description: 'A heartfelt message crossing generations'
          },
          {
            id: '2',
            title: 'Wedding Day Memories',
            content: 'Our vows, photos, and predictions for our 25th anniversary. A time capsule for us to open and cherish.',
            openCondition: { type: 'time', value: Date.now() - 3600000 * 24 * 5 },
            assets: [
              { type: 'image', value: 'wedding_photo.jpg' },
              { type: 'audio', value: 'vows.mp3' }
            ],
            recipientAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
            status: 'opened',
            createdAt: Date.now() - 3600000 * 24 * 365,
            openedAt: Date.now() - 3600000 * 24 * 5,
            viewCount: 893,
            shareCount: 156,
            featured: true
          },
          {
            id: '3',
            title: '2023 Technology Predictions',
            content: 'My predictions for technology in 2030. Will I be right or embarrassingly wrong?',
            openCondition: { type: 'time', value: Date.now() - 3600000 * 24 * 10 },
            assets: [],
            recipientAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            status: 'opened',
            createdAt: Date.now() - 3600000 * 24 * 365 * 2,
            openedAt: Date.now() - 3600000 * 24 * 10,
            viewCount: 2187,
            shareCount: 359,
            featured: true
          },
          {
            id: '4',
            title: 'Message to my 30-year-old self',
            content: 'Advice and dreams from my 20-year-old self. Let\'s see if I followed my own advice!',
            openCondition: { type: 'time', value: Date.now() + 3600000 * 24 * 365 * 5 },
            assets: [],
            recipientAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
            status: 'sealed',
            createdAt: Date.now() - 3600000 * 24 * 180,
            viewCount: 632,
            subscriptionCount: 201,
            featured: true
          },
          {
            id: '5',
            title: 'Pandemic Time Capsule',
            content: 'What we learned during global isolation and how it changed us forever.',
            openCondition: { type: 'time', value: Date.now() + 3600000 * 24 * 365 * 10 },
            assets: [],
            recipientAddress: '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6',
            status: 'sealed',
            createdAt: Date.now() - 3600000 * 24 * 365,
            viewCount: 5430,
            subscriptionCount: 1298
          },
          {
            id: '6',
            title: 'First Crypto Investment',
            content: 'My thoughts when I first invested in crypto. To be opened after 10 years.',
            openCondition: { type: 'time', value: Date.now() - 3600000 * 24 * 15 },
            assets: [],
            recipientAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
            status: 'opened',
            createdAt: Date.now() - 3600000 * 24 * 365 * 3,
            openedAt: Date.now() - 3600000 * 24 * 15,
            viewCount: 3912,
            shareCount: 823
          }
        ];
        
        const foundCapsule = mockCapsules.find(c => c.id === id);
        
        if (foundCapsule) {
          setCapsule(foundCapsule);
          setBlockchainData(mockBlockchainData);
          
          // In production, uncomment this to increment the view count
          // await incrementViewCount(parseInt(id));
        } else {
          setError('Capsule not found');
        }
        
        // In production, uncomment this to fetch from the API
        /*
        const fetchedCapsule = await getCapsule(parseInt(id));
        if (fetchedCapsule) {
          setCapsule(fetchedCapsule);
          // Fetch blockchain data from our contract
          // This would typically be a separate API call
          setBlockchainData(blockchainData);
          await incrementViewCount(parseInt(id));
        } else {
          setError('Capsule not found');
        }
        */
      } catch (error) {
        console.error('Error fetching capsule:', error);
        setError('Failed to load capsule data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCapsuleData();
  }, [id]);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleViewDetailsClick = () => {
    if (capsule) {
      dispatch(setCurrentCapsule(capsule));
      dispatch(openModal({ type: 'viewCapsule', data: capsule }));
    }
  };
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 rounded-lg border border-red-500/20 bg-red-500/5">
              <h3 className="text-xl mb-2 text-red-500">Error</h3>
              <p className="text-foreground/60 mb-4">{error}</p>
              <Button href="/explore" variant="secondary">
                Back to Explore
              </Button>
            </div>
          ) : capsule && blockchainData ? (
            <div className="space-y-8">
              {/* Capsule Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{capsule.title}</h1>
                  <p className="text-foreground/60">
                    {capsule.description || 'Time capsule stored on the blockchain'}
                  </p>
                </div>
                
                <Button onClick={handleViewDetailsClick} variant="primary">
                  View Full Details
                </Button>
              </div>
              
              {/* Capsule Status Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                  <h3 className="font-medium mb-2">Status</h3>
                  <div className="text-2xl font-semibold">
                    {capsule.status.charAt(0).toUpperCase() + capsule.status.slice(1)}
                  </div>
                  <p className="text-sm text-foreground/60 mt-1">
                    {capsule.status === 'sealed' 
                      ? `Will open ${formatDate(capsule.openCondition.value)}` 
                      : `Opened ${capsule.openedAt ? formatDate(capsule.openedAt) : 'recently'}`}
                  </p>
                </div>
                
                <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                  <h3 className="font-medium mb-2">Created</h3>
                  <div className="text-lg font-semibold">
                    {formatDate(capsule.createdAt)}
                  </div>
                  <p className="text-sm text-foreground/60 mt-1">
                    Block #{blockchainData.blockNumber}
                  </p>
                </div>
                
                <div className="bg-foreground/5 p-4 rounded-lg border border-foreground/10">
                  <h3 className="font-medium mb-2">Network</h3>
                  <div className="text-lg font-semibold">
                    {blockchainData.networkName}
                  </div>
                  <p className="text-sm text-foreground/60 mt-1">
                    Chain ID: {blockchainData.networkId}
                  </p>
                </div>
              </div>
              
              {/* Blockchain Details Section */}
              <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
                <h2 className="text-xl font-semibold mb-4">Blockchain Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/60">Contract Address</h3>
                    <div className="flex items-center mt-1">
                      <code className="bg-foreground/10 px-2 py-1 rounded text-sm font-mono break-all">
                        {blockchainData.contractAddress}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(blockchainData.contractAddress)} 
                        className="ml-2 p-1 hover:bg-foreground/10 rounded"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-foreground/60">Capsule ID</h3>
                    <div className="flex items-center mt-1">
                      <code className="bg-foreground/10 px-2 py-1 rounded text-sm font-mono break-all">
                        {blockchainData.blockchainId}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(blockchainData.blockchainId)} 
                        className="ml-2 p-1 hover:bg-foreground/10 rounded"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-foreground/60">Creation Transaction</h3>
                    <div className="flex items-center mt-1">
                      <code className="bg-foreground/10 px-2 py-1 rounded text-sm font-mono break-all">
                        {blockchainData.creationTransaction}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(blockchainData.creationTransaction)} 
                        className="ml-2 p-1 hover:bg-foreground/10 rounded"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <h3 className="text-sm font-medium text-foreground/60">Creator Address</h3>
                    <div className="flex items-center mt-1">
                      <code className="bg-foreground/10 px-2 py-1 rounded text-sm font-mono break-all">
                        {capsule.recipientAddress}
                      </code>
                      <button 
                        onClick={() => navigator.clipboard.writeText(capsule.recipientAddress)} 
                        className="ml-2 p-1 hover:bg-foreground/10 rounded"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-foreground/60">Block Timestamp</h3>
                    <div className="mt-1 text-sm">
                      {formatDate(blockchainData.blockTimestamp)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-foreground/10">
                  <h3 className="text-sm font-medium text-foreground/60 mb-2">Transaction Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-foreground/60">Block Number</div>
                      <div className="font-mono text-sm">{blockchainData.blockNumber}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-foreground/60">Gas Used</div>
                      <div className="font-mono text-sm">{blockchainData.gasUsed.toLocaleString()} units</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-foreground/10">
                  <h3 className="text-sm font-medium text-foreground/60 mb-3">Actions</h3>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="secondary"
                      size="sm"
                      href={`https://etherscan.io/tx/${blockchainData.creationTransaction}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://etherscan.io/tx/${blockchainData.creationTransaction}`, '_blank');
                      }}
                    >
                      View on Etherscan
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      size="sm"
                      href={`https://etherscan.io/address/${blockchainData.contractAddress}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://etherscan.io/address/${blockchainData.contractAddress}`, '_blank');
                      }}
                    >
                      View Contract
                    </Button>
                    
                    {capsule.status === 'sealed' && (
                      <Button 
                        variant="primary"
                        size="sm"
                        onClick={handleViewDetailsClick}
                      >
                        Subscribe for Updates
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Content Info Section (for opened capsules) */}
              {capsule.status === 'opened' && (
                <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
                  <h2 className="text-xl font-semibold mb-4">Capsule Content</h2>
                  
                  <div className="bg-foreground/10 p-4 rounded whitespace-pre-wrap mb-4">
                    {capsule.content}
                  </div>
                  
                  {capsule.assets && capsule.assets.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-foreground/60 mb-2">Included Assets</h3>
                      <ul className="space-y-2">
                        {capsule.assets.map((asset, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <div className="p-2 bg-foreground/10 rounded">
                              {asset.type === 'image' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              ) : asset.type === 'document' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              ) : asset.type === 'audio' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <div>{asset.value}</div>
                              <div className="text-xs text-foreground/60">{asset.type}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button href="/explore" variant="secondary">
                  Back to Explore
                </Button>
                
                <Button variant="primary" onClick={handleViewDetailsClick}>
                  View Full Details
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}