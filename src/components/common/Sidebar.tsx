import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';
import { useSettingsStore } from '../../stores/settingsStore';
import { useAgentStore } from '../../stores/agentStore';
import type { Persona } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onPersonaSelect?: (persona: Persona) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onPersonaSelect }) => {
  const { settings } = useSettingsStore();
  const { personas, activePersona, setActivePersona } = useAgentStore();
  const themeColors = colors[settings.theme];

  if (!isOpen) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.sidebar, { backgroundColor: themeColors.surface, borderRightColor: themeColors.border }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: themeColors.text }]}>Personas</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: themeColors.textSecondary }]}>{'\u2715'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list}>
          {personas.map((persona) => (
            <TouchableOpacity
              key={persona.id}
              style={[
                styles.personaItem,
                activePersona.id === persona.id && {
                  backgroundColor: themeColors.glass,
                  borderColor: persona.color,
                },
              ]}
              onPress={() => {
                setActivePersona(persona);
                onPersonaSelect?.(persona);
              }}
            >
              <View style={[styles.personaIcon, { backgroundColor: persona.color + '20' }]}>
                <Text style={{ fontSize: 20 }}>{getPersonaEmoji(persona.icon)}</Text>
              </View>
              <View style={styles.personaInfo}>
                <Text style={[styles.personaName, { color: themeColors.text }]}>
                  {persona.name}
                </Text>
                <Text style={[styles.personaDesc, { color: themeColors.textSecondary }]}>
                  {persona.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: themeColors.border }]}>
          <Text style={[styles.airGapBadge, { color: themeColors.success }]}>
            {'\u{1F512}'} Air-Gap Active
          </Text>
        </View>
      </View>
    </View>
  );
};

const getPersonaEmoji = (icon: string): string => {
  const map: Record<string, string> = {
    brain: '\u{1F9E0}',
    code: '\u{1F4BB}',
    pen: '\u270D\uFE0F',
    chart: '\u{1F4CA}',
  };
  return map[icon] || '\u{1F916}';
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  sidebar: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    borderRightWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeText: {
    fontSize: 18,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  personaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  personaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personaInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  personaName: {
    fontSize: 16,
    fontWeight: '600',
  },
  personaDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  airGapBadge: {
    fontSize: 14,
    fontWeight: '600',
  },
});
