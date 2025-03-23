import React, { FC, useCallback, useEffect, useState } from 'react';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import WebView from 'react-native-webview';
import { BackHandler, Dimensions, Platform } from 'react-native';

type AgreementNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Agreement'
>;
type AgreementRouteProp = RouteProp<RootStackParamList, 'Agreement'>;

interface AgreementScreenProps {
  navigation: AgreementNavigationProp;
  route: AgreementRouteProp;
}



const Agreement: FC<AgreementScreenProps> = ({ navigation, route }) => {
  // const { applicantId, isMainApplicant, guarantorId } = useApplicantDetails();

  const { height } = Dimensions.get('screen');
  const [webRedirectionUrl, setWebRedirectionUr] = useState<string>('');

  

  useEffect(() => {
console.log("mfff",route.params?.webRedirectionUrl);


  }, []);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('LoanAgreement'); // Navigate to LoanAgreement on back press
        return true; // Prevent default back action
      };
  
      if (Platform.OS === 'android') {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => backHandler.remove(); // ✅ Cleanup for Android
      } else {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
          e.preventDefault(); // Prevent default iOS back action
          navigation.navigate('LoanAgreement'); // Manually navigate
        });
  
        return () => unsubscribe(); // ✅ Cleanup for iOS
      }
    }, []) // ✅ Add `navigation` dependency
  );
  return (
    <WaveBackground loading={[]} title={'Loan Agreement'}>

      <WebView
        source={{ uri: route.params?.webRedirectionUrl }}
        style={{ width: '100%', height: 580 }}
        cacheEnabled={false}
      // onShouldStartLoadWithRequest={(event) => {
      //   console.log("onShouldStartLoadWithRequest", event);
      //   return true;
      // }}
      // onLoadStart={(event) => {
      //   console.log("onLoadStart", event.nativeEvent);
      // }}
      />
      {/* <Button
        text={'Next'}
        active
        marginVertical={10}
        marginTop={30}

        onPress={() => {GetProductetails.mutateAsync();}}
      />
      <View style={{ marginBottom: 30 }}>
      <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />
      </View> */}
    </WaveBackground>
  );
};
export default Agreement;
