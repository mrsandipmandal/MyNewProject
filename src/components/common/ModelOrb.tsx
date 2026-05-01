import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '../../theme';
import { useModelStore } from '../../stores/modelStore';
import { useSettingsStore } from '../../stores/settingsStore';

const { width } = Dimensions.get('window');

interface ModelOrbProps {
  size?: number;
}

export const ModelOrb: React.FC<ModelOrbProps> = ({ size = 40 }) => {
  const { isLoaded, isLoading, ramUsageMB, totalRamMB } = useModelStore();
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme];

  const pulseProgress = useSharedValue(0);
  const glowProgress = useSharedValue(0);

  useEffect(() => {
    if (isLoaded || isLoading) {
      pulseProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1
      );
      glowProgress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1
      );
    }
  }, [isLoaded, isLoading]);

  const orbStyle = useAnimatedStyle(() => {
    const bgColor = interpolateColor(
      pulseProgress.value,
      [0, 1],
      [themeColors.orbGlow, themeColors.orbPulse]
    );
    return {
      backgroundColor: bgColor,
      transform: [{ scale: 1 + pulseProgress.value * 0.1 }],
    };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowProgress.value * 0.6,
    transform: [{ scale: 1 + glowProgress.value * 0.3 }],
  }));

  const loadRatio = totalRamMB > 0 ? ramUsageMB / totalRamMB : 0;
  const loadPercent = Math.round(loadRatio * 100);

  if (!isLoaded && !isLoading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.orbWrapper}>
        <Animated.View style={[styles.glow, glowStyle, { width: size * 2, height: size * 2 }]} />
        <Animated.View style={[orbStyle, { width: size, height: size, borderRadius: size / 2 }]} />
        {isLoading && (
          <Text style={[styles.statusText, { color: themeColors.textSecondary }]}>Loading...</Text>
        )}
        {isLoaded && (
          <Text style={[styles.statusDot, { color: themeColors.success }]}>{'\u25CF'}</Text>
        )}
      </View>
      {isLoaded && (
        <Text style={[styles.ramText, { color: themeColors.textMuted }]}>
          {loadPercent}% RAM
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#6C63FF',
  },
  statusText: {
    fontSize: 10,
    marginTop: 4,
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 10,
  },
  ramText: {
    fontSize: 10,
    marginTop: 4,
  },
});
