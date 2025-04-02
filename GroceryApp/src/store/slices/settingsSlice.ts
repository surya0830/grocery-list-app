import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: boolean;
  currency: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: 'system',
  language: 'en',
  notifications: true,
  currency: 'USD',
  location: null,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<SettingsState['theme']>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setLocation: (state, action: PayloadAction<SettingsState['location']>) => {
      state.location = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetSettings: (state) => {
      return initialState;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  toggleNotifications,
  setCurrency,
  setLocation,
  setLoading,
  setError,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer; 