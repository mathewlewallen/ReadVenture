/**
 * Settings Slice
 *
 * Manages global application settings state including reading preferences,
 * sound effects, text size, and other user configurations.
 *
 * @packageDocumentation
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SettingsState {
  soundEnabled: boolean;
  textSize: 'small' | 'medium' | 'large';
  readingSpeed: number;
  highlightingColor: string;
  isSettingsOpen: boolean;
}

const initialState: SettingsState = {
  soundEnabled: true,
  textSize: 'medium',
  readingSpeed: 120,
  highlightingColor: '#FFD700',
  isSettingsOpen: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
    toggleSettings: (state) => {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
    resetSettings: () => initialState,
  },
});

export const { updateSettings, toggleSettings, resetSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
