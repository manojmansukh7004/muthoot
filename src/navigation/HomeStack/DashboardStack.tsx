import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthentication } from 'context/useAuthentication';
import Dashboard from 'screens/Home/Dashboard/index';
import MasterLogin from 'screens/Home/Dashboard/MasterLogin';
import NactReactivationStack from 'screens/NachReactivation';
import TwoWheelerStack from './TwoWheelerStack';
import PlStack from './PlStack';
import { RootStackParamList } from './TwoWheelerStack';
import { PlStackParamList } from './PlStack';
import { NachReactivationStackParamList } from './NachReactivationStack';


export type DashboardStackParamList = {
  Dashboard: undefined;
  MasterLogin: undefined;
  TwoWheelerStack: RootStackParamList;
  PlStack: PlStackParamList;
  NactReactivationStack: NachReactivationStackParamList;

};

const Stack = createNativeStackNavigator<DashboardStackParamList>();


const DashboardStack = () => {

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'fade',
      })}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="MasterLogin" component={MasterLogin} />
      <Stack.Screen name="TwoWheelerStack" component={TwoWheelerStack} />
      <Stack.Screen name="PlStack" component={PlStack} />
      <Stack.Screen name="NactReactivationStack" component={NactReactivationStack} />

    </Stack.Navigator>
  );
}

export default DashboardStack;
