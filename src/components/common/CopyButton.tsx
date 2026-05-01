import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';

interface CopyButtonProps {
  text: string;
  themeColors?: typeof colors.dark;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, themeColors }) => {
  const { settings } = useSettingsStore();
  const theme = themeColors || colors[settings.theme];

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {}}
    >
      <Text style={[styles.icon, { color: theme.textMuted }]}>{'\u{1F4CB}'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  icon: {
    fontSize: 14,
  },
});
