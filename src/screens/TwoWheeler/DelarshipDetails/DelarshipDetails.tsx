import React, { FC, useCallback, useEffect, useState } from 'react';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import { useApplicantDetails } from 'context/useApplicantDetails';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import LabeledTextInput from 'components/LabeledTextInput';
import LabeledRadioButtonGroup from 'components/RadioButtonGroup';
import useActive from 'hooks/useActive';
import Button from 'components/Button';
import { ErrorObject } from 'config/Types';
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
  useGetDeliveryLetter
} from 'api/ReactQuery/TwoWheeler/LoanDetails';
import { setDearshipDetailsRequest, getDeliveryLetterRequest } from 'api/ReactQuery/TwoWheeler/LoanDetails/types';
import { usedViewStatus } from 'context/useViewStatus';

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

  const { applicantId, isMainApplicant, guarantorId } = useApplicantDetails();
  const { useViewStatus } = usedViewStatus();
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
  const [franchise, setFranchise] = useState<string>('');
  const [franchiseOpen, setFranchiseOpen] = useState<boolean>(false);
  const [branch, setBranch] = useState<string>('');
  const [branchOpen, setBranchOpen] = useState<boolean>(false);
  const [branchItem, setBranchItem] = useState<any>('');
  const [employeeCode, setEmployeeCode] = useState<string>('');
  const [existingCustomer, setExistingCustomer] = useState<string>('');
  const [satisfactory, setSatisfactory] = useState<string>('');
  const [satisfactoryOpen, setSatisfactoryOpen] = useState<boolean>(false);
  const [leadSource, setLeadSource] = useState<string>('');
  const [leadNumber, setLeadNumber] = useState<string>('');
  const [popupVisible, setPopUPVisible] = useState<boolean>(false);
  const [popupMsg, setPopUPMsg] = useState<string>('');

  const activeDealerArray = [
    sourcedBy,
    dealer,
    paymentTo,
    existingCustomer,
    existingCustomer == 'Yes' ? satisfactory : existingCustomer,
  ];
  const activeFranchiseArray = [
    sourcedBy,
    dealer,
    paymentTo,
    franchise,
    branch,
    employeeCode,
    existingCustomer,
    existingCustomer == 'Yes' ? satisfactory : existingCustomer,
  ];
  const activeExternalLeadArray = [
    sourcedBy,
    dealer,
    paymentTo,
    leadSource,
    leadNumber,
  ];
  const activeArray = [
    sourcedBy,

  ];
  let isActive: boolean = useActive(
    sourcedBy == 'Dealer' || sourcedBy == 'SULB' ? activeDealerArray : sourcedBy == 'External Lead' ? activeExternalLeadArray : sourcedBy == 'Franchise' ? activeFranchiseArray : activeArray,
  );

  console.log("activeFranchiseArray", paymentTo);

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
    dealerName: dealerItem?.dealerName,
    dealerCode: dealerItem?.dealerCode || '',
    subDealerName: subDealerItem?.subDealername,
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
    paymentTo: paymentTo
  };

  const getDeliveryLetterRequest: getDeliveryLetterRequest = {
    dealerCode: dealerItem?.dealerCode,

  };

  const [
    GetDeliveryLetter,
    { data: getDeliveryLetterData, isLoading: getDeliveryLetterIsLoading },
  ] = useGetDeliveryLetter(getDeliveryLetterRequest);

  const [
    SetDearshipDetails,
    { data: SetDearshipDetailsData, isLoading: SetDearshipDetailsIsLoading },
  ] = useSetDearshipDetails(setDearshipDetailsRequest);

  const [
    getDearshipDetails,
    { data: GetDearshipDetailsData, isLoading: GetDearshipDetailsIsLoading },
  ] = useGetDearshipDetails(`/${'mainApplicant'}/${applicantId}`);

  const [GetDelar, { data: GetDelarData, isLoading: GetDelarDataIsLoading }] =
    useGetDelar(`?applicantType=${'mainApplicant'}&appId=${applicantId}&franchiseSourceBy=${franchise}`);

  const [
    GetSubDelar,
    { data: GetSubDelarData, isLoading: GetSubDelarDataIsLoading },
  ] = useGetSubDelar(`?dealerCode=${dealerItem?.dealerCode}`);

  const [
    GetFranchise,
    { data: GetFranchiseData, isLoading: GetFranchiseDataIsLoading },
  ] = useGetFranchise();

  const [
    GetExternalLead,
    { data: GetExternalLeadData, isLoading: GetExternalLeadDataIsLoading },
  ] = useGetExternalLead();

  const [GetBranch, { data: GetBranchData, isLoading: GetBranchDataIsLoading }] =
    useGetBranch(`/${franchise}/${applicantId}`);

  useEffect(() => {
    if (GetDearshipDetailsData) {
      console.log("GetDearshipDetailsData", GetDearshipDetailsData);
      setIsSulb(GetDearshipDetailsData?.isSulb || false)
      setSourcedBy(GetDearshipDetailsData.sourcedBy || '');
      setDealer(GetDearshipDetailsData?.dealerAndBranch || '');
      setDealerItem({ "dealerCode": GetDearshipDetailsData?.dealerCode, 'dealerName': GetDearshipDetailsData?.dealerName })
      setSubDealer(GetDearshipDetailsData?.subDealerAndBranch || '');
      setSubDealerItem({ "subDealerCode": GetDearshipDetailsData?.subDealerCode, 'subDealerName': GetDearshipDetailsData?.subDealername })
      setBranch(GetDearshipDetailsData?.branchName || '');
      setFranchise(GetDearshipDetailsData?.franchiseSourcedBy || '');
      setEmployeeCode(GetDearshipDetailsData?.employeeCode || '');
      setLeadSource(GetDearshipDetailsData?.leadSourcedBy || '');
      setLeadNumber(GetDearshipDetailsData?.leadNumber || '');
      setExistingCustomer(
        GetDearshipDetailsData?.isExistingCustomerFranchise ? 'Yes' : 'No',
      );
      setPaymentTo(GetDearshipDetailsData?.paymentTo || '')
      setSatisfactory(GetDearshipDetailsData?.accountConductsSatisfatcory || '');
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
    { label: 'Satisfactory', value: 'Satisfactory' },
    { label: 'Not Satisfactory', value: 'Not Satisfactory' },
  ];

  const DelarList: Item[] = GetDelarData
    ? GetDelarData?.dealerTypeDto?.map(item => ({
      label: item.dealerAndBranch,
      value: item.dealerAndBranch,
      dealerCode: item.dealerCode,
      dealerName: item.dealerName,
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
      setSubDealer('')
      setSubDealerItem('')
      GetSubDelar.mutateAsync();

    }
  }, [dealer]);

  useEffect(() => {
    if (getDeliveryLetterData) {
      console.log('getDeliveryLetterData', getDeliveryLetterData);
      setPopUPMsg(getDeliveryLetterData?.message)
      setPopUPVisible(getDeliveryLetterData?.isAlertPopupVisible)
    }
  }, [getDeliveryLetterData]);

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
    if (sourcedBy && isChanged) {
      setFranchise('');
      setEmployeeCode('');
      setBranch('');
      setLeadNumber('')
      setLeadSource('')
    }
  }, [sourcedBy]);

  useEffect(() => {
    if (dealerOpen) {
      setSubDealerOpen(false)
    }
  }, [dealerOpen]);

  useEffect(() => {
    if (subDealerOpen) {
      setDealerOpen(false)
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

  useFocusEffect(
    useCallback(() => {
      if (applicantId) {
        GetDelar.mutateAsync();
        GetFranchise.mutateAsync();
        GetExternalLead.mutateAsync()
        getDearshipDetails.mutateAsync();
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
      ? navigation.navigate('LoanDetails', { isNavigateEmploymentDetails: true })
      : navigation.navigate('LoanDetails');
  };
  // console.log("isActive*****", subDelarList.length == 0 , subDealer == '', subDelarList.length == 0 && subDealer == '');

  return (
    <WaveBackground
      loading={[SetDearshipDetailsIsLoading, getDeliveryLetterIsLoading, GetDearshipDetailsIsLoading]}
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
        heading="Sourced By "
        options={
          isSulb ?
            ['Dealer', 'Franchise', 'External Lead', 'SULB']
            : ['Dealer', 'Franchise', 'External Lead']
        }
        onChange={setSourcedBy}
        value={sourcedBy}
        isChange={setIsChanged}
        inLine={isSulb ? false : true}
        disabled={isViewOnly}

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

      {
        // sourcedBy == 'Dealer' && 
        (
          <>

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
              options={subDelarList.length != 0 && subDealer != '' ? ["Dealer", "Sub Dealer"] : ["Dealer"]}
              setSelectedOption={setPaymentTo}
              bottom
              isChange={setIsChanged}
              mandatory
              disabled={isViewOnly}
            />

          </>
        )}



      {sourcedBy == 'Franchise' && (
        <LabeledTextInput
          label="Employee Code"
          onChange={setEmployeeCode}
          autoCapitalize="characters"
          defaultValue={employeeCode}
          // disabled={GetPANDetailsData?.documentVerifiedStatus}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          disabled={isViewOnly}

        />
      )}

      {sourcedBy == 'External Lead' && (
        <LabeledDropdown
          label="Lead Sourced by"
          defaultValue={leadSource}
          options={LeadList}
          setSelectedOption={setLeadSource}
          isChange={setIsChanged}
          mandatory
          bottom
          disabled={isViewOnly}
        />
      )}

      {sourcedBy == 'External Lead' && (
        <LabeledTextInput
          label="Lead Number"
          onChange={setLeadNumber}
          autoCapitalize="characters"
          defaultValue={leadNumber}
          // disabled={GetPANDetailsData?.documentVerifiedStatus}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          disabled={isViewOnly}

        />
      )}

      {sourcedBy != 'External Lead' && (
        <LabeledRadioButtonGroup
          heading={`Whether existing customer of ${sourcedBy == 'Franchise' ? franchise : 'MCSL'}?`}
          options={['Yes', 'No']}
          onChange={setExistingCustomer}
          value={existingCustomer}
          isChange={setIsChanged}
          inLine
          disabled={isViewOnly}
        />
      )}

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
        text={(isChanged || useViewStatus?.isReEdit) ? 'Save' : 'Next'}
        active={isActive && !hasError}
        marginVertical={10}
        marginTop={30}
        onPress={handleSubmit}
      />
      <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />
    </WaveBackground>
  );
};
export default DelarshipDetails;