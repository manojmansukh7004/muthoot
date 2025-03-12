import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import { PlStackParamList } from 'navigation/HomeStack/PlStack';
import { LoginStackParamList } from 'navigation/HomeStack/LoginStack';
import { DashboardStackParamList } from 'navigation/HomeStack/DashboardStack';

export type ScreenNavigationProp =
    NativeStackNavigationProp<DashboardStackParamList | RootStackParamList| LoginStackParamList | PlStackParamList>;
