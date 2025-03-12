import React, { FC, useState, useCallback, useEffect } from 'react';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import { useApplicantDetails } from 'context/useApplicantDetails';
import { PlStackParamList } from 'navigation/HomeStack/PlStack';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';
import Button from 'components/Button';
import LoanSummaryButton from 'components/LoanSummaryButton';
import useFontNormalise from 'hooks/useFontNormalise';
import { APP_FONTS } from 'config/Fonts';
import Icon from 'components/Icon';
import Colors from 'config/Colors';
import DownloadFile from 'config/Functions/DownloadFile';
import SignatureScreen from 'react-native-signature-canvas';
import {
  useGenerateKFS,
  useGetKFS,
  useSendOTPKFS,
  useCallLegality,
} from 'api/ReactQuery/TwoWheeler/KFS';
import LabeledDropdown from 'components/LabeledDropdown';
import { useGetRefrence } from 'api/ReactQuery/TwoWheeler/Lead';
import { DropdownObject } from 'config/Types';


type KFSNavigationProp = StackNavigationProp<
  PlStackParamList,
  'KFS'
>;
type KFSRouteProp = RouteProp<PlStackParamList, 'KFS'>;

interface KFSScreenProps {
  navigation: KFSNavigationProp;
  route: KFSRouteProp;
}



const KFS: FC<KFSScreenProps> = ({ navigation, route }) => {
  const { applicantId } = useApplicantDetails();
  const webRedirectionUrl = 'http://samples.leanpub.com/thereactnativebook-sample.pdf';


  const [isConsent, setIsConsent] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [islanguageDisable, setIslanguageDisable] = useState<boolean>(false);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [isAgreementDone, setIsAgreementDone] = useState<boolean>(false);

  // console.log("ggggggggg", webRedirectionUrl);

  // const handleOK = (signature) => {
  //   console.log(signature);
  //   // onOK(signature); // Callback from Component props
  // };

  const [
    CallLegality,
    {
      data: CallLegalityData,
      isLoading: CallLegalityIsLoading,
    },
  ] = useCallLegality(`?applicantId=${applicantId}&isConsent=${isConsent}`);

  const [
    GenerateKFS,
    { data: GenerateKFSData, isLoading: GenerateKFSIsLoading },
  ] = useGenerateKFS(`?applicantId=${applicantId}&language=${selectedValue}`);

  const [
    GetKFS,
    { data: GetKFSData, isLoading: GetKFSIsLoading },
  ] = useGetKFS(applicantId);

  useEffect(() => {
    if (GenerateKFSData) {
      CallLegality.mutateAsync();
    }
  }, [GenerateKFSData])

  // useEffect(() => {
  //   if (CallLegalityData) {
  //     console.log("CallLegalityData", CallLegalityData);
  //     navigation.navigate('KFSAgreement', { webRedirectionUrl: CallLegalityData?.mainApplicantUrl })
  //   }
  // }, [CallLegalityData])

  useEffect(() => {
    if (GetKFSData) {
      console.log("GetKFSData", GetKFSData);
      setIsConsent(GetKFSData?.isConsent)
      setIsAgreementDone(GetKFSData?.isNextEnable)
      setSelectedValue(GetKFSData?.language)
    }

  }, [GetKFSData])

  const [GetRefrence, { data: GetRefrenceData }] =
    useGetRefrence(`?type=${'Kfs'}`);


  const languageList: DropdownObject[] = GetRefrenceData
    ? GetRefrenceData.map(item => ({
      label: item.dropdownLabel,
      value: item.dropdownLabel,
      dropdownValue: item.dropdownValue

    }))
    : [];

  // useEffect(() => {
  //   GenerateKFS.mutateAsync();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      // GenerateKFS.mutateAsync();
      GetKFS.reset()
      GetRefrence.mutateAsync()
      GetKFS.mutateAsync();
    }, []),
  );


  return (
    <WaveBackground loading={[GenerateKFSIsLoading, GetKFSIsLoading, CallLegalityIsLoading]}
      title={'KFS (Key Fact Statement) '}
      // language={ GetKFSData?.unsignedKfsDoc ? true: false}
      onPress={() => {
        console.log("mjjjjj");
      }}
    >
      <Icon name="kfs" />

      <LabeledDropdown
        label="Language"
        defaultValue={selectedValue}
        options={languageList}
        setSelectedItem={(item) => {
          // console.log("iiiiii", item);
          setSelectedItem(item);
        }}
        setSelectedOption={(label) => { setSelectedValue(label) }}
        bottom
        mandatory
        disabled={isViewOnly ? isViewOnly : (GetKFSData?.unsignedKfsDoc) ? true : isAgreementDone ? true : false}
      />

      {/* <View style={{ height: 280, backgroundColor: 'transparent', borderRadius: 15 }}>
        <Pdf
          trustAllCerts={false}

          source={{
            uri: (GetKFSData?.signedKfsDoc) ? GetKFSData?.signedKfsDoc : GetKFSData?.unsignedKfsDoc,
            cache: true,
          }}
          fitPolicy={0}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={{ flex: 1, borderRadius: 15 }}
        />

      </View> */}
      {GetKFSData?.unsignedKfsDoc &&
        <View
          style={{
            marginTop: '5%',
            width: '70%',
            alignSelf: 'center',
            // marginBottom: '5%',
          }}>
          {

            <Button
              text="KFS Doc"
              onPress={() => {
                console.log("mjjjjj");
                GetKFSData && DownloadFile((GetKFSData?.signedKfsDoc) ? GetKFSData?.signedKfsDoc : GetKFSData?.unsignedKfsDoc, `${applicantId}_KFS`)
              }}
              // marginVertical={20}
              active
            />}
        </View>}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            marginTop: 35,
            marginBottom: 25,
          }}>
          <TouchableOpacity
            style={{ marginRight: 5 }}
            disabled={GetKFSData?.isNextEnable}
            onPress={() => setIsConsent(!isConsent)}>
            {isConsent ? (
              <Icon name="checkbox" />
            ) : (
              <View
                style={{
                  width: useFontNormalise(20),
                  height: useFontNormalise(20),
                  backgroundColor: Colors.LabelGrey,
                  borderRadius: 2,
                }}
              />
            )}
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', }}>
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text
                numberOfLines={isExpanded ? undefined : 2}
                style={{
                  color: Colors.Black,
                  fontSize: 13,
                  // padding:4,
                  fontFamily: APP_FONTS.Medium,
                }}>
                By checking this box, you acknowledge that you have read, understood, and agree to the terms and conditions of the Key Facts Statement for the loan being offered. This statement contains important information about the loan, including interest rates, fees, and repayment terms. Please review the Key Facts Statement carefully before proceeding.{'\b'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {!isAgreementDone && (
          <View style={{ marginTop: 10 }}>
            <Button
              text="Sign KFS"
              active={isConsent && !CallLegalityData && selectedValue ? true : false}
              onPress={() => { isViewOnly ? null : GenerateKFS.mutateAsync() }}
            />
          </View>
        )}

        {
          !isAgreementDone && CallLegalityData &&
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
            {CallLegalityData?.mainApplicantUrl && <Button
              text="Main Applicant"
              active
              // ={CallLegalityData?.isMainApplicantSigned == 'Not Signed' ? true : false}
              halfSize
              onPress={() => {
                navigation.navigate("KFSAgreement", { webRedirectionUrl: CallLegalityData?.mainApplicantUrl })
              }}
            />}
            {CallLegalityData?.guarantorUrl && <Button
              text="Guarantor"
              active
              // ={CallLegalityData?.isGuarantorSigned == 'Not Signed' ? true : false}
              halfSize
              onPress={() => {
                navigation.navigate("KFSAgreement", { webRedirectionUrl: CallLegalityData?.guarantorUrl })
              }}
            />}
          </View>}

        <Button
          text={'Next'}
          active={isConsent && (GetKFSData?.isNextEnable ? true : false)}
          marginVertical={10}
          // marginTop={30}
          onPress={() => {
            !(isConsent && GetKFSData?.isNextEnable) ?
              CallLegality.mutateAsync()
              : navigation.navigate('LoanAgreement');
          }}
        />
        <LoanSummaryButton onPress={() => { navigation.navigate('LoanSummary') }} />
      </ScrollView>

    </WaveBackground>
  );
};
export default KFS;