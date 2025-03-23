import React, { FC, useEffect, useState } from 'react';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import WebView from 'react-native-webview';
import { BackHandler, Dimensions, Platform } from 'react-native';

type KFSAgreementNavigationProp = StackNavigationProp<
  RootStackParamList,
  'KFSAgreement'
>;
type KFSAgreementRouteProp = RouteProp<RootStackParamList, 'KFSAgreement'>;

interface KFSAgreementScreenProps {
  navigation: KFSAgreementNavigationProp;
  route: KFSAgreementRouteProp;
}



const KFSAgreement: FC<KFSAgreementScreenProps> = ({ navigation, route }) => {


  useEffect(() => {
    console.log("mfff", route.params?.webRedirectionUrl);


  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('KFS'); // Navigate to 'KFS' screen
        return true; // Prevent default back behavior
      };
  
      if (Platform.OS === 'android') {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => backHandler.remove();
      } else {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
          e.preventDefault(); // Prevent default navigation
          navigation.navigate('KFS'); // Navigate manually
        });
  
        return () => unsubscribe();
      }
    }, [])
  );
  return (
    <WaveBackground loading={[]} title={'KFS Agreement'}>

      <WebView
        source={{ uri: route.params?.webRedirectionUrl }}
        style={{ width: '100%', height: 580 }}
      // onShouldStartLoadWithRequest={(event) => {
      //   console.log("onShouldStartLoadWithRequest", event);
      //   return true;
      // }}
      // onLoadStart={(event) => {
      //   console.log("onLoadStart", event.nativeEvent);
      // }}
      />

    </WaveBackground>
  );
};
export default KFSAgreement;
