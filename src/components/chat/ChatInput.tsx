import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';
import { useModelStore } from '../../stores/modelStore';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onStop?: () => void;
  isStreaming?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChangeText,
  onSend,
  onStop,
  isStreaming = false,
}) => {
  const { settings } = useSettingsStore();
  const { isLoaded } = useModelStore();
  const themeColors = colors[settings.theme];
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    if (value.trim() && isLoaded) {
      onSend();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: themeColors.surface }]}>
        <View style={[styles.inputWrapper, { backgroundColor: themeColors.surfaceElevated, borderColor: themeColors.border }]}>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Message LocalMind..."
            placeholderTextColor={themeColors.textMuted}
            value={value}
            onChangeText={onChangeText}
            multiline
            maxLength={4000}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
            editable={!isStreaming}
          />
        </View>
        {isStreaming ? (
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: themeColors.accent }]}
            onPress={onStop}
          >
            <Text style={styles.sendButtonText}>{'\u25A0'}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: value.trim() && isLoaded ? themeColors.primary : themeColors.textMuted,
                opacity: !isLoaded ? 0.5 : 1,
              },
            ]}
            onPress={handleSend}
            disabled={!value.trim() || !isLoaded}
          >
            <Text style={styles.sendButtonText}>{'\u2191'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});
