import { create } from 'zustand';
import type { Message } from '../types';

interface ChatState {
  currentChatId: string | null;
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (updates: Partial<Message>) => void;
  setStreaming: (streaming: boolean) => void;
  setStreamingContent: (content: string) => void;
  appendStreamingContent: (chunk: string) => void;
  clearChat: () => void;
  setCurrentChatId: (id: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChatId: null,
  messages: [],
  isStreaming: false,
  streamingContent: '',
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (updates) =>
    set((state) => ({
      messages: state.messages.map((msg, i) =>
        i === state.messages.length - 1 ? { ...msg, ...updates } : msg
      ),
    })),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setStreamingContent: (content) => set({ streamingContent: content }),
  appendStreamingContent: (chunk) =>
    set((state) => ({ streamingContent: state.streamingContent + chunk })),
  clearChat: () => set({ messages: [], streamingContent: '', isStreaming: false }),
  setCurrentChatId: (id) => set({ currentChatId: id }),
}));
