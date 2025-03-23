'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import CapsuleCard from '@/components/molecules/CapsuleCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import Button from '@/components/atoms/Button';
import { Capsule, setExploreCapsules, setExploreLoading, setExploreError, setCurrentCapsule } from '@/store/slices/capsuleSlice';
import { openModal } from '@/store/slices/uiSlice';
import { 
  getPopularCapsules, 
  getFeaturedCapsules, 
  getRecentlyOpenedCapsules, 
  getMostSubscribedCapsules,
  incrementViewCount
} from '@/services/capsuleService';

export default function ExplorePage() {
  const { capsules, exploreCapsules, exploreLoading, exploreError } = useSelector((state: RootState) => state.capsule);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch different categories of capsules
  useEffect(() => {
    const fetchExploreCapsules = async () => {
      dispatch(setExploreLoading(true));
      dispatch(setExploreError(null));
      setIsLoading(true);
      
      // Define mock data for development
      const mockFeatured = [
        {
          id: '1',
          title: 'Letter to my future grandchildren',
          content: 'A heartfelt message about life lessons and family traditions, to be opened on the 100th anniversary of our family reunion.',
          openCondition: { type: 'time', value: Date.now() + 3600000 * 24 * 365 },
          assets: [],
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
          assets: [],
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
      ];
      
      const mockPopular = [
        ...mockFeatured,
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
      
      // Use mock data during development (comment this out when backend is ready)
      let fetchedCapsules: Capsule[] = [];
      switch (category) {
        case 'featured':
          fetchedCapsules = mockFeatured;
          break;
        case 'popular':
          fetchedCapsules = mockPopular.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
          break;
        case 'recent':
          fetchedCapsules = mockPopular
            .filter(c => c.status === 'opened' && c.openedAt)
            .sort((a, b) => (b.openedAt || 0) - (a.openedAt || 0));
          break;
        case 'subscribed':
          fetchedCapsules = mockPopular
            .filter(c => c.status === 'sealed')
            .sort((a, b) => (b.subscriptionCount || 0) - (a.subscriptionCount || 0));
          break;
        default:
          fetchedCapsules = mockFeatured;
      }

      // Uncomment this block when backend implementation is ready
      /* 
      try {
        // Fetch capsules based on selected category
        switch (category) {
          case 'featured':
            fetchedCapsules = await getFeaturedCapsules();
            break;
          case 'popular':
            fetchedCapsules = await getPopularCapsules(12);
            break;
          case 'recent':
            fetchedCapsules = await getRecentlyOpenedCapsules(12);
            break;
          case 'subscribed':
            fetchedCapsules = await getMostSubscribedCapsules(12);
            break;
          default:
            fetchedCapsules = await getFeaturedCapsules();
        }
        
        // If no fetched capsules, use mock data
        if (fetchedCapsules.length === 0) {
          // Use mock data as defined above
        }
      } catch (error) {
        console.error('Error fetching capsules:', error);
        dispatch(setExploreError('Failed to fetch capsules. Please try again later.'));
      }
      */
      
      dispatch(setExploreCapsules(fetchedCapsules));
      dispatch(setExploreLoading(false));
      setIsLoading(false);
    };
    
    fetchExploreCapsules();
  }, [category, dispatch]);
  
  const filteredCapsules = exploreCapsules.filter(capsule => {
    if (filter === 'all') return true;
    return capsule.status === filter;
  });
  
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header & Title */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Time Capsules</h1>
            <p className="text-foreground/60 max-w-3xl mx-auto">
              Discover moments preserved in time. From emotional letters to future generations to 
              predictions of what's to come — explore the experiences others have chosen to immortalize.
            </p>
          </div>
          
          {/* Category Selector */}
          <div className="mb-10">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button 
                onClick={() => setCategory('featured')} 
                variant={category === 'featured' ? 'primary' : 'secondary'}
                size="md"
              >
                Featured
              </Button>
              <Button 
                onClick={() => setCategory('popular')} 
                variant={category === 'popular' ? 'primary' : 'secondary'}
                size="md"
              >
                Most Viewed
              </Button>
              <Button 
                onClick={() => setCategory('recent')} 
                variant={category === 'recent' ? 'primary' : 'secondary'}
                size="md"
              >
                Recently Opened
              </Button>
              <Button 
                onClick={() => setCategory('subscribed')} 
                variant={category === 'subscribed' ? 'primary' : 'secondary'}
                size="md"
              >
                Most Anticipated
              </Button>
            </div>
            
            {/* Status Filter */}
            <div className="flex justify-center space-x-2">
              <Button 
                onClick={() => setFilter('all')} 
                variant={filter === 'all' ? 'primary' : 'secondary'}
                size="sm"
              >
                All
              </Button>
              <Button 
                onClick={() => setFilter('sealed')} 
                variant={filter === 'sealed' ? 'primary' : 'secondary'}
                size="sm"
              >
                Sealed
              </Button>
              <Button 
                onClick={() => setFilter('opened')} 
                variant={filter === 'opened' ? 'primary' : 'secondary'}
                size="sm"
              >
                Opened
              </Button>
              <Button 
                onClick={() => setFilter('pending')} 
                variant={filter === 'pending' ? 'primary' : 'secondary'}
                size="sm"
              >
                Pending
              </Button>
            </div>
          </div>
          
          {/* Featured Highlight (for featured category only) */}
          {category === 'featured' && !isLoading && !exploreError && filteredCapsules.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">✨ Spotlight: Time Capsule of the Month</h2>
              <div className="rounded-xl overflow-hidden border border-foreground/20 backdrop-blur-sm hover:border-foreground/40 transition-all">
                <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[200px]">
                  {/* Left content - Image/Visual */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center p-8">
                    <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center">
                      <svg viewBox="0 0 64 64" className="w-20 h-20 text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 8L36.4 20.1L48 23L39.8 31.2L42 44L32 38L22 44L24.2 31.2L16 23L27.6 20.1L32 8Z" fill="currentColor" stroke="currentColor" strokeWidth="2" />
                        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Right content - Text */}
                  <div className="lg:col-span-3 p-8">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{filteredCapsules[0].title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${filteredCapsules[0].status === 'opened' ? 'text-green-400' : 'text-blue-400'}`}>
                        {filteredCapsules[0].status.charAt(0).toUpperCase() + filteredCapsules[0].status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-foreground/70 mb-4">
                      {filteredCapsules[0].content || 'A remarkable message from one generation to another, showcasing the power of preserving moments in time.'}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-foreground/60">Created</div>
                        <div>{new Date(filteredCapsules[0].createdAt).toLocaleDateString()}</div>
                      </div>
                      {filteredCapsules[0].openedAt && (
                        <div>
                          <div className="text-foreground/60">Opened</div>
                          <div>{new Date(filteredCapsules[0].openedAt).toLocaleDateString()}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-foreground/60">Views</div>
                        <div>{filteredCapsules[0].viewCount || 0}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => {
                          dispatch(setCurrentCapsule(filteredCapsules[0]));
                          dispatch(openModal({ type: 'viewCapsule', data: filteredCapsules[0] }));
                          if (incrementViewCount) incrementViewCount(parseInt(filteredCapsules[0].id));
                        }}
                      >
                        View Details
                      </Button>
                      <Button variant="secondary" href={`/capsule/${filteredCapsules[0].id}`}>
                        Blockchain Info
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
            </div>
          ) : exploreError ? (
            <div className="text-center py-10 rounded-lg border border-red-500/20 bg-red-500/5">
              <h3 className="text-xl mb-2 text-red-500">Error</h3>
              <p className="text-foreground/60 mb-4">{exploreError}</p>
              <Button onClick={() => window.location.reload()} variant="secondary" size="sm">
                Try Again
              </Button>
            </div>
          ) : filteredCapsules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCapsules.map((capsule) => (
                <CapsuleCard 
                  key={capsule.id} 
                  capsule={capsule} 
                  onView={() => incrementViewCount(parseInt(capsule.id))}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl mb-2">No time capsules found</h3>
              <p className="text-foreground/60 mb-6">
                {filter === 'all' 
                  ? `There are no ${category} time capsules available right now.` 
                  : `There are no ${filter} time capsules in the ${category} category.`}
              </p>
              <Button href="/create" variant="primary">
                Create Your Own Capsule
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}