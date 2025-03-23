import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Capsule {
  id: string;
  title: string;
  content: string;
  openCondition: {
    type: 'time' | 'multisig' | 'oracle' | 'compound';
    value: any;
  };
  assets: {
    type: string;
    value: string;
  }[];
  recipientAddress: string;
  status: 'sealed' | 'opened' | 'pending';
  createdAt: number;
  openedAt?: number;
  viewCount?: number;
  shareCount?: number;
  subscriptionCount?: number;
  featured?: boolean;
  description?: string;
}

interface CapsuleState {
  capsules: Capsule[];
  currentCapsule: Capsule | null;
  loading: boolean;
  error: string | null;
  popularCapsules: Capsule[];
  featuredCapsules: Capsule[];
  recentlyOpenedCapsules: Capsule[];
  mostSubscribedCapsules: Capsule[];
  exploreCapsules: Capsule[];
  exploreLoading: boolean;
  exploreError: string | null;
}

const initialState: CapsuleState = {
  capsules: [],
  currentCapsule: null,
  loading: false,
  error: null,
  popularCapsules: [],
  featuredCapsules: [],
  recentlyOpenedCapsules: [],
  mostSubscribedCapsules: [],
  exploreCapsules: [],
  exploreLoading: false,
  exploreError: null,
};

export const capsuleSlice = createSlice({
  name: 'capsule',
  initialState,
  reducers: {
    setCapsules: (state, action: PayloadAction<Capsule[]>) => {
      state.capsules = action.payload;
    },
    addCapsule: (state, action: PayloadAction<Capsule>) => {
      state.capsules.push(action.payload);
    },
    setCurrentCapsule: (state, action: PayloadAction<Capsule | null>) => {
      state.currentCapsule = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateCapsuleStatus: (state, action: PayloadAction<{ id: string; status: 'sealed' | 'opened' | 'pending' }>) => {
      const capsule = state.capsules.find(c => c.id === action.payload.id);
      if (capsule) {
        capsule.status = action.payload.status;
        if (action.payload.status === 'opened') {
          capsule.openedAt = Date.now();
        }
      }
    },
    setPopularCapsules: (state, action: PayloadAction<Capsule[]>) => {
      state.popularCapsules = action.payload;
    },
    setFeaturedCapsules: (state, action: PayloadAction<Capsule[]>) => {
      state.featuredCapsules = action.payload;
    },
    setRecentlyOpenedCapsules: (state, action: PayloadAction<Capsule[]>) => {
      state.recentlyOpenedCapsules = action.payload;
    },
    setMostSubscribedCapsules: (state, action: PayloadAction<Capsule[]>) => {
      state.mostSubscribedCapsules = action.payload;
    },
    setExploreCapsules: (state, action: PayloadAction<Capsule[]>) => {
      state.exploreCapsules = action.payload;
    },
    setExploreLoading: (state, action: PayloadAction<boolean>) => {
      state.exploreLoading = action.payload;
    },
    setExploreError: (state, action: PayloadAction<string | null>) => {
      state.exploreError = action.payload;
    },
    incrementCapsuleViewCount: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const capsule = state.capsules.find(c => c.id === id);
      if (capsule && capsule.viewCount !== undefined) {
        capsule.viewCount += 1;
      }
      
      // Also update in the explore sections if present
      [state.popularCapsules, state.featuredCapsules, state.recentlyOpenedCapsules, 
       state.mostSubscribedCapsules, state.exploreCapsules].forEach(list => {
        const capsuleInList = list.find(c => c.id === id);
        if (capsuleInList && capsuleInList.viewCount !== undefined) {
          capsuleInList.viewCount += 1;
        }
      });
    },
  },
});

export const {
  setCapsules,
  addCapsule,
  setCurrentCapsule,
  setLoading,
  setError,
  updateCapsuleStatus,
  setPopularCapsules,
  setFeaturedCapsules,
  setRecentlyOpenedCapsules,
  setMostSubscribedCapsules,
  setExploreCapsules,
  setExploreLoading,
  setExploreError,
  incrementCapsuleViewCount,
} = capsuleSlice.actions;

export default capsuleSlice.reducer;