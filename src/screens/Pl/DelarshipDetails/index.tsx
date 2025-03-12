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
  useGetHpNumber,
  useGetDedupeDetails,
  useGetLeadBusinessVerticle,
  useGetLeadSource,
  useGetVerifyEmployee,
} from 'api/ReactQuery/PL/LoanDetails';
import {
  setDearshipDetailsRequest,
  dedupeDetailsRequest,
  getVerifyEmployeeRequest,
} from 'api/ReactQuery/PL/LoanDetails/types';
import {usedViewStatus} from 'context/useViewStatus';
import {View, Text} from 'react-native';
import Modal from 'components/Modal';
import { useEmployeeDetails } from 'context/useEmployeeDetails';
import { APP_FONTS } from 'config/Fonts';
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
  
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [isError, setIsError] = useState<ErrorObject[]>([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const isNavigate = route.params?.isNavigateEmploymentDetails;
  const [sourcedBy, setSourcedBy] = useState<string>('Dealer');
  const [isSulb, setIsSulb] = useState<boolean>(false);

  const [dealer, setDealer] = useState<string>('');
  const [paymentTo, setPaymentTo] = useState<string>('');
  const [hpNumber, setHpNumber] = useState<string>('');

  const [dealerOpen, setDealerOpen] = useState<boolean>(false);
  const [dealerItem, setDealerItem] = useState<any>('');
  const [subDealer, setSubDealer] = useState<string>('');
  const [subDealerOpen, setSubDealerOpen] = useState<boolean>(false);
  const [subDealerItem, setSubDealerItem] = useState<any>('');
  const [franchise, setFranchise] = useState<string>('');
  const [franchiseOpen, setFranchiseOpen] = useState<boolean>(false);
  const [branch, setBranch] = useState<string>('');
  const [branchOpen, setBranchOpen] = useState<boolean>(false);
  const [branchItem, setBranchItem] = useState<any>('');
  const [employeeCode, setEmployeeCode] = useState<string>(employeeId);
  const [existingCustomer, setExistingCustomer] = useState<string>('');
  const [satisfactory, setSatisfactory] = useState<string>('');
  const [satisfactoryOpen, setSatisfactoryOpen] = useState<boolean>(false);
  const [leadSource, setLeadSource] = useState<string>('');
  const [leadNumber, setLeadNumber] = useState<string>('');
  const [commonPopupVisible, setCommonPopUPVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [businessChannel, setBusinessChannel] = useState<string>('');
  const [channelBranchUser, setchannelBranchUser] = useState<string>('');
  const [isEmpIdVerified, setIsEmpIdVerified] = useState<boolean>(true);

  const activeDealerArray = [
    sourcedBy,
    paymentTo,
    // hpNumber,
    businessChannel,
    channelBranchUser,
    employeeCode,
    // isEmpIdVerified 
    // existingCustomer,
    // existingCustomer == 'Yes' ? satisfactory : existingCustomer,
  ];

  const activeArray = [sourcedBy];
  let isActive: boolean = useActive(activeDealerArray);

  console.log("activeFranchiseArray", isEmpIdVerified);

  // let isActive: boolean = useActive(
  //   sourcedBy == 'Dealer' ? activeDealerArray : activeFranchiseArray,
  // );

  let hasError: boolean = isError.some(error => error.hasError === true);

  const setDearshipDetailsRequest: setDearshipDetailsRequest = {
    appId: applicantId,
    isUpdatedBy: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    sourcedBy: sourcedBy,
    dealerAndBranch: dealer,
    subDealerAndBranch: subDealer,
    dealerName: dealerItem?.dealerName || "Loyalty Loan",
    dealerCode: dealerItem?.dealerCode || 'TOL',
    subDealerName: subDealerItem?.subDealername||"Loyalty Loan",
    subDealerCode: subDealerItem?.subDealerCode || 'TOL',
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
    hpNumber: hpNumber,
    businessVerticle: sourcedBy,
    businessChannel: businessChannel,
    channelBranchUser: channelBranchUser,
    leadGeneratedBy: employeeCode,
    originalEmployeeId:employeeId,
    isEmployeeIdVerified: isEmpIdVerified,
  };

  const dedupeDetailsRequest: dedupeDetailsRequest = {
    appId: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    hpNumber: hpNumber,
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
    SetDearshipDetails,
    {data: SetDearshipDetailsData, isLoading: SetDearshipDetailsIsLoading},
  ] = useSetDearshipDetails(setDearshipDetailsRequest);

  const [
    GetDedupeDetails,
    {data: GetDedupeDetailsData, isLoading: GetDedupeDetailsIsLoading},
  ] = useGetDedupeDetails(dedupeDetailsRequest);

  const [
    getDearshipDetails,
    {data: GetDearshipDetailsData, isLoading: GetDearshipDetailsIsLoading},
  ] = useGetDearshipDetails(`/${'mainApplicant'}/${applicantId}`);

  const [GetDelar, {data: GetDelarData, isLoading: GetDelarDataIsLoading}] =
    useGetDelar(
      `?applicantType=${'mainApplicant'}&appId=${applicantId}&franchiseSourceBy=${franchise}`,
    );

  const [
    GetHpNumber,
    {data: GetHpNumberData, isLoading: GetHpNumberDataIsLoading},
  ] = useGetHpNumber(`/${applicantId}`);

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

  useEffect(() => {
    if (GetDearshipDetailsData) {
      console.log('GetDearshipDetailsData', GetDearshipDetailsData);
      setIsSulb(GetDearshipDetailsData?.isSulb || false);
      setSourcedBy(GetDearshipDetailsData.sourcedBy);
      setBusinessChannel(GetDearshipDetailsData.businessChannel || '');
      setchannelBranchUser(GetDearshipDetailsData.channelBranchUser || '');
      setIsEmpIdVerified(GetDearshipDetailsData.isEmployeeIdVerified );
      setEmployeeCode(GetDearshipDetailsData.leadGeneratedBy || '');

      setHpNumber(GetDearshipDetailsData.hpNumber);
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
      // setSatisfactory(GetDearshipDetailsData?.accountConductsSatisfatcory || '');
      setCommonPopUPVisible(GetDearshipDetailsData?.isPopUpVisible || false);
      setErrorMsg(GetDearshipDetailsData?.message || '');
    }
  }, [GetDearshipDetailsData]);

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

  useEffect(() => {
    if (SetDearshipDetailsData) {
      GetDedupeDetails?.mutateAsync();
    }
  }, [SetDearshipDetailsData]);

   useEffect(() => {
      if (verifyEmpIdData) {
        console.log('verifyEmpIdData', verifyEmpIdData);
        setIsEmpIdVerified(verifyEmpIdData?.isEmployeeIdVerified);
      }
    }, [verifyEmpIdData]);

  useEffect(() => {
    if (GetDedupeDetailsData) {
      GetDedupeDetailsData?.isNextEnable
        ? navigation.navigate('LoanDetails')
        : (setErrorMsg(GetDedupeDetailsData?.message),
          setCommonPopUPVisible(true));
    }
  }, [GetDedupeDetailsData]);

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

  const DelarList: Item[] = GetDelarData
    ? GetDelarData?.dealerTypeDto?.map(item => ({
        label: item.dealerAndBranch,
        value: item.dealerAndBranch,
        dealerCode: item.dealerCode,
        dealerName: item.dealerName,
      }))
    : [];
  // console.log("jjjjjjj", GetHpNumberData);

  const HPNumberList: Item[] = GetHpNumberData
    ? GetHpNumberData?.map(item => ({
        label: item.hpNumber,
        value: item.hpNumber,
        hpNumber: item.hpNumber,
      }))
    : [];

  // useEffect(() => {
  //   if (GetSubDelarData) {
  //     console.log("GetSubDelarData", GetSubDelarData);

  //   }
  // }, [GetSubDelarData])

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
      if (employeeCode && isChanged) {
        setIsEmpIdVerified(false);
      }
    }, [employeeCode]);

  useEffect(() => {
    if (dealer) {
      GetSubDelar.mutateAsync();
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
       
        setLeadNumber('');
        setExistingCustomer('');
        setSatisfactory('');
        GetBussinessChaanel.mutateAsync();
      }
    }, [sourcedBy]);



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
      if (businessChannel ) {
        GetChaanelBranchUser.mutateAsync();
      }
    }, [businessChannel]);

   useEffect(() => {
      if (sourcedBy ) {
        GetBussinessChaanel.mutateAsync();
      }
    }, [sourcedBy]);

  useEffect(() => {
    if (useViewStatus) {
      setIsViewOnly(
        useViewStatus.isReEdit
          ? false
          : useViewStatus?.isSalesReject
          ? true
          : useViewStatus?.isSubmitToCreditFreeze
          ? true
          : false,
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (applicantId) {
        GetDelar.mutateAsync();
        GetHpNumber.mutateAsync();
        GetFranchise.mutateAsync();
        GetExternalLead.mutateAsync();
        getDearshipDetails.mutateAsync();
        GetBussinessVertical.mutateAsync();

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
    } else {
      GetDearshipDetailsData?.isNextEnable
        ? navigation.navigate('LoanDetails')
        : setCommonPopUPVisible(true);
    }
    // isNavigate
    //   ? navigation.navigate('LoanDetails', { isNavigateEmploymentDetails: true })
    //   : navigation.navigate('LoanDetails');
  };
  // console.log("isActive*****", DelarList,subDelarList);

  return (
    <WaveBackground
      loading={[
        SetDearshipDetailsIsLoading,
        GetDedupeDetailsIsLoading,
        GetDearshipDetailsIsLoading,
        GetHpNumberDataIsLoading,
        GetBussinessVerticalDataIsLoading,
        GetBussinessChaanelDataIsLoading,
        verifyEmpIdIsLoading
      ]}
      title={'Dealership Details'}>
      <Modal
        buttonTitle="Okay"
        title=""
        status="normal"
        message={errorMsg}
        visible={commonPopupVisible}
        onClose={() => {
          setCommonPopUPVisible(false);
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

      {sourcedBy == 'Franchise' && (
        <LabeledDropdown
          label="Franchise sourced by"
          defaultValue={franchise}
          options={FranchiseList}
          setSelectedOption={setFranchise}
          isChange={setIsChanged}
          mandatory
          bottom
          disabled={isViewOnly}
        />
      )}

      {sourcedBy == 'Franchise' && (
        <LabeledDropdown
          label="Branch"
          defaultValue={branch}
          options={branchDataList}
          setSelectedOption={setBranch}
          setSelectedItem={item => {
            setBranchItem(item);
          }}
          isChange={setIsChanged}
          mandatory
          bottom
          disabled={isViewOnly}
        />
      )}

      {/* <LabeledDropdown
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
      /> */}

    
      {/* <View style={{ marginTop: 40 }} /> */}

      <LabeledDropdown
        label="Payment To"
        defaultValue={paymentTo}
        options={['Customer']}
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

      {/* {sourcedBy == 'Alternate Channel' && ( */}
      <LabeledDropdown
        label="Branch Code/Name"
        defaultValue={channelBranchUser}
        options={ChannelBranchUserlList}
        setSelectedOption={setchannelBranchUser}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />
      {/* )} */}

      <LabeledDropdown
        label="HP Number"
        defaultValue={hpNumber}
        options={HPNumberList}
        setSelectedOption={setHpNumber}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />

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
