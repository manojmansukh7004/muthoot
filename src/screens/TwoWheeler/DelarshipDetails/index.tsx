import React, {FC, useCallback, useEffect, useState} from 'react';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import {useApplicantDetails} from 'context/useApplicantDetails';
import {RootStackParamList} from 'navigation/HomeStack/TwoWheelerStack';
import LabeledTextInput from 'components/LabeledTextInput';
import LabeledRadioButtonGroup from 'components/RadioButtonGroup';
import useActive from 'hooks/useActive';
import Button from 'components/Button';
import {ErrorObject} from 'config/Types';
import Modal from 'components/Modal';
import LabeledDropdown from 'components/LabeledDropdown';
import LoanSummaryButton from 'components/LoanSummaryButton';
import {
  useGetDelar,
  useGetSubDelar,
  useGetBranch,
  useGetFranchise,
  useSetDearshipDetails,
  useGetDearshipDetails,
  useGetExternalLead,
  useGetDeliveryLetter,
  useGetLeadBusinessVerticle,
  useGetLeadSource,
  useGetVerifyEmployee,
} from 'api/ReactQuery/TwoWheeler/LoanDetails';
import {
  setDearshipDetailsRequest,
  getDeliveryLetterRequest,
  getVerifyEmployeeRequest,
} from 'api/ReactQuery/TwoWheeler/LoanDetails/types';
import {usedViewStatus} from 'context/useViewStatus';
import {useEmployeeDetails} from 'context/useEmployeeDetails';
import {APP_FONTS} from 'config/Fonts';
import {View, Text} from 'react-native';
import useFontNormalise from 'hooks/useFontNormalise';
import Colors from 'config/Colors';
import Icon from 'components/Icon';

type DelarshipDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DelarshipDetails'
>;
type DelarshipDetailsRouteProp = RouteProp<
  RootStackParamList,
  'DelarshipDetails'
>;

interface DelarshipDetailsScreenProps {
  navigation: DelarshipDetailsNavigationProp;
  route: DelarshipDetailsRouteProp;
}

const DelarshipDetails: FC<DelarshipDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  interface Item {
    label: string;
    value: string;
    branchName?: string;
    branchCode?: string;
    branchId?: number;
    dealerName?: string;
    dealerCode?: string;
    subDealername?: string;
    subDealerCode?: string;
  }

  const {applicantId, isMainApplicant, guarantorId} = useApplicantDetails();
  const {useViewStatus} = usedViewStatus();
  const {employeeName, employeeId} = useEmployeeDetails();
  // console.log('employeeId', employeeId);

  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [isError, setIsError] = useState<ErrorObject[]>([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const isNavigate = route.params?.isNavigateEmploymentDetails;
  const [sourcedBy, setSourcedBy] = useState<string>('');
  const [isSulb, setIsSulb] = useState<boolean>(false);

  const [dealer, setDealer] = useState<string>('');
  const [paymentTo, setPaymentTo] = useState<string>('');

  const [dealerOpen, setDealerOpen] = useState<boolean>(false);
  const [dealerItem, setDealerItem] = useState<any>('');
  const [subDealer, setSubDealer] = useState<string>('');
  const [subDealerOpen, setSubDealerOpen] = useState<boolean>(false);
  const [subDealerItem, setSubDealerItem] = useState<any>('');
  const [businessChannel, setBusinessChannel] = useState<string>('');
  const [leadSource, setLeadSource] = useState<string>('');
  const [leadPatnerName, setLeadPatnerName] = useState<string>('');
  const [channelBranchUser, setchannelBranchUser] = useState<string>('');
  const [payoutCategory, setPayoutCategory] = useState<string>('');

  const [franchise, setFranchise] = useState<string>('');
  const [franchiseOpen, setFranchiseOpen] = useState<boolean>(false);
  const [branch, setBranch] = useState<string>('');
  const [branchOpen, setBranchOpen] = useState<boolean>(false);
  const [branchItem, setBranchItem] = useState<any>('');
  const [employeeCode, setEmployeeCode] = useState<string>(employeeId);
  const [isEmpIdVerified, setIsEmpIdVerified] = useState<boolean>(true);

  const [existingCustomer, setExistingCustomer] = useState<string>('');
  const [satisfactory, setSatisfactory] = useState<string>('');
  const [satisfactoryOpen, setSatisfactoryOpen] = useState<boolean>(false);
  const [leadNumber, setLeadNumber] = useState<string>('');
  const [popupVisible, setPopUPVisible] = useState<boolean>(false);
  const [popupMsg, setPopUPMsg] = useState<string>('');

  const activeDealerArray = [
    sourcedBy,
    dealer,
    paymentTo,
    businessChannel,
    sourcedBy == 'Alternate Channel' ? channelBranchUser : 'ggggg',
    leadSource,
    leadPatnerName,
    employeeCode,
    // isEmpIdVerified,
    businessChannel == 'MFL Branch' ||
    businessChannel == 'SULB' ||
    businessChannel == 'BDE' ||
    businessChannel == 'MFL One'
      ? payoutCategory
      : 'mmmm',
    leadSource == 'External Lead' ? leadNumber : 'mmmm',
    existingCustomer,
    existingCustomer == 'Yes' ? satisfactory : existingCustomer,
  ];
   
  let isActive: boolean = useActive(activeDealerArray);

  let hasError: boolean = isError.some(error => error.hasError === true);

  const setDearshipDetailsRequest: setDearshipDetailsRequest = {
    appId: applicantId,
    isUpdatedBy: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    sourcedBy: sourcedBy,
    dealerAndBranch: dealer,
    subDealerAndBranch: subDealer,
    dealerName: dealerItem?.dealerName,
    dealerCode: dealerItem?.dealerCode || '',
    subDealerName: subDealerItem?.subDealername||'',
    subDealerCode: subDealerItem?.subDealerCode || '',
    franchiseSourcedBy: franchise,
    branchName: branch,
    branchCode: branchItem?.branchCode || '',
    employeeCode: employeeCode,
    leadSourcedBy: leadSource,
    leadNumber: leadNumber,
    accountConductsSatisfatcory: satisfactory,
    isExistingCustomerFranchise: existingCustomer == 'Yes' ? true : false,
    isReEdit: true,
    paymentTo: paymentTo,
    businessVerticle: sourcedBy,
    businessChannel: businessChannel,
    channelBranchUser: channelBranchUser,
    leadSource: leadSource,
    leadPartnerName: leadPatnerName,
    payoutCategory: payoutCategory,
    leadGeneratedBy: employeeCode,
    originalEmployeeId:employeeId,
    isEmployeeIdVerified: isEmpIdVerified,
  };

  const getDeliveryLetterRequest: getDeliveryLetterRequest = {
    dealerCode: dealerItem?.dealerCode,
  };

  const getVerifyEmployeeRequest: getVerifyEmployeeRequest = {
    appId: applicantId,
    employeeId: employeeCode,
  };

  const [
    verifyEmpId,
    {data: verifyEmpIdData, isLoading: verifyEmpIdIsLoading},
  ] = useGetVerifyEmployee(getVerifyEmployeeRequest);

  const [
    GetDeliveryLetter,
    {data: getDeliveryLetterData, isLoading: getDeliveryLetterIsLoading},
  ] = useGetDeliveryLetter(getDeliveryLetterRequest);

  const [
    SetDearshipDetails,
    {data: SetDearshipDetailsData, isLoading: SetDearshipDetailsIsLoading},
  ] = useSetDearshipDetails(setDearshipDetailsRequest);

  const [
    getDearshipDetails,
    {data: GetDearshipDetailsData, isLoading: GetDearshipDetailsIsLoading},
  ] = useGetDearshipDetails(`/${'mainApplicant'}/${applicantId}`);

  const [GetDelar, {data: GetDelarData, isLoading: GetDelarDataIsLoading}] =
    useGetDelar(
      `?applicantType=${'mainApplicant'}&appId=${applicantId}&franchiseSourceBy=${franchise}`,
    );

  const [
    GetSubDelar,
    {data: GetSubDelarData, isLoading: GetSubDelarDataIsLoading},
  ] = useGetSubDelar(`?dealerCode=${dealerItem?.dealerCode}`);

  const [
    GetFranchise,
    {data: GetFranchiseData, isLoading: GetFranchiseDataIsLoading},
  ] = useGetFranchise();

  const [
    GetExternalLead,
    {data: GetExternalLeadData, isLoading: GetExternalLeadDataIsLoading},
  ] = useGetExternalLead();

  const [GetBranch, {data: GetBranchData, isLoading: GetBranchDataIsLoading}] =
    useGetBranch(`/${franchise}/${applicantId}`);

  const [
    GetBussinessVertical,
    {
      data: GetBussinessVerticalData,
      isLoading: GetBussinessVerticalDataIsLoading,
    },
  ] = useGetLeadBusinessVerticle(`?type=${'BusinessVerticle'}&value=${''}`);

  const [
    GetBussinessChaanel,
    {
      data: GetBussinessChaanelData,
      isLoading: GetBussinessChaanelDataIsLoading,
    },
  ] = useGetLeadBusinessVerticle(
    `?type=${'BusinessChannel'}&value=${sourcedBy}`,
  );

  const [
    GetChaanelBranchUser,
    {
      data: GetChaanelBranchUserData,
      isLoading: GetChaanelBranchUserDataIsLoading,
    },
  ] = useGetLeadBusinessVerticle(
    `?type=${'ChannelBranchUser'}&value=${businessChannel}`,
  );

  const [
    GetLeadSource,
    {data: GetLeadSourceData, isLoading: GetLeadSourceDataIsLoading},
  ] = useGetLeadSource(`?type=${'Lead Source'}`);

  const [
    GetLeadPatnerName,
    {data: GetLeadPatnerNameData, isLoading: GetLeadPatnerNameDataIsLoading},
  ] = useGetLeadSource(`?type=${leadSource}`);

  useEffect(() => {

    if (GetDearshipDetailsData ) {
      console.log('GetDearshipDetailsData',GetDearshipDetailsData&&GetDearshipDetailsData.sourcedBy, JSON.stringify(GetDearshipDetailsData,null,4));
      setIsSulb(GetDearshipDetailsData?.isSulb || false);
      setSourcedBy(GetDearshipDetailsData.sourcedBy || '');
      setBusinessChannel(GetDearshipDetailsData.businessChannel || '');
      setchannelBranchUser(GetDearshipDetailsData.channelBranchUser || '');
      setLeadPatnerName(GetDearshipDetailsData.leadPartnerName || '');
      setEmployeeCode(GetDearshipDetailsData.leadGeneratedBy || '');
      setIsEmpIdVerified(GetDearshipDetailsData.isEmployeeIdVerified );
      setPayoutCategory(GetDearshipDetailsData.payoutCategory );

      setDealer(GetDearshipDetailsData?.dealerAndBranch || '');
      setDealerItem({
        dealerCode: GetDearshipDetailsData?.dealerCode,
        dealerName: GetDearshipDetailsData?.dealerName,
      });
      setSubDealer(GetDearshipDetailsData?.subDealerAndBranch || '');
      setSubDealerItem({
        subDealerCode: GetDearshipDetailsData?.subDealerCode,
        subDealerName: GetDearshipDetailsData?.subDealername,
      });
      setBranch(GetDearshipDetailsData?.branchName || '');
      setFranchise(GetDearshipDetailsData?.franchiseSourcedBy || '');
      // setEmployeeCode(GetDearshipDetailsData?.employeeCode || '');
      setLeadSource(GetDearshipDetailsData?.leadSourcedBy || '');
      setLeadNumber(GetDearshipDetailsData?.leadNumber || '');
      setExistingCustomer(
        GetDearshipDetailsData?.isExistingCustomerFranchise ? 'Yes' : 'No',
      );
      setPaymentTo(GetDearshipDetailsData?.paymentTo || '');
      setSatisfactory(
        GetDearshipDetailsData?.accountConductsSatisfatcory || '',
      );
    }
  }, [GetDearshipDetailsData]);

  useEffect(() => {
    if (SetDearshipDetailsData) {
      navigation.navigate('LoanDetails');
    }
  }, [SetDearshipDetailsData]);

  const FranchiseList: string[] = GetFranchiseData
    ? GetFranchiseData?.map(item => item.code)
    : [];

  const LeadList: string[] = GetExternalLeadData
    ? GetExternalLeadData?.map(item => item.leadSourceType)
    : [];

  const satisfactoryList: Item[] = [
    {label: 'Satisfactory', value: 'Satisfactory'},
    {label: 'Not Satisfactory', value: 'Not Satisfactory'},
  ];

  // console.log('kkkk', GetBussinessChaanelData);

  const businessVerticalList: string[] =
    GetBussinessVerticalData?.channelBranchUserList?.map(
      item => item.businessVerticle,
    ) || [];

  const BussinessChaanelList: Item[] = GetBussinessChaanelData
    ? GetBussinessChaanelData?.channelBranchUserList?.map(item => ({
        label: item.businessChannel,
        value: item.businessChannel,
        businessChannel: item.businessChannel,
      }))
    : [];

  const ChannelBranchUserlList: Item[] = GetChaanelBranchUserData
    ? GetChaanelBranchUserData?.channelBranchUserList?.map(item => ({
        label: item.channelBranchUser,
        value: item.channelBranchUser,
        channelBranchUser: item.channelBranchUser,
      }))
    : [];

  const PayoutCategoryListlList: Item[] = GetChaanelBranchUserData
    ? GetChaanelBranchUserData?.payoutCategoryList?.map(item => ({
        label: item.payoutCategory,
        value: item.payoutCategory,
        payoutCategory: item.payoutCategory,
      }))
    : [];

  const LeadPatnerNameDataList: Item[] = GetLeadPatnerNameData
    ? GetLeadPatnerNameData?.map(item => ({
        label: item.leadPartnerName,
        value: item.leadPartnerName,
        leadPartnerName: item.leadPartnerName,
      }))
    : [];

  // console.log('fffff', BussinessChaanelList);

  const LeadSourceList: Item[] = GetLeadSourceData
    ? GetLeadSourceData?.map(item => ({
        label: item.leadSource,
        value: item.leadSource,
        leadSource: item.leadSource,
      }))
    : [];

  const DelarList: Item[] = GetDelarData
    ? GetDelarData?.dealerTypeDto?.map(item => ({
        label: item.dealerAndBranch,
        value: item.dealerAndBranch,
        dealerCode: item.dealerCode,
        dealerName: item.dealerName,
      }))
    : [];

  useEffect(() => {
    if (employeeCode && isChanged) {
      setIsEmpIdVerified(false);
    }
  }, [employeeCode]);

  const subDelarList: Item[] = GetSubDelarData
    ? GetSubDelarData?.subDealerTypeDto?.map(item => ({
        label: item.subDealerAndBranch,
        value: item.subDealerAndBranch,
        subDealerCode: item.subDealerCode,
        subDealername: item.subDealername,
      }))
    : [];
  //  console.log("yyyyyyy", subDelarList)

  const branchDataList: Item[] = GetBranchData
    ? GetBranchData.map(item => ({
        label: item.brnachNameCode,
        value: item.brnachNameCode,
        branchName: item.branchName,
        branchCode: item.branchCode,
      }))
    : [];

  useEffect(() => {
    if (dealer && isChanged) {
      setSubDealer('');
      setSubDealerItem('');
      GetSubDelar.mutateAsync();
    }
  }, [dealer]);

  useEffect(() => {
    if (getDeliveryLetterData) {
      console.log('getDeliveryLetterData', getDeliveryLetterData);
      setPopUPMsg(getDeliveryLetterData?.message);
      setPopUPVisible(getDeliveryLetterData?.isAlertPopupVisible);
    }
  }, [getDeliveryLetterData]);

  useEffect(() => {
    if (verifyEmpIdData) {
      console.log('verifyEmpIdData', verifyEmpIdData);
      setIsEmpIdVerified(verifyEmpIdData?.isEmployeeIdVerified);
    }
  }, [verifyEmpIdData]);

  useEffect(() => {
    if (dealerOpen) {
      setSubDealerOpen(false);
    }
  }, [dealerOpen]);

  useEffect(() => {
    if (subDealerOpen) {
      setDealerOpen(false);
    }
  }, [subDealerOpen]);

  useEffect(() => {
    if (useViewStatus) {
      setIsViewOnly(
        useViewStatus.isReEdit ? false :
          useViewStatus?.isSalesReject ? true :
            useViewStatus?.isSubmitToCreditFreeze ? true : false);
    }
  }, []);

  useEffect(() => {
    if (dealer) {
      GetSubDelar.mutateAsync();
    }
  }, [dealer]);

  useEffect(() => {
    if (dealer && isChanged) {
      GetDeliveryLetter.mutateAsync();
    }
  }, [dealer]);

  useEffect(() => {
    if (existingCustomer && isChanged) {
      setSatisfactory('');
    }
  }, [existingCustomer]);

  useEffect(() => {
    if (sourcedBy && isChanged ) {
      setPaymentTo('');
      setBusinessChannel('');
      setchannelBranchUser('');
      setLeadSource('');
      setLeadPatnerName('');
      setPayoutCategory('');
      setLeadNumber('');
      setExistingCustomer('');
      setSatisfactory('');
      GetBussinessChaanel.mutateAsync();
    }
  }, [sourcedBy]);

  useEffect(() => {
    if (sourcedBy ) {
      GetBussinessChaanel.mutateAsync();
    }
  }, [sourcedBy]);

  useEffect(() => {
    if (leadSource && leadSource !== 'Echo Partner') {
      GetLeadPatnerName.mutateAsync();
    }
  }, [leadSource]);

  useEffect(() => {
    if (businessChannel ) {
      GetChaanelBranchUser.mutateAsync();
    }
  }, [businessChannel]);

  useEffect(() => {
    if (businessChannel && isChanged) {
      setLeadSource('');
      setLeadPatnerName('');
      setPayoutCategory('');
      setLeadNumber('');
      setExistingCustomer('');
      setSatisfactory('');
    }
  }, [businessChannel]);

  useEffect(() => {
    if (leadSource && isChanged) {
      setLeadPatnerName('');
      setPayoutCategory('');
      setLeadNumber('');
      setExistingCustomer('');
      setSatisfactory('');
    }
  }, [leadSource]);

  useFocusEffect(
    useCallback(() => {
      if (applicantId) {
        GetDelar.mutateAsync();
        // GetFranchise.mutateAsync();
        // GetExternalLead.mutateAsync();
        getDearshipDetails.mutateAsync();
        GetBussinessVertical.mutateAsync();
        GetLeadSource.mutateAsync();
        setIsChanged(false);
      }
    }, []),
  );
  useEffect(() => {
    if (franchise) {
      GetBranch.mutateAsync();
    }
  }, [franchise]);

  const handleSubmit = () => {
    if (isChanged || useViewStatus?.isReEdit) {
      SetDearshipDetails.mutateAsync();
    }
    isNavigate
      ? navigation.navigate('LoanDetails', {isNavigateEmploymentDetails: true})
      : navigation.navigate('LoanDetails');
  };
  // console.log("isActive*****", subDelarList.length == 0 , subDealer == '', subDelarList.length == 0 && subDealer == '');

  return (
    <WaveBackground
      loading={[
        SetDearshipDetailsIsLoading,
        getDeliveryLetterIsLoading,
        GetDearshipDetailsIsLoading,
        GetBussinessVerticalDataIsLoading,
        GetLeadSourceDataIsLoading,
        GetLeadPatnerNameDataIsLoading,
        GetBussinessChaanelDataIsLoading,
        verifyEmpIdIsLoading,
        GetChaanelBranchUserDataIsLoading,
      ]}
      title={'Dealership Details'}>
      <Modal
        buttonTitle="Okay"
        title="Alert!"
        status="normal"
        message={popupMsg}
        visible={popupVisible}
        onClose={() => {
          setPopUPVisible(false);
        }}
      />
      <LabeledRadioButtonGroup
        heading="Business Vertical"
        options={businessVerticalList}
        onChange={setSourcedBy}
        value={sourcedBy}
        isChange={setIsChanged}
        inLine={isSulb ? false : true}
        disabled={isViewOnly}
        mandatory
      />

      <LabeledDropdown
        label="Dealer"
        defaultValue={dealer}
        options={DelarList}
        setSelectedOption={setDealer}
        setSelectedItem={item => {
          setDealerItem(item);
        }}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />

      <LabeledDropdown
        label="Sub Dealer"
        defaultValue={subDealer}
        options={subDelarList}
        setSelectedOption={setSubDealer}
        setSelectedItem={item => {
          setSubDealerItem(item);
        }}
        bottom
        isChange={setIsChanged}
        // mandatory
        disabled={isViewOnly}
      />

      <LabeledDropdown
        label="Payment To"
        defaultValue={paymentTo}
        options={
          subDelarList.length != 0 && subDealer != ''
            ? ['Dealer', 'Sub Dealer']
            : ['Dealer']
        }
        setSelectedOption={setPaymentTo}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />

      <LabeledDropdown
        label="Business Channel"
        defaultValue={businessChannel}
        options={BussinessChaanelList}
        setSelectedOption={setBusinessChannel}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />

      {sourcedBy == 'Alternate Channel' && (
        <LabeledDropdown
          label="Channel Branch/User"
          defaultValue={channelBranchUser}
          options={ChannelBranchUserlList}
          setSelectedOption={setchannelBranchUser}
          bottom
          isChange={setIsChanged}
          mandatory
          disabled={isViewOnly}
        />
      )}

      <LabeledDropdown
        label="Lead Source"
        defaultValue={leadSource}
        options={LeadSourceList}
        setSelectedOption={setLeadSource}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />

      {leadSource == 'Echo Partner' ? (
        <LabeledTextInput
          label="Lead Partner Name"
          onChange={setLeadPatnerName}
          autoCapitalize="characters"
          defaultValue={leadPatnerName}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          disabled={isViewOnly}
        />
      ) : (
        <LabeledDropdown
          label="Lead Partner Name"
          defaultValue={leadPatnerName}
          options={LeadPatnerNameDataList}
          setSelectedOption={setLeadPatnerName}
          bottom
          isChange={setIsChanged}
          mandatory
          disabled={isViewOnly}
        />
      )}

      <LabeledTextInput
        label="Lead Generated By"
        onChange={setEmployeeCode}
        autoCapitalize="characters"
        defaultValue={employeeCode}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />

      {isEmpIdVerified ? (
        <View
          style={{
            flexDirection: 'row',
            marginVertical: '5%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: APP_FONTS.SemiBold,
              fontSize: useFontNormalise(15),
              marginRight: 8,
              top: 3,
              fontWeight: '700',
              color: Colors.Black,
            }}>
            Employee ID Verified{'\t'}
          </Text>
          <Icon name="completed" />
        </View>
      ) : (
        <Button
          text={'Verify'}
          active
          marginVertical={10}
          onPress={() => {
            verifyEmpId.mutateAsync();
          }}
        />
      )}

      {(businessChannel == 'MFL Branch' ||
        businessChannel == 'SULB' ||
        businessChannel == 'BDE' ||
        businessChannel == 'MFL One') && (
        <LabeledDropdown
          label="Payout Category"
          defaultValue={payoutCategory}
          options={PayoutCategoryListlList}
          setSelectedOption={setPayoutCategory}
          bottom
          isChange={setIsChanged}
          mandatory
          disabled={isViewOnly}
        />
      )}

      {leadSource == 'External Lead' && (
        <LabeledTextInput
          label="Lead Number"
          onChange={setLeadNumber}
          autoCapitalize="characters"
          defaultValue={leadNumber}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          disabled={isViewOnly}
        />
      )}

      <LabeledRadioButtonGroup
        heading={`Whether existing customer of ${
          sourcedBy == 'Franchise' ? franchise : 'MCSL'
        }?`}
        options={['Yes', 'No']}
        onChange={setExistingCustomer}
        value={existingCustomer}
        isChange={setIsChanged}
        inLine
        disabled={isViewOnly}
      />

      {existingCustomer == 'Yes' && (
        <LabeledDropdown
          label="Account conducts satisfactory?"
          bottom
          defaultValue={satisfactory}
          options={satisfactoryList}
          setSelectedOption={setSatisfactory}
          isChange={setIsChanged}
          disabled={isViewOnly}
        />
      )}

      <Button
        text={isChanged || useViewStatus?.isReEdit ? 'Save' : 'Next'}
        active={isActive && !hasError && isEmpIdVerified}
        marginVertical={10}
        marginTop={30}
        onPress={handleSubmit}
      />
      <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />
    </WaveBackground>
  );
};
export default DelarshipDetails;
