import React, { FC } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import { useApplicantDetails } from 'context/useApplicantDetails';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import WebView from 'react-native-webview';
import {Dimensions} from 'react-native';
import {
 AARequest
} from 'api/ReactQuery/PL/AccountAgregators/types';
import {
  GetAccountAggregator
} from 'api/ReactQuery/PL/AccountAgregators';
type NachRegistrationNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NachRegistration'
>;
type NachRegistrationRouteProp = RouteProp<RootStackParamList, 'NachRegistration'>;

interface NachRegistrationScreenProps {
  navigation: NachRegistrationNavigationProp;
  route: NachRegistrationRouteProp;
}



const NachRegistration: FC<NachRegistrationScreenProps> = ({ navigation, route }) => {
  const { applicantId } = useApplicantDetails();
  const webRedirectionUrl = route.params?.webRedirectionUrl;

  const {height} = Dimensions.get('screen');
  // const [webRedirectionUrl, setWebRedirectionUr] = useState<string>('');


  const AARequest: AARequest = {
    appId: applicantId,
  };
  const [
    GetAADetails,
    {data: GetAadharDetailsData, isLoading: GetAADetailsIsLoading},
  ] = GetAccountAggregator(AARequest);

  // useEffect(() => {

  //   if (GetAadharDetailsData) {

  //     setWebRedirectionUr(GetAadharDetailsData?.webRedirectionUrl || '')
  //     // setDocumentType(GetProductDetailsData?.documentType || '')
  //     // setImageUrl(GetProductDetailsData?.documentFilePath || '')
  //     // setType(GetProductDetailsData?.type || '')

  //   }

  // }, [GetAadharDetailsData])

  // useEffect(() => {
  //   GetAADetails.mutateAsync();
  

  // }, []);
        console.log("ggggggggg", webRedirectionUrl);


  return (
    <WaveBackground loading={[GetAADetailsIsLoading]} title={'E-Nach Registration'}>
     
     <WebView
          source={{ uri: webRedirectionUrl }}
          style={{ width: '100%', height: 580 }}
          // onShouldStartLoadWithRequest={(event) => {
          //   console.log("onShouldStartLoadWithRequest", event);
          //   return true;
          // }}
          // onLoadStart={(event) => {
          //   console.log("onLoadStart", event.nativeEvent);
          // }}
        />
          {/* <Button
          text={ 'Next'}
          active
          marginVertical={10}
          marginTop={30}
          onPress={()=>{}}
        />
      <LoanSummaryButton/> */}
    </WaveBackground>
  );
};
export default NachRegistration;
