import { create } from 'zustand';
import type { Persona, AgentTask } from '../types';

const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'Helpful and versatile AI assistant',
    systemPrompt: 'You are a helpful AI assistant. Provide clear, accurate, and concise responses.',
    icon: 'brain',
    color: '#6C63FF',
  },
  {
    id: 'developer',
    name: 'Code Expert',
    description: 'Specialized in programming and software engineering',
    systemPrompt:
      'You are an expert software engineer. Write clean, well-documented code. Explain concepts clearly with examples.',
    icon: 'code',
    color: '#00D4AA',
  },
  {
    id: 'creative',
    name: 'Creative Writer',
    description: 'Imaginative and expressive writing assistant',
    systemPrompt:
      'You are a creative writing assistant. Help with storytelling, poetry, and expressive writing. Be imaginative.',
    icon: 'pen',
    color: '#FF6B6B',
  },
  {
    id: 'analyst',
    name: 'Data Analyst',
    description: 'Analytical reasoning and data interpretation',
    systemPrompt:
      'You are a data analyst. Break down complex problems, provide structured analysis, and support conclusions with reasoning.',
    icon: 'chart',
    color: '#FFD60A',
  },
];

interface AgentState {
  personas: Persona[];
  activePersona: Persona;
  agentMode: boolean;
  tasks: AgentTask[];
  isProcessingTasks: boolean;
  setPersonas: (personas: Persona[]) => void;
  setActivePersona: (persona: Persona) => void;
  setAgentMode: (enabled: boolean) => void;
  addTask: (task: AgentTask) => void;
  updateTask: (id: string, updates: Partial<AgentTask>) => void;
  setProcessingTasks: (processing: boolean) => void;
  clearTasks: () => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  personas: DEFAULT_PERSONAS,
  activePersona: DEFAULT_PERSONAS[0],
  agentMode: false,
  tasks: [],
  isProcessingTasks: false,
  setPersonas: (personas) => set({ personas }),
  setActivePersona: (persona) => set({ activePersona: persona }),
  setAgentMode: (enabled) => set({ agentMode: enabled }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  setProcessingTasks: (processing) => set({ isProcessingTasks: processing }),
  clearTasks: () => set({ tasks: [] }),
}));
