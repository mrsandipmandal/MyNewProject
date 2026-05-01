import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing } from '../theme';
import { ChatBubble, ChatInput, ModelOrb, Sidebar, AirGapIndicator } from '../components';
import { useChatStore } from '../stores/chatStore';
import { useModelStore } from '../stores/modelStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useHaptics } from '../hooks/useHaptics';
import { chatService } from '../services';
import type { Persona } from '../types';

export const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { messages, isStreaming, clearChat, setCurrentChatId } = useChatStore();
  const { config } = useModelStore();
  const { settings } = useSettingsStore();
  const { onGenerationComplete } = useHaptics();
  const themeColors = colors[settings.theme];

  useEffect(() => {
    setCurrentChatId(Date.now().toString());
    return () => setCurrentChatId(null);
  }, []);

  useEffect(() => {
    if (!isStreaming && messages.length > 0) {
      onGenerationComplete();
    }
  }, [isStreaming]);

  const handleSend = useCallback(() => {
    if (inputText.trim()) {
      chatService.sendMessage(inputText.trim(), config);
      setInputText('');
    }
  }, [inputText, config]);

  const handleStop = useCallback(() => {
    chatService.stopGeneration();
  }, []);

  const handlePersonaSelect = useCallback((_persona: Persona) => {
    setSidebarOpen(false);
    clearChat();
  }, []);

  const renderMessage = useCallback(
    ({ item }) => <ChatBubble message={item} />,
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarOpen(true)}
        >
          <Text style={[styles.menuIcon, { color: themeColors.text }]}>{'\u2630'}</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>LocalMind AI</Text>
        </View>

        <ModelOrb size={36} />
      </View>

      <AirGapIndicator />

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyIcon, { color: themeColors.primary }]}>{'\u{1F9E0}'}</Text>
          <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
            Your Local AI Assistant
          </Text>
          <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>
            100% private. Runs entirely on your device.
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSend}
        onStop={handleStop}
        isStreaming={isStreaming}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onPersonaSelect={handlePersonaSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : spacing.md,
    borderBottomWidth: 1,
  },
  menuButton: {
    padding: spacing.xs,
  },
  menuIcon: {
    fontSize: 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
