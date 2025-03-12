import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import NachReactivation from 'screens/NachReactivation';


export type NachReactivationStackParamList = {
  NachReactivation: undefined;
};

const Stack = createNativeStackNavigator<NachReactivationStackParamList>();


const NachReactivationStack = () => {

    return (
      <Stack.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          animation: 'fade',
        })}>
        <Stack.Screen name="NachReactivation" component={NachReactivation} />
      </Stack.Navigator>
    );
  }

export default NachReactivationStack;
