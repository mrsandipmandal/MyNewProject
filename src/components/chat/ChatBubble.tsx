import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated as RNAnimated,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { colors, borderRadius, spacing } from '../../theme';
import type { Message } from '../../types';
import { useSettingsStore } from '../../stores/settingsStore';
import { CopyButton } from '../common/CopyButton';

interface ChatBubbleProps {
  message: Message;
  onRegenerate?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onRegenerate }) => {
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme];
  const [showThoughtChain, setShowThoughtChain] = useState(false);

  const isUser = message.role === 'user';

  const styles = createStyles(themeColors, isUser);

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {message.thoughtChain && settings.showThoughtChain && (
        <View style={styles.thoughtContainer}>
          <TouchableOpacity
            style={styles.thoughtHeader}
            onPress={() => setShowThoughtChain(!showThoughtChain)}
          >
            <Text style={styles.thoughtLabel}>Thought Process</Text>
            <Text style={styles.thoughtToggle}>{showThoughtChain ? '−' : '+'}</Text>
          </TouchableOpacity>
          {showThoughtChain && (
            <Text style={styles.thoughtText}>{message.thoughtChain}</Text>
          )}
        </View>
      )}

      <View style={[styles.bubble, message.isStreaming && styles.streamingBubble]}>
        {isUser ? (
          <Text style={styles.userText}>{message.content}</Text>
        ) : (
          <>
            <Markdown style={markdownStyles(themeColors)}>{message.content}</Markdown>
            {message.isStreaming && <Text style={styles.cursor}>{'\u25AE'}</Text>}
          </>
        )}
      </View>

      {!isUser && !message.isStreaming && (
        <View style={styles.actions}>
          <CopyButton text={message.content} themeColors={themeColors} />
          {onRegenerate && (
            <TouchableOpacity style={styles.actionButton} onPress={onRegenerate}>
              <Text style={styles.actionText}>Regenerate</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = (themeColors: typeof colors.dark, isUser: boolean) =>
  StyleSheet.create({
    container: {
      marginVertical: spacing.sm,
      marginHorizontal: spacing.md,
    },
    userContainer: {
      alignItems: 'flex-end',
    },
    assistantContainer: {
      alignItems: 'flex-start',
    },
    thoughtContainer: {
      backgroundColor: themeColors.glass,
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: themeColors.glassBorder,
    },
    thoughtHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    thoughtLabel: {
      color: themeColors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
    },
    thoughtToggle: {
      color: themeColors.primary,
      fontSize: 14,
      fontWeight: '600',
    },
    thoughtText: {
      color: themeColors.textMuted,
      fontSize: 13,
      marginTop: spacing.sm,
      fontStyle: 'italic',
    },
    bubble: {
      maxWidth: '85%',
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      backgroundColor: isUser ? 'transparent' : themeColors.assistantBubble,
      borderWidth: isUser ? 0 : 1,
      borderColor: themeColors.border,
    },
    streamingBubble: {
      borderColor: themeColors.primaryGlow,
    },
    userText: {
      color: '#FFFFFF',
      fontSize: 16,
      lineHeight: 24,
    },
    cursor: {
      color: themeColors.primary,
      fontSize: 16,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    actionButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    actionText: {
      color: themeColors.textMuted,
      fontSize: 12,
    },
  });

const markdownStyles = (themeColors: typeof colors.dark) => ({
  body: {
    color: themeColors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  code_block: {
    backgroundColor: themeColors.codeBlock,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
  },
  code_inline: {
    backgroundColor: themeColors.glass,
    padding: 2,
    borderRadius: 4,
    color: themeColors.codeFunction,
    fontFamily: 'monospace',
  },
  fence: {
    backgroundColor: themeColors.codeBlock,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: themeColors.border,
    marginVertical: spacing.sm,
  },
  paragraph: {
    marginVertical: spacing.sm / 2,
    color: themeColors.text,
  },
  heading1: {
    color: themeColors.text,
    fontSize: 24,
    fontWeight: '700',
    marginVertical: spacing.sm,
  },
  heading2: {
    color: themeColors.text,
    fontSize: 20,
    fontWeight: '600',
    marginVertical: spacing.sm,
  },
  heading3: {
    color: themeColors.text,
    fontSize: 18,
    fontWeight: '600',
    marginVertical: spacing.xs,
  },
  strong: {
    fontWeight: '700',
    color: themeColors.text,
  },
  em: {
    fontStyle: 'italic',
    color: themeColors.text,
  },
  link: {
    color: themeColors.primary,
  },
  blockquote: {
    borderLeftColor: themeColors.primary,
    borderLeftWidth: 3,
    paddingLeft: spacing.md,
    marginLeft: spacing.sm,
    color: themeColors.textSecondary,
  },
  list_item: {
    color: themeColors.text,
    flexDirection: 'row',
  },
  bullet_list: {
    color: themeColors.text,
  },
  ordered_list: {
    color: themeColors.text,
  },
  table: {
    borderWidth: 1,
    borderColor: themeColors.border,
    borderRadius: borderRadius.sm,
    marginVertical: spacing.sm,
  },
  thead: {
    backgroundColor: themeColors.glass,
  },
  th: {
    color: themeColors.text,
    fontWeight: '600',
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  td: {
    color: themeColors.text,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  hr: {
    backgroundColor: themeColors.border,
    height: 1,
    marginVertical: spacing.md,
  },
});
