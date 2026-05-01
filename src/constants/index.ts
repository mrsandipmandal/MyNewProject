export const APP_NAME = 'LocalMind AI';
export const APP_VERSION = '0.1.0';

export const DEFAULT_MODEL_CONFIG = {
  contextLength: 4096,
  threads: 4,
  gpuLayers: 35,
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1,
  maxTokens: 2048,
};

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  showThoughtChain: false,
  hapticFeedback: true,
  airGapMode: true,
  powerSaving: false,
  autoSaveChats: true,
  defaultContextLength: 4096,
  defaultThreads: 4,
};

export const MAX_RAM_MB = 4096;
export const MIN_FREE_MEMORY_MB = 512;

export const MODEL_DIR = 'models';
export const CHAT_STORAGE_KEY = 'localmind_chats';
export const SETTINGS_STORAGE_KEY = 'localmind_settings';
export const RAG_INDEX_DIR = 'rag_indexes';
