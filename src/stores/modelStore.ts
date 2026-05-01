import { create } from 'zustand';
import type { GGUFModel, ModelConfig } from '../types';
import { DEFAULT_MODEL_CONFIG } from '../constants';

interface ModelState {
  models: GGUFModel[];
  activeModel: GGUFModel | null;
  config: ModelConfig;
  isLoading: boolean;
  isLoaded: boolean;
  ramUsageMB: number;
  totalRamMB: number;
  loadProgress: number;
  setModels: (models: GGUFModel[]) => void;
  setActiveModel: (model: GGUFModel | null) => void;
  setConfig: (config: Partial<ModelConfig>) => void;
  setLoading: (loading: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setRamUsage: (usage: number) => void;
  setTotalRam: (total: number) => void;
  setLoadProgress: (progress: number) => void;
}

export const useModelStore = create<ModelState>((set) => ({
  models: [],
  activeModel: null,
  config: DEFAULT_MODEL_CONFIG,
  isLoading: false,
  isLoaded: false,
  ramUsageMB: 0,
  totalRamMB: 0,
  loadProgress: 0,
  setModels: (models) => set({ models }),
  setActiveModel: (model) => set({ activeModel: model }),
  setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
  setLoading: (loading) => set({ isLoading: loading }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setRamUsage: (ramUsageMB) => set({ ramUsageMB }),
  setTotalRam: (totalRamMB) => set({ totalRamMB }),
  setLoadProgress: (loadProgress) => set({ loadProgress }),
}));
