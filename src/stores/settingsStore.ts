import { create } from 'zustand';
import type { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  toggleShowThoughtChain: () => void;
  toggleHapticFeedback: () => void;
  toggleAirGapMode: () => void;
  togglePowerSaving: () => void;
  setTheme: (theme: 'dark' | 'light' | 'amoled') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,
  updateSettings: (updates) =>
    set((state) => ({ settings: { ...state.settings, ...updates } })),
  toggleShowThoughtChain: () =>
    set((state) => ({
      settings: { ...state.settings, showThoughtChain: !state.settings.showThoughtChain },
    })),
  toggleHapticFeedback: () =>
    set((state) => ({
      settings: { ...state.settings, hapticFeedback: !state.settings.hapticFeedback },
    })),
  toggleAirGapMode: () =>
    set((state) => ({
      settings: { ...state.settings, airGapMode: !state.settings.airGapMode },
    })),
  togglePowerSaving: () =>
    set((state) => ({
      settings: { ...state.settings, powerSaving: !state.settings.powerSaving },
    })),
  setTheme: (theme) =>
    set((state) => ({ settings: { ...state.settings, theme } })),
}));
