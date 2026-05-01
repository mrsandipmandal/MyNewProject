import { NativeModules, NativeEventEmitter } from 'react-native';
import type { ModelConfig } from '../../types';

const { LlamaEngineModule } = NativeModules;

interface LlamaEvent {
  type: 'token' | 'complete' | 'error' | 'progress' | 'tool_call';
  data?: string;
  error?: string;
  progress?: number;
  toolCall?: {
    name: string;
    parameters: Record<string, unknown>;
  };
}

class LlamaEngine {
  private eventEmitter: NativeEventEmitter | null = null;
  private listeners: Map<string, (event: LlamaEvent) => void> = new Map();

  constructor() {
    if (LlamaEngineModule) {
      this.eventEmitter = new NativeEventEmitter(LlamaEngineModule);
    }
  }

  async initialize(config: ModelConfig): Promise<boolean> {
    if (!LlamaEngineModule) {
      console.warn('LlamaEngineModule not available, running in mock mode');
      return false;
    }
    try {
      return await LlamaEngineModule.initialize({
        modelPath: config.modelId,
        contextLength: config.contextLength,
        threads: config.threads,
        gpuLayers: config.gpuLayers,
      });
    } catch (error) {
      console.error('Failed to initialize Llama engine:', error);
      return false;
    }
  }

  async loadModel(modelPath: string, config: ModelConfig): Promise<boolean> {
    if (!LlamaEngineModule) return false;
    try {
      return await LlamaEngineModule.loadModel(modelPath, {
        contextLength: config.contextLength,
        threads: config.threads,
        gpuLayers: config.gpuLayers,
      });
    } catch (error) {
      console.error('Failed to load model:', error);
      return false;
    }
  }

  async unloadModel(): Promise<void> {
    if (!LlamaEngineModule) return;
    try {
      await LlamaEngineModule.unloadModel();
    } catch (error) {
      console.error('Failed to unload model:', error);
    }
  }

  async generate(
    prompt: string,
    config: ModelConfig,
    onToken?: (token: string) => void,
    onComplete?: () => void,
    onError?: (error: string) => void
  ): Promise<string> {
    if (!LlamaEngineModule) {
      return this.mockGenerate(prompt, onToken, onComplete);
    }

    return new Promise((resolve, reject) => {
      const tokenListener = this.eventEmitter?.addListener('onToken', (event: LlamaEvent) => {
        if (event.type === 'token' && event.data) {
          onToken?.(event.data);
        }
      });

      const completeListener = this.eventEmitter?.addListener('onComplete', (event: LlamaEvent) => {
        tokenListener?.remove();
        completeListener?.remove();
        onComplete?.();
        resolve(event.data || '');
      });

      const errorListener = this.eventEmitter?.addListener('onError', (event: LlamaEvent) => {
        tokenListener?.remove();
        completeListener?.remove();
        errorListener?.remove();
        onError?.(event.error || 'Unknown error');
        reject(new Error(event.error));
      });

      LlamaEngineModule.generate(prompt, {
        temperature: config.temperature,
        topP: config.topP,
        topK: config.topK,
        repeatPenalty: config.repeatPenalty,
        maxTokens: config.maxTokens,
      }).catch(reject);
    });
  }

  async stopGeneration(): Promise<void> {
    if (!LlamaEngineModule) return;
    try {
      await LlamaEngineModule.stopGeneration();
    } catch (error) {
      console.error('Failed to stop generation:', error);
    }
  }

  async getRamUsage(): Promise<{ used: number; total: number }> {
    if (!LlamaEngineModule) return { used: 0, total: 0 };
    try {
      return await LlamaEngineModule.getRamUsage();
    } catch {
      return { used: 0, total: 0 };
    }
  }

  private async mockGenerate(
    _prompt: string,
    onToken?: (token: string) => void,
    onComplete?: () => void
  ): Promise<string> {
    const mockResponse =
      "This is a mock response. The native LlamaEngineModule is not yet linked. " +
      "Once you integrate llama.cpp via a React Native bridge, full inference will work. " +
      "See the android/ and ios/ native directories for the bridge configuration.";

    for (const word of mockResponse.split(' ')) {
      onToken?.(word + ' ');
      await new Promise((r) => setTimeout(r, 50));
    }
    onComplete?.();
    return mockResponse;
  }
}

export const llamaEngine = new LlamaEngine();
