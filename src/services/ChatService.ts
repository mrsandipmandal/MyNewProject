import type { Message, ModelConfig } from '../types';
import { llamaEngine } from './llama/LlamaEngine';
import { useChatStore } from '../stores/chatStore';
import { useModelStore } from '../stores/modelStore';
import { useAgentStore } from '../stores/agentStore';
import { v4 as uuidv4 } from 'react-native-uuid';

export class ChatService {
  private abortController: AbortController | null = null;

  async sendMessage(
    content: string,
    config: ModelConfig
  ): Promise<void> {
    const { addMessage, setStreaming, appendStreamingContent, setStreamingContent } =
      useChatStore.getState();
    const { activePersona } = useAgentStore.getState();

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    addMessage(userMessage);

    const assistantMessageId = uuidv4();
    addMessage({
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    });

    setStreaming(true);
    setStreamingContent('');

    const systemPrompt = activePersona?.systemPrompt || '';
    const messages = useChatStore.getState().messages;
    const fullPrompt = this.buildPrompt(systemPrompt, messages);

    let fullResponse = '';

    try {
      await llamaEngine.generate(
        fullPrompt,
        config,
        (token) => {
          fullResponse += token;
          appendStreamingContent(token);
        },
        () => {
          setStreaming(false);
          useChatStore.getState().updateLastMessage({
            content: fullResponse,
            isStreaming: false,
          });
        },
        (error) => {
          setStreaming(false);
          useChatStore.getState().updateLastMessage({
            content: `Error: ${error}`,
            isStreaming: false,
          });
        }
      );
    } catch (error) {
      setStreaming(false);
      useChatStore.getState().updateLastMessage({
        content: `Error: ${(error as Error).message}`,
        isStreaming: false,
      });
    }
  }

  stopGeneration(): void {
    llamaEngine.stopGeneration();
    useChatStore.getState().setStreaming(false);
    useChatStore.getState().updateLastMessage({ isStreaming: false });
  }

  private buildPrompt(systemPrompt: string, messages: Message[]): string {
    let prompt = '';

    if (systemPrompt) {
      prompt += `<|system|>\n${systemPrompt}</s>\n`;
    }

    for (const msg of messages) {
      if (msg.role === 'user') {
        prompt += `<|user|>\n${msg.content}</s>\n`;
      } else if (msg.role === 'assistant') {
        prompt += `<|assistant|>\n${msg.content}</s>\n`;
      }
    }

    prompt += '<|assistant|>\n';
    return prompt;
  }
}

export const chatService = new ChatService();
