import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


// import Dashboard from 'screens/Pl/Dashboard/index';
import LeadRegistration from 'screens/Pl/LeadRegistration';
import LeadManagement from 'screens/Pl/LeadManagement/indexes';
import OTPVerification from 'screens/Pl/OTPVerification';
import LoanSummary from 'screens/Pl/LoanSummary';
import KYCVerification from 'screens/Pl/KYCVerification';
import AddressDetails from 'screens/Pl/AddressDetails';
import PANVerification from 'screens/Pl/PANVerification';
import PhotoVerification from 'screens/Pl/PhotoVerification';
import ProductDetails from 'screens/Pl/ProductDetails';
import LoanDetails from 'screens/Pl/LoanDetails';
import DelarshipDetails from 'screens/Pl/DelarshipDetails';
import References from 'screens/Pl/References/index';
import {VersionCheckResponse} from 'api/ReactQuery/TwoWheeler/Auth/types';
import EmploymentDetails from 'screens/Pl/EmploymentDetails';
import PreviewLead from 'screens/Pl/PreviewLead';
import {SaveorUpdateLeadRequest} from 'api/ReactQuery/TwoWheeler/Lead/types';
import LoanRejected from 'screens/Pl/LoanRejected';
import AccountAgregators from 'screens/Pl/AccountAgregators';
import OneMoney from 'screens/Pl/AccountAgregators/oneMoney';
import BureauSuccess from 'screens/Pl/BureauSuccess';
import BureauReport from 'screens/Pl/BureauSuccess/BureauReport';
import {GetCriffResponse} from 'api/ReactQuery/TwoWheeler/BureauApi/types';
import BREApproved from 'screens/Pl/BREApproved';
import ManualUnderwriting from 'screens/Pl/ManualUnderwriting';
import LoanOffer from 'screens/Pl/LoanOffer';
import BankDetails from 'screens/Pl/BankDetails';
import OVDVerification from 'screens/Pl/OVDVerification';
import SanctionLetter from 'screens/Pl/SanctionLetter';
import RepaymentDetails from 'screens/Pl/RepaymentDetails';
import NachRegistration from 'screens/Pl/RepaymentDetails/nachRegistration';
import LoanAgreement from 'screens/Pl/LoanAgreement';
import Agreement from 'screens/Pl/LoanAgreement/Agreement';

import PostDisbursalDocument from 'screens/Pl/PostDisbursalDocument';
import PSDDocument from 'screens/Pl/PSDDocument';
import PreDisbursalDocuments from 'screens/Pl/PreDisbursalDocuments';
import DeviationDocuments from 'screens/Pl/DeviationDocuments'
import DeferralDocuments from 'screens/Pl/DeferralDocuments';
import ManualUnderwriting1 from 'screens/Pl/ManualUnderwriting1';
import KFS from 'screens/Pl/KFS';
import KFSAgreement from 'screens/Pl/KFS/KFSAgreement';

export type PlStackParamList = {
  // Splash: undefined;
  // Login: undefined | {VersionCheckResponse: VersionCheckResponse};
  // ResetPassword: undefined;
  LeadRegistration: undefined | {isNavigatedFromPreviewLead: boolean};
  LeadManagement: undefined;
  // Dashboard: undefined;
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
  LoanSummary: {ismasterLogin?: boolean} | undefined;
  KYCVerification: undefined;
  PANVerification: undefined;
  OVDVerification: undefined;
  AddressDetails: undefined;
  PhotoVerification: undefined;
  ProductDetails: undefined;
  References: undefined;
  LoanDetails: {isNavigateEmploymentDetails: boolean} | undefined;
  DelarshipDetails: undefined | {isNavigateEmploymentDetails: boolean};
  EmploymentDetails: {GetCriffResponse: GetCriffResponse} | undefined;
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
  BureauSuccess: {GetCriffResponse: GetCriffResponse};
  BureauReport: {webRedirectionUrl: any} | undefined;
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
  NachRegistration: {webRedirectionUrl: any} | undefined;
  PreDisbursalDocuments: undefined;
  //DeviationDocuments: undefined;
  LoanAgreement: undefined;
  Agreement: {webRedirectionUrl?: any} | undefined;
  PSDDocument: undefined;
  PostDisbursalDocument: undefined;
  KFS: undefined
  KFSAgreement: { webRedirectionUrl?: any } | undefined;
};

const Stack = createNativeStackNavigator<PlStackParamList>();
const PlStack = () => {
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
        <Stack.Screen name="ManualUnderwriting1" component={ManualUnderwriting1}/>
        <Stack.Screen name="References" component={References} />
        <Stack.Screen name="EmploymentDetails" component={EmploymentDetails} />
        <Stack.Screen name="LoanOffer" component={LoanOffer} />
        <Stack.Screen name="BankDetails" component={BankDetails} />
        <Stack.Screen name="SanctionLetter" component={SanctionLetter} />
        <Stack.Screen name="RepaymentDetails" component={RepaymentDetails} />
        <Stack.Screen name="NachRegistration" component={NachRegistration} />
        <Stack.Screen name="PSDDocument" component={PSDDocument} />
        <Stack.Screen name="PreDisbursalDocuments" component={PreDisbursalDocuments}/>
        <Stack.Screen name="DeferralDocuments" component={DeferralDocuments} />
        <Stack.Screen name="LoanAgreement" component={LoanAgreement} />
        <Stack.Screen name="Agreement" component={Agreement} />
        <Stack.Screen name="PostDisbursalDocument" component={PostDisbursalDocument}/>
          <Stack.Screen name="DeviationDocuments" component={DeviationDocuments}/>
        <Stack.Screen name="KFS" component={KFS} />
      <Stack.Screen name="KFSAgreement" component={KFSAgreement} />

      </Stack.Navigator>
    );
  
  
};
export default PlStack;
