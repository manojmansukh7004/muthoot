import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import Dashboard from 'screens/TwoWheeler/Dashboard';
import LeadRegistration from 'screens/TwoWheeler/LeadRegistration';
import LeadManagement from 'screens/TwoWheeler/LeadManagement/indexes';
import OTPVerification from 'screens/TwoWheeler/OTPVerification';
import LoanSummary from 'screens/TwoWheeler/LoanSummary';
import KYCVerification from 'screens/TwoWheeler/KYCVerification';
import AddressDetails from 'screens/TwoWheeler/AddressDetails';
import PANVerification from 'screens/TwoWheeler/PANVerification';
import PhotoVerification from 'screens/TwoWheeler/PhotoVerification';
import ProductDetails from 'screens/TwoWheeler/ProductDetails';
import LoanDetails from 'screens/TwoWheeler/LoanDetails';
import DelarshipDetails from 'screens/TwoWheeler/DelarshipDetails';
import References from 'screens/TwoWheeler/References/index';
import { VersionCheckResponse } from 'api/ReactQuery/TwoWheeler/Auth/types';
import EmploymentDetails from 'screens/TwoWheeler/EmploymentDetails';
import PreviewLead from 'screens/TwoWheeler/PreviewLead';
import { SaveorUpdateLeadRequest } from 'api/ReactQuery/TwoWheeler/Lead/types';
import LoanRejected from 'screens/TwoWheeler/LoanRejected';
import AccountAgregators from 'screens/TwoWheeler/AccountAgregators';
import OneMoney from 'screens/TwoWheeler/AccountAgregators/oneMoney';
import BureauSuccess from 'screens/TwoWheeler/BureauSuccess';
import BureauReport from 'screens/TwoWheeler/BureauSuccess/BureauReport';
import { GetCriffResponse } from 'api/ReactQuery/TwoWheeler/BureauApi/types';
import BREApproved from 'screens/TwoWheeler/BREApproved';
import ManualUnderwriting from 'screens/TwoWheeler/ManualUnderwriting';
import LoanOffer from 'screens/TwoWheeler/LoanOffer';
import BankDetails from 'screens/TwoWheeler/BankDetails';
import OVDVerification from 'screens/TwoWheeler/OVDVerification';
import SanctionLetter from 'screens/TwoWheeler/SanctionLetter';
import RepaymentDetails from 'screens/TwoWheeler/RepaymentDetails';
import NachRegistration from 'screens/TwoWheeler/RepaymentDetails/nachRegistration';
import LoanAgreement from 'screens/TwoWheeler/LoanAgreement';
import Agreement from 'screens/TwoWheeler/LoanAgreement/Agreement';
import PostDisbursalDocument from 'screens/TwoWheeler/PostDisbursalDocument';
import PSDDocument from 'screens/TwoWheeler/PSDDocument';
import PreDisbursalDocuments from 'screens/TwoWheeler/PreDisbursalDocuments';
import DeviationDocuments from 'screens/TwoWheeler/DeviationDocuments'
import DeferralDocuments from 'screens/TwoWheeler/DeferralDocuments';
import ManualUnderwriting1 from 'screens/TwoWheeler/ManualUnderwriting1';
import KFS from 'screens/TwoWheeler/KFS';
import KFSAgreement from 'screens/TwoWheeler/KFS/KFSAgreement';

export type RootStackParamList = {
  // Splash: undefined;
  // Login: undefined | {VersionCheckResponse: VersionCheckResponse};
  // ResetPassword: undefined;
  LeadRegistration: undefined | { isNavigatedFromPreviewLead: boolean };
  LeadManagement: undefined;
  Dashboard: undefined;
  PreviewLead:
  | {
    initial: 'mainApplicant';
    LeadRegistration: {
      edited: boolean;
      customerProfileValue: string;
      SaveorUpdateLeadRequest: SaveorUpdateLeadRequest;
    };
  }
  | {
    initial: 'guarantor';
    LeadRegistration: {
      edited: boolean;
      customerProfileValue: string;
      SaveorUpdateLeadRequest: SaveorUpdateLeadRequest;
    };
  };
  OTPVerification: undefined;
  LoanSummary: { ismasterLogin?: boolean } | undefined;
  KYCVerification: undefined;
  PANVerification: undefined;
  OVDVerification: undefined;
  AddressDetails: undefined;
  PhotoVerification: undefined;
  ProductDetails: undefined;
  References: undefined;
  LoanDetails: { isNavigateEmploymentDetails: boolean } | undefined;
  DelarshipDetails: undefined | { isNavigateEmploymentDetails: boolean };
  EmploymentDetails: { GetCriffResponse: GetCriffResponse } | undefined;
  AccountAgregators: undefined;
  OneMoney: undefined;
  BREApproved: {
    GetCriffResponse: GetCriffResponse;
    isGuarantorMandatory?: boolean;
  };
  LoanRejected:
  | {
    GetCriffResponse: GetCriffResponse;
    isGuarantorMandatory?: boolean,
    isNavigateLoanOffer?: boolean;
    message?: string, popup?: boolean
  }
  | undefined;
  BureauSuccess: { GetCriffResponse: GetCriffResponse };
  BureauReport: { webRedirectionUrl: any } | undefined;
  ManualUnderwriting: {
    GetCriffResponse: GetCriffResponse;
    isNavigateLoanOffer?: boolean;
    isGuarantorMandatory?: boolean;
  };
  ManualUnderwriting1: {
    GetCriffResponse: GetCriffResponse;
    isNavigateLoanOffer?: boolean;
    isGuarantorMandatory?: boolean;
  };
  DeviationDocuments: {
    GetCriffResponse?: GetCriffResponse;
    isNavigateLoanOffer?: boolean;
    breStatus?: string
  };
  LoanOffer: undefined;
  BankDetails: undefined;
  SanctionLetter: undefined;
  RepaymentDetails: undefined;
  DeferralDocuments: undefined;
  NachRegistration: { webRedirectionUrl: any } | undefined;
  PreDisbursalDocuments: undefined;
  //DeviationDocuments: undefined;
  LoanAgreement: undefined;
  Agreement: { webRedirectionUrl?: any } | undefined;
  PSDDocument: undefined;
  PostDisbursalDocument: undefined;
  KFS: undefined
  KFSAgreement: { webRedirectionUrl?: any } | undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();


const TwoWheelerStack = () => {
  // console.log("mjjjjjj");

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: false,
        animation: 'fade',
      })}>

      {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}

      <Stack.Screen name="LeadManagement" component={LeadManagement} />
      <Stack.Screen name="LeadRegistration" component={LeadRegistration} />
      <Stack.Screen name="PreviewLead" component={PreviewLead} />
      <Stack.Screen name="OTPVerification" component={OTPVerification} />
      <Stack.Screen name="LoanSummary" component={LoanSummary} />
      <Stack.Screen name="PANVerification" component={PANVerification} />
      <Stack.Screen name="OVDVerification" component={OVDVerification} />
      <Stack.Screen name="KYCVerification" component={KYCVerification} />
      <Stack.Screen name="AddressDetails" component={AddressDetails} />
      <Stack.Screen name="PhotoVerification" component={PhotoVerification} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="DelarshipDetails" component={DelarshipDetails} />
      <Stack.Screen name="LoanDetails" component={LoanDetails} />
      <Stack.Screen name="AccountAgregators" component={AccountAgregators} />
      <Stack.Screen name="OneMoney" component={OneMoney} />
      <Stack.Screen name="BureauSuccess" component={BureauSuccess} />
      <Stack.Screen name="BureauReport" component={BureauReport} />
      <Stack.Screen name="BREApproved" component={BREApproved} />
      <Stack.Screen name="LoanRejected" component={LoanRejected} />
      <Stack.Screen name="ManualUnderwriting" component={ManualUnderwriting} />
      <Stack.Screen name="ManualUnderwriting1" component={ManualUnderwriting1} />
      <Stack.Screen name="References" component={References} />
      <Stack.Screen name="EmploymentDetails" component={EmploymentDetails} />
      <Stack.Screen name="LoanOffer" component={LoanOffer} />
      <Stack.Screen name="BankDetails" component={BankDetails} />
      <Stack.Screen name="SanctionLetter" component={SanctionLetter} />
      <Stack.Screen name="RepaymentDetails" component={RepaymentDetails} />
      <Stack.Screen name="NachRegistration" component={NachRegistration} />
      <Stack.Screen name="PSDDocument" component={PSDDocument} />
      <Stack.Screen name="PreDisbursalDocuments" component={PreDisbursalDocuments} />
      <Stack.Screen name="DeferralDocuments" component={DeferralDocuments} />
      <Stack.Screen name="LoanAgreement" component={LoanAgreement} />
      <Stack.Screen name="Agreement" component={Agreement} />
      <Stack.Screen name="PostDisbursalDocument" component={PostDisbursalDocument} />
      <Stack.Screen name="DeviationDocuments"component={DeviationDocuments}/>
      <Stack.Screen name="KFS" component={KFS} />
      <Stack.Screen name="KFSAgreement" component={KFSAgreement} />

    </Stack.Navigator>
  );

};
export default TwoWheelerStack;
