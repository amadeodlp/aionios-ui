import { configureStore } from '@reduxjs/toolkit';
import capsuleReducer from './slices/capsuleSlice';
import walletReducer from './slices/walletSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    capsule: capsuleReducer,
    wallet: walletReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;