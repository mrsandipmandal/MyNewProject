import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatScreen, ModelManagerScreen, SettingsScreen } from '../screens';
import { colors } from '../theme';
import { useSettingsStore } from '../stores/settingsStore';

const Tab = createBottomTabNavigator();

export const AppNavigator: React.FC = () => {
  const { settings } = useSettingsStore();
  const themeColors = colors[settings.theme];

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: themeColors.surface,
            borderTopColor: themeColors.border,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: themeColors.primary,
          tabBarInactiveTintColor: themeColors.textMuted,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarLabel: 'Chat',
            tabBarIcon: ({ color }) => <TabIcon color={color} icon="chat" />,
          }}
        />
        <Tab.Screen
          name="Models"
          component={ModelManagerScreen}
          options={{
            tabBarLabel: 'Models',
            tabBarIcon: ({ color }) => <TabIcon color={color} icon="models" />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => <TabIcon color={color} icon="settings" />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const TabIcon: React.FC<{ color: string; icon: string }> = ({ color, icon }) => {
  const icons: Record<string, string> = {
    chat: '\u{1F4AC}',
    models: '\u{1F4E6}',
    settings: '\u2699\uFE0F',
  };
  return <Text style={[styles.tabIcon, { color }]}>{icons[icon]}</Text>;
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 22,
  },
});
