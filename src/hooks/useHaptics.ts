import { useCallback } from 'react';
import { Vibration, Platform } from 'react-native';
import { useSettingsStore } from '../stores/settingsStore';

export function useHaptics() {
  const { settings } = useSettingsStore();

  const light = useCallback(() => {
    if (settings.hapticFeedback && Platform.OS === 'ios') {
      Vibration.vibrate(10);
    }
  }, [settings.hapticFeedback]);

  const medium = useCallback(() => {
    if (settings.hapticFeedback) {
      Vibration.vibrate(20);
    }
  }, [settings.hapticFeedback]);

  const heavy = useCallback(() => {
    if (settings.hapticFeedback) {
      Vibration.vibrate(40);
    }
  }, [settings.hapticFeedback]);

  const onGenerationComplete = useCallback(() => {
    if (settings.hapticFeedback) {
      Vibration.vibrate([0, 30, 50, 30]);
    }
  }, [settings.hapticFeedback]);

  return { light, medium, heavy, onGenerationComplete };
}
