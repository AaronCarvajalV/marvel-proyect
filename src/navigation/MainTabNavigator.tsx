import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { HeroesScreen } from '../screens/heroes/HeroesScreen';
import { MissionsScreen } from '../screens/missions/MissionsScreen';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'HOME',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Heroes"
        component={HeroesScreen}
        options={{
          tabBarLabel: 'NETWORK',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Missions"
        component={MissionsScreen}
        options={{
          tabBarLabel: 'MISSIONS',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'navigate-circle' : 'navigate-circle-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surfaceGlass,
    borderTopWidth: 1,
    borderTopColor: colors.borderCyan,
    paddingTop: 6,
    height: 60,
    elevation: 0,
    position: 'absolute', // To allow blur or content behind if needed, matching Web overlay
  },
  tabBarLabel: {
    fontFamily: typography.fontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingBottom: 6,
    textTransform: 'uppercase',
  },
});

export default MainTabNavigator;
