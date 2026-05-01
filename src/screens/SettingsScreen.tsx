import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { useSettingsStore } from '../stores/settingsStore';
import { useModelStore } from '../stores/modelStore';

export const SettingsScreen: React.FC = () => {
  const { settings, toggleShowThoughtChain, toggleHapticFeedback, toggleAirGapMode, togglePowerSaving, setTheme } = useSettingsStore();
  const { config, setConfig } = useModelStore();
  const themeColors = colors[settings.theme];

  const SettingRow = ({
    label,
    description,
    value,
    onToggle,
  }: {
    label: string;
    description?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: themeColors.surfaceElevated, borderColor: themeColors.border }]}
      onPress={onToggle}
    >
      <View style={styles.rowInfo}>
        <Text style={[styles.rowLabel, { color: themeColors.text }]}>{label}</Text>
        {description && (
          <Text style={[styles.rowDesc, { color: themeColors.textMuted }]}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: themeColors.textMuted, true: themeColors.primary }}
        thumbColor="#FFFFFF"
      />
    </TouchableOpacity>
  );

  const SliderRow = ({
    label,
    value,
    min,
    max,
    step,
    onChange,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (val: number) => void;
  }) => (
    <View style={[styles.row, { backgroundColor: themeColors.surfaceElevated, borderColor: themeColors.border }]}>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowLabel, { color: themeColors.text }]}>{label}</Text>
      </View>
      <View style={styles.sliderControls}>
        <TouchableOpacity
          style={[styles.sliderButton, { backgroundColor: themeColors.glass }]}
          onPress={() => onChange(Math.max(min, value - step))}
        >
          <Text style={{ color: themeColors.text }}>{'−'}</Text>
        </TouchableOpacity>
        <Text style={[styles.sliderValue, { color: themeColors.text }]}>{value}</Text>
        <TouchableOpacity
          style={[styles.sliderButton, { backgroundColor: themeColors.glass }]}
          onPress={() => onChange(Math.min(max, value + step))}
        >
          <Text style={{ color: themeColors.text }}>{'+'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={[styles.sectionHeader, { color: themeColors.textSecondary }]}>Appearance</Text>
        <View style={styles.themeRow}>
          {(['dark', 'amoled', 'light'] as const).map((theme) => (
            <TouchableOpacity
              key={theme}
              style={[
                styles.themeButton,
                {
                  backgroundColor: theme === settings.theme ? themeColors.primary : themeColors.surfaceElevated,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={() => setTheme(theme)}
            >
              <Text
                style={{
                  color: theme === settings.theme ? '#FFFFFF' : themeColors.text,
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}
              >
                {theme}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionHeader, { color: themeColors.textSecondary }]}>Privacy & Feedback</Text>
        <SettingRow
          label="Air-Gap Mode"
          description="Ensure zero data leaves the device"
          value={settings.airGapMode}
          onToggle={toggleAirGapMode}
        />
        <SettingRow
          label="Haptic Feedback"
          description="Vibrations on AI response completion"
          value={settings.hapticFeedback}
          onToggle={toggleHapticFeedback}
        />
        <SettingRow
          label="Show Thought Chain"
          description="Display model's internal reasoning"
          value={settings.showThoughtChain}
          onToggle={toggleShowThoughtChain}
        />
        <SettingRow
          label="Power Saving"
          description="Reduce threads and context length"
          value={settings.powerSaving}
          onToggle={togglePowerSaving}
        />

        <Text style={[styles.sectionHeader, { color: themeColors.textSecondary }]}>Model Parameters</Text>
        <SliderRow
          label="Temperature"
          value={config.temperature}
          min={0.1}
          max={2}
          step={0.1}
          onChange={(v) => setConfig({ temperature: v })}
        />
        <SliderRow
          label="Context Length"
          value={config.contextLength}
          min={512}
          max={8192}
          step={512}
          onChange={(v) => setConfig({ contextLength: v })}
        />
        <SliderRow
          label="Threads"
          value={config.threads}
          min={1}
          max={8}
          step={1}
          onChange={(v) => setConfig({ threads: v })}
        />
        <SliderRow
          label="Max Tokens"
          value={config.maxTokens}
          min={256}
          max={4096}
          step={256}
          onChange={(v) => setConfig({ maxTokens: v })}
        />

        <View style={styles.footer}>
          <Text style={[styles.version, { color: themeColors.textMuted }]}>LocalMind AI v0.1.0</Text>
          <Text style={[styles.tagline, { color: themeColors.textMuted }]}>
            100% Local. 100% Private.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingTop: 50,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  sliderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'center',
  },
  themeRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  themeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  footer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
  },
  tagline: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
