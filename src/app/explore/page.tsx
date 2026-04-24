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
  const { exploreCapsules, exploreError } = useSelector((state: RootState) => state.capsule);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchExploreCapsules = async () => {
      dispatch(setExploreLoading(true));
      dispatch(setExploreError(null));
      setIsLoading(true);

      try {
        let fetchedCapsules: Capsule[] = [];
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
        dispatch(setExploreCapsules(fetchedCapsules));
      } catch (error) {
        console.error('Error fetching capsules:', error);
        dispatch(setExploreError('Failed to fetch capsules. Please try again later.'));
      } finally {
        dispatch(setExploreLoading(false));
        setIsLoading(false);
      }
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