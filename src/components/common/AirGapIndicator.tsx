import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';

export const AirGapIndicator: React.FC = () => {
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme];

  if (!settings.airGapMode) return null;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.success + '15' }]}>
      <Text style={styles.icon}>{'\u{1F512}'}</Text>
      <Text style={[styles.text, { color: themeColors.success }]}>
        Air-Gap Mode: 0% data leaves this device
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  icon: {
    fontSize: 12,
    marginRight: spacing.sm,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
