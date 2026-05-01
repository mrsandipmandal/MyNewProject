export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thoughtChain?: string;
  timestamp: number;
  isStreaming?: boolean;
  toolCalls?: ToolCall[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  personaId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon: string;
  color: string;
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, unknown>;
  result?: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface GGUFModel {
  id: string;
  name: string;
  path?: string;
  size: number;
  quantization: string;
  architecture: string;
  parameters: string;
  downloadUrl?: string;
  isDownloaded: boolean;
  downloadProgress?: number;
}

export interface ModelConfig {
  modelId: string;
  contextLength: number;
  threads: number;
  gpuLayers: number;
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  maxTokens: number;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'amoled';
  showThoughtChain: boolean;
  hapticFeedback: boolean;
  airGapMode: boolean;
  powerSaving: boolean;
  autoSaveChats: boolean;
  defaultModel?: string;
  defaultContextLength: number;
  defaultThreads: number;
}

export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: string;
}

export interface RagDocument {
  id: string;
  name: string;
  path: string;
  type: 'pdf' | 'txt' | 'md';
  size: number;
  indexedAt: number;
  chunkCount: number;
}
