import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useAuthentication} from 'context/useAuthentication';
import Login from 'screens/Authentication/Login';
import ResetPassword from 'screens/Authentication/Login/ResetPassword';
import Splash from 'screens/Authentication/Splash';
import {VersionCheckResponse} from 'api/ReactQuery/TwoWheeler/Auth/types';


export type LoginStackParamList = {
  Splash: undefined;
  Login: undefined | {VersionCheckResponse: VersionCheckResponse};
  ResetPassword: undefined;

};

const Stack = createNativeStackNavigator<LoginStackParamList>();


const LoginStack = () => {
  const {isLoggedIn, isLoggedOut} = useAuthentication();
  console.log("Login stack ",isLoggedIn, isLoggedOut);
  
    return (
      <Stack.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          animation: 'fade',
        })}>
        {
        !isLoggedOut && 
        <Stack.Screen name="Splash" component={Splash} />}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        
      </Stack.Navigator>
    );
  }

export default LoginStack;
