import React, { FC, useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import { useApplicantDetails } from 'context/useApplicantDetails';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import  selectedBaseUrl  from 'api/Axios';
import LoanSummaryButton from 'components/LoanSummaryButton';
import {
  useGetAgreementDetails,
  useeSignAgreement
} from 'api/ReactQuery/TwoWheeler/LoanAgreement';
import { usedViewStatus } from 'context/useViewStatus';
import { eSignRequest } from 'api/ReactQuery/TwoWheeler/LoanAgreement/types';
import DownloadFile from 'config/Functions/DownloadFile';
import { useGetRefrence } from 'api/ReactQuery/TwoWheeler/Lead';
import { DropdownObject } from 'config/Types';
import LabeledDropdown from 'components/LabeledDropdown';

type LoanAgreementNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoanAgreement'
>;
type LoanAgreementRouteProp = RouteProp<RootStackParamList, 'LoanAgreement'>;

interface LoanAgreementScreenProps {
  navigation: LoanAgreementNavigationProp;
  route: LoanAgreementRouteProp;
}

const LoanAgreement: FC<LoanAgreementScreenProps> = ({ navigation, route }) => {


  const [loanAgreementPath, setloanAgreementPath] = useState<string>('');
  const [isAgreementDone, setIsAgreementDone] = useState<boolean>(false);
  const { applicantId } = useApplicantDetails();
  const { useViewStatus } = usedViewStatus();
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [islanguageDisable, setIslanguageDisable] = useState<boolean>(false);

  // var applicantId = 'MU927063'
  console.log("useViewStatus?.isReEdit", useViewStatus?.isReEdit);

  const eSignRequest: eSignRequest =
  {
    appId: applicantId,
    language: selectedItem?.dropdownValue,
    languageLabel: selectedItem?.label
    // isReEdit: (useViewStatus?.isReEdit) ? true : false
  };

  const [GetRefrence, { data: GetRefrenceData }] =
    useGetRefrence(`?type=${'loanAgreement'}`);


  const languageList: DropdownObject[] = GetRefrenceData
    ? GetRefrenceData.map(item => ({
      label: item.dropdownLabel,
      value: item.dropdownLabel,
      dropdownValue: item.dropdownValue

    }))
    : [];
// console.log("hhhhhh",JSON.stringify(languageList, null,4));

  const [GetAgreementDetails, { data: GetAgreementDetailsData, isLoading: GetAgreementDetailsIsLoading }] =
    useGetAgreementDetails(`appId=${applicantId}`,);

  const [eSignAgreement, { data: eSignAgreementData, isLoading: eSignAgreementIsLoading }] =
    useeSignAgreement(eSignRequest);


  useEffect(() => {
    if (eSignAgreementData) {
      setIslanguageDisable(true)
      console.log("eSignAgreementData", eSignAgreementData);

    }
  }, [eSignAgreementData])


  useEffect(() => {
    console.log("GetAgreementDetailsData", GetAgreementDetailsData, );

    if (GetAgreementDetailsData?.languageLabel) {
      console.log("GetAgreementDetailsData", GetAgreementDetailsData, );
      setSelectedValue(GetAgreementDetailsData?.languageLabel)
      setIslanguageDisable(true)
      setloanAgreementPath(GetAgreementDetailsData?.filepath?.replace('/var/www/html', selectedBaseUrl?.Url))
      setIsAgreementDone(GetAgreementDetailsData?.filepath ? true : false)

    }
  }, [GetAgreementDetailsData])

  useFocusEffect(
    useCallback(() => {
      GetAgreementDetails.mutateAsync();
      GetRefrence.mutateAsync();
    }, []),
  );

  useEffect(() => {
    if (useViewStatus) {
      setIsViewOnly(
        useViewStatus.isReEdit ? false :
          useViewStatus?.isSalesReject ? true :
            useViewStatus?.isSubmitToDisbursement ? true :
              false);
    }
  }, []);
  console.log("selectedValue", selectedValue);

  return (
    <WaveBackground loading={[eSignAgreementIsLoading, GetAgreementDetailsIsLoading]} 
    title="Loan Agreement">
      <Icon name="loan-agreement" />

      <LabeledDropdown
        label="Language"
        defaultValue={selectedValue}
        options={languageList}
        setSelectedItem={(item) => {
          console.log("iiiiii", item);
          setSelectedItem(item);
        }}
        setSelectedOption={(label) => { setSelectedValue(label) }}
        bottom
        mandatory
        disabled={isViewOnly ? isViewOnly :islanguageDisable? true: isAgreementDone ? true : false}
      />
      
      {isAgreementDone && (
        <View
          style={{
            marginTop: '5%',
            width: '70%',
            alignSelf: 'center',
            marginBottom: '10%',
          }}>
          <Button
            text="Loan Agreement"
            onPress={() => {
              loanAgreementPath &&
                DownloadFile(
                  loanAgreementPath,
                  applicantId + '_LoanAgreement',
                );
            }}
            marginVertical={20}
            active
          />
        </View>
      )}



      {!isAgreementDone && (
        <View style={{ marginTop: 50 }}>
          <Button
            text="Sign Agreement"
            active={!eSignAgreementData && selectedValue ? true : false}
            onPress={() => { isViewOnly ? null : eSignAgreement.mutateAsync() }}
          />
        </View>
      )}

      {
        !isAgreementDone && eSignAgreementData &&
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
          {eSignAgreementData?.mainAppSignUrl && <Button
            text="Main Applicant"
            active={eSignAgreementData?.isMainApplicantSigned == 'Not Signed' ? true : false}
            halfSize
            onPress={() => {
              navigation.navigate("Agreement", { webRedirectionUrl: eSignAgreementData?.mainAppSignUrl })
            }}
          />}
          {eSignAgreementData?.guarantorSignUrl && <Button
            text="Guarantor"
            active={eSignAgreementData?.isGuarantorSigned == 'Not Signed' ? true : false}
            halfSize
            onPress={() => {
              navigation.navigate("Agreement", { webRedirectionUrl: eSignAgreementData?.guarantorSignUrl })
            }}
          />}
        </View>}

      <View style={{ marginTop: 50, marginBottom: 10 }}>
        <Button
          text="Next"
          active={isAgreementDone}
          onPress={() => {
            navigation.navigate('PreDisbursalDocuments');
          }}
        />
      </View>

      <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />
    </WaveBackground>
  );
};

export default LoanAgreement;
