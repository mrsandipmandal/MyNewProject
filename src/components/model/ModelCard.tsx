import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';
import type { GGUFModel } from '../../types';

interface ModelCardProps {
  model: GGUFModel;
  onSelect: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  onSelect,
  onDownload,
  onDelete,
}) => {
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: themeColors.surfaceElevated, borderColor: themeColors.border }]}
      onPress={onSelect}
    >
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: themeColors.text }]}>{model.name}</Text>
          <View style={styles.badges}>
            <Text style={[styles.badge, { backgroundColor: themeColors.primary + '30', color: themeColors.primary }]}>
              {model.quantization}
            </Text>
            <Text style={[styles.badge, { backgroundColor: themeColors.glass, color: themeColors.textSecondary }]}>
              {model.parameters}
            </Text>
          </View>
        </View>
        <Text style={[styles.size, { color: themeColors.textMuted }]}>{formatSize(model.size)}</Text>
      </View>

      {model.isDownloaded ? (
        <View style={styles.downloadedRow}>
          <Text style={[styles.downloadedText, { color: themeColors.success }]}>
            {'\u2705'} Ready
          </Text>
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Text style={[styles.deleteText, { color: themeColors.error }]}>{'\u{1F5D1}'}</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : model.downloadProgress !== undefined && model.downloadProgress > 0 ? (
        <View style={styles.downloadRow}>
          <View style={[styles.progressBar, { backgroundColor: themeColors.glass }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: themeColors.primary,
                  width: `${model.downloadProgress}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: themeColors.textSecondary }]}>
            {Math.round(model.downloadProgress)}%
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.downloadButton, { backgroundColor: themeColors.primary }]}
          onPress={onDownload}
        >
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const formatSize = (bytes: number): string => {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`;
  return `${bytes} B`;
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    fontSize: 11,
    fontWeight: '600',
  },
  size: {
    fontSize: 13,
  },
  downloadedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  downloadedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteText: {
    fontSize: 16,
  },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    minWidth: 40,
    textAlign: 'right',
  },
  downloadButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
