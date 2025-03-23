import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  }[];
  modal: {
    isOpen: boolean;
    type: string | null;
    data: any;
  };
}

const initialState: UIState = {
  theme: 'dark',
  sidebarOpen: false,
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<{ type: 'success' | 'error' | 'info'; message: string }>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
  },
});

export const {
  toggleTheme,
  setSidebar,
  addNotification,
  removeNotification,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;