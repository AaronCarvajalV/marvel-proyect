import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Heroes: undefined;
  Missions: undefined;
  Favorites: undefined;
  HeroForm: { heroId?: number };
  MissionForm: { missionId?: number };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  HeroDetail: { heroId: number; heroName?: string };
  HeroForm: { heroId?: number };
  MissionForm: { missionId?: number };
};

// Navigation Prop helpers
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type HeroDetailRouteProp = RouteProp<RootStackParamList, 'HeroDetail'>;
