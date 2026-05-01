import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Chat, AppSettings } from '../../types';
import { CHAT_STORAGE_KEY, SETTINGS_STORAGE_KEY } from '../../constants';

export class StorageService {
  async getChats(): Promise<Chat[]> {
    try {
      const data = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async saveChats(chats: Chat[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Failed to save chats:', error);
    }
  }

  async saveChat(chat: Chat): Promise<void> {
    try {
      const chats = await this.getChats();
      const index = chats.findIndex((c) => c.id === chat.id);
      if (index >= 0) {
        chats[index] = chat;
      } else {
        chats.push(chat);
      }
      await this.saveChats(chats);
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  }

  async deleteChat(chatId: string): Promise<void> {
    try {
      const chats = await this.getChats();
      await this.saveChats(chats.filter((c) => c.id !== chatId));
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  }

  async getSettings(): Promise<AppSettings | null> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
}

export const storageService = new StorageService();
