import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, borderRadius } from '../theme';
import { ModelCard } from '../components';
import { useModelStore } from '../stores/modelStore';
import { useSettingsStore } from '../stores/settingsStore';
import type { GGUFModel } from '../types';

const SAMPLE_MODELS: GGUFModel[] = [
  {
    id: 'llama-3.2-1b-q4_k_m',
    name: 'Llama 3.2 1B',
    size: 740000000,
    quantization: 'Q4_K_M',
    architecture: 'llama',
    parameters: '1B',
    downloadUrl: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF',
    isDownloaded: false,
  },
  {
    id: 'llama-3.2-3b-q4_k_m',
    name: 'Llama 3.2 3B',
    size: 2000000000,
    quantization: 'Q4_K_M',
    architecture: 'llama',
    parameters: '3B',
    downloadUrl: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF',
    isDownloaded: false,
  },
  {
    id: 'phi-3-mini-q4_k_m',
    name: 'Phi-3 Mini',
    size: 2300000000,
    quantization: 'Q4_K_M',
    architecture: 'phi3',
    parameters: '3.8B',
    downloadUrl: 'https://huggingface.co/bartowski/Phi-3-mini-4k-instruct-GGUF',
    isDownloaded: false,
  },
  {
    id: 'gemma-2-2b-q4_k_m',
    name: 'Gemma 2 2B',
    size: 1600000000,
    quantization: 'Q4_K_M',
    architecture: 'gemma2',
    parameters: '2B',
    downloadUrl: 'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF',
    isDownloaded: false,
  },
  {
    id: 'qwen-2.5-1.5b-q4_k_m',
    name: 'Qwen 2.5 1.5B',
    size: 950000000,
    quantization: 'Q4_K_M',
    architecture: 'qwen2',
    parameters: '1.5B',
    downloadUrl: 'https://huggingface.co/bartowski/Qwen2.5-1.5B-Instruct-GGUF',
    isDownloaded: false,
  },
];

export const ModelManagerScreen: React.FC = () => {
  const { models, setModels, activeModel, setActiveModel, config, setConfig } = useModelStore();
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme];
  const [selectedQuant, setSelectedQuant] = useState('Q4_K_M');

  const displayModels = models.length > 0 ? models : SAMPLE_MODELS;

  const handleSelectModel = (model: GGUFModel) => {
    if (model.isDownloaded) {
      setActiveModel(model);
      setConfig({ modelId: model.id });
      Alert.alert('Model Selected', `${model.name} is now active`);
    } else {
      Alert.alert('Download Required', 'Please download this model first');
    }
  };

  const handleDownload = (model: GGUFModel) => {
    Alert.alert(
      'Download Model',
      `Download ${model.name} (${formatSize(model.size)})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            setModels(
              displayModels.map((m) =>
                m.id === model.id ? { ...m, downloadProgress: 0 } : m
              )
            );
            simulateDownload(model.id);
          },
        },
      ]
    );
  };

  const simulateDownload = (modelId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setModels(
          displayModels.map((m) =>
            m.id === modelId ? { ...m, isDownloaded: true, downloadProgress: 100 } : m
          )
        );
      } else {
        setModels(
          displayModels.map((m) =>
            m.id === modelId ? { ...m, downloadProgress: progress } : m
          )
        );
      }
    }, 500);
  };

  const quantOptions = ['Q2_K', 'Q3_K_S', 'Q4_K_M', 'Q5_K_M', 'Q6_K', 'Q8_0'];

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }]}>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Models</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.quantSection}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Quantization</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quantRow}>
            {quantOptions.map((q) => (
              <TouchableOpacity
                key={q}
                style={[
                  styles.quantButton,
                  {
                    backgroundColor: selectedQuant === q ? themeColors.primary : themeColors.glass,
                    borderColor: themeColors.border,
                  },
                ]}
                onPress={() => setSelectedQuant(q)}
              >
                <Text
                  style={[
                    styles.quantText,
                    { color: selectedQuant === q ? '#FFFFFF' : themeColors.textSecondary },
                  ]}
                >
                  {q}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={[styles.quantInfo, { color: themeColors.textMuted }]}>
            Q4_K_M recommended for balance of speed and quality
          </Text>
        </View>

        <View style={styles.modelsSection}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Available Models</Text>
          {displayModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onSelect={() => handleSelectModel(model)}
              onDownload={() => handleDownload(model)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const formatSize = (bytes: number): string => {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  return `${(bytes / 1048576).toFixed(0)} MB`;
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
  quantSection: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  quantRow: {
    marginBottom: spacing.sm,
  },
  quantButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  quantText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantInfo: {
    fontSize: 12,
  },
  modelsSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
});
