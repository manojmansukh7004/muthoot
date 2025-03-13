import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, BackHandler } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGetCKYCStatus } from 'api/ReactQuery/PL/CKYC';
import { GetCKYCStatusRequest } from 'api/ReactQuery/PL/CKYC/types';
import { ApplicantStatus } from 'api/ReactQuery/PL/Lead/types';
import { useViewStatus } from 'api/ReactQuery/PL/Lead';
import WaveBackground from 'components/WaveBackground';
import SummaryCardPL, { qdeSectionsType } from 'components/SummaryCardPL';
import { useApplicantDetails } from 'context/useApplicantDetails';
import { useCKYCData } from 'context/useCKYCData';
import { usedViewStatus } from 'context/useViewStatus';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import { useEmployeeDetails } from 'context/useEmployeeDetails';
import { applicantType } from 'api/ReactQuery/PL';
import { ScreenNames, applicantTypeObect } from 'config/Types';
import { useGetSanctionLetterDetails } from 'api/ReactQuery/PL/Lead';
import {
  useGetCreditToSubmitDetails
} from 'api/ReactQuery/PL/Employment';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from 'components/Button';

export type LoanSummaryNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoanSummary'
>;
type LoanSummaryRouteProp = RouteProp<RootStackParamList, 'LoanSummary'>;

interface LoanSummaryScreenProps {
  navigation: LoanSummaryNavigationProp;
  route: LoanSummaryRouteProp;
}

const LoanSummary: FC<LoanSummaryScreenProps> = ({ navigation, route }) => {
  const { applicantId, guarantorId, SetMainApplicant, SaveGuarantorId, SetGuarantor } = useApplicantDetails();
  // var applicantId = "MU358989"
  // const masterLogin = route?.params?.ismasterLogin;

  const { employeeId } = useEmployeeDetails();
  const { SaveCKYCData } = useCKYCData();
  const { SaveViewStatus } = usedViewStatus();
  const [applicantTypes, setApplicantTypes] = useState<applicantTypeObect[]>([
    { applicantId, applicantType: 'mainApplicant' },
  ]);
  const ismasterLogin = route?.params?.ismasterLogin;

  console.log("ismasterLogin", ismasterLogin);

  const [mainApplicantStatus, setMainApplicantStatus] = useState<ApplicantStatus>();
  const [guarantorStatus, setGuarantorStatus,] = useState<ApplicantStatus>();
  const [applicantType, setApplicantType] = useState<applicantType>('mainApplicant');
  const [isNextEnable, setIsNextEnable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [masterLogin, setMasterLogin] = useState<string>('false');

  const GetCKYCStatusRequest: GetCKYCStatusRequest = {
    appId: applicantType === 'mainApplicant' ? applicantId : guarantorId,
    applicantType:
      applicantType === 'mainApplicant' ? 'mainApplicant' : 'guarantor',
    type: 'kycStatus',
    employeeId,
  };

  const [
    GetSanctionLetterDetails,
    {
      data: GetSanctionLetterDetailsData,
      isLoading: GetSanctionLetterDetailsIsLoading,
    },
  ] = useGetSanctionLetterDetails(applicantId);


  useEffect(() => {
    if (GetSanctionLetterDetailsData) {
      console.log("GetSanctionLetterDetailsData", GetSanctionLetterDetailsData);
      setIsNextEnable(GetSanctionLetterDetailsData.isNextEnable || false);
    }
  }, [GetSanctionLetterDetailsData])


  const [GetCKYCStatus, { data: GetCKYCStatusData, isLoading: GetCKYCStatusDataIsLoading }] =
    useGetCKYCStatus(GetCKYCStatusRequest);

  const [ViewStatus, { data: ViewStatusData, isLoading: ViewStatusIsLoading }] =
    useViewStatus(applicantId);

  const memoizedViewStatusData = useMemo(
    () => ViewStatusData,

    [ViewStatusData],
  );



  const memoizedCKYCStatusData = useMemo(
    () => GetCKYCStatusData,

    [GetCKYCStatusData],
  );



  useEffect(() => {
    if (guarantorId && applicantTypes.length < 2) {
      let finalApplicantTypes: applicantTypeObect[] = [
        ...applicantTypes,
        {
          applicantId: guarantorId,
          applicantType: 'guarantor',
        },
      ];
      setApplicantTypes(finalApplicantTypes);
    }
  }, [guarantorId]);

  useEffect(() => {
    if (memoizedViewStatusData) {
      console.log("memoizedViewStatusData", memoizedViewStatusData.mainApplicant);

      if (
        memoizedViewStatusData.isGuarantor &&
        memoizedViewStatusData.guarantor[0]
      ) {
        setGuarantorStatus(memoizedViewStatusData.guarantor[0] || {});

        !guarantorId &&
          SaveGuarantorId(
            memoizedViewStatusData.guarantor[0].guarantorId || '',
          );
      }

      SetGuarantor(memoizedViewStatusData?.isGuarantor)
      setMainApplicantStatus(memoizedViewStatusData?.mainApplicant[0] || {});
      // setIsLoading(false)
    }
  }, [memoizedViewStatusData]);

  const qdeSections: qdeSectionsType[] = [
    {
      screenName: 'PAN Verification',
      navigation: ScreenNames.PANVerification,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.panStatus
          : guarantorStatus?.panStatus,
    },
    {
      screenName: 'OVD Verification',
      navigation: ScreenNames.OVDVerification,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.ovdStatus
          : guarantorStatus?.ovdStatus,
    },
    {
      screenName: 'KYC Verification',
      navigation: ScreenNames.KYCVerification,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.kycStatus
          : guarantorStatus?.kycStatus,
    },
    {
      screenName: 'Photo Verification',
      navigation: ScreenNames.PhotoVerification,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.photoVerification
          : guarantorStatus?.photoVerification,
    },
    {
      screenName: 'Address Details',
      navigation: ScreenNames.AddressDetails,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.currentPermentAddressStatus
          : guarantorStatus?.currentPermentAddressStatus,
    },
    {
      screenName: 'Bureau Success',
      navigation: ScreenNames.BureauSuccess,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.breSuccess
          : guarantorStatus?.breSuccess,
    },
    {
      screenName:
        applicantType === 'mainApplicant' && mainApplicantStatus
          ? mainApplicantStatus.bre1Status === 'Bre1_Approved'
            ? 'BRE 1 Approved'
            : mainApplicantStatus.bre1Status === 'Bre1_Rejected'
              ? 'Loan Rejected'
              : 'Manual Underwriting'
          : guarantorStatus?.bre1Status === 'Bre1_Approved'
            ? 'BRE 1 Approved'
            : guarantorStatus?.bre1Status === 'Bre1_Rejected'
              ? 'Loan Rejected'
              : 'Manual Underwriting',

      navigation:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.bre1Status === 'Bre1_Approved'
            ? ScreenNames.BREApproved
            : mainApplicantStatus?.bre1Status === 'Bre1_Rejected'
              ? ScreenNames.LoanRejected
              : ScreenNames.ManualUnderwriting
          : guarantorStatus?.bre1Status === 'Bre1_Approved'
            ? ScreenNames.BREApproved
            : guarantorStatus?.bre1Status === 'Bre1_Rejected'
              ? ScreenNames.LoanRejected
              : ScreenNames.ManualUnderwriting,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.breSuccess
          : guarantorStatus?.breSuccess,
    },
    {
      screenName: 'Product Details',
      navigation: ScreenNames.ProductDetails,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.productStatus
          : guarantorStatus?.productStatus,
    },
    {
      screenName: 'Delarship Details',
      navigation: ScreenNames.DelarshipDetails,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.dealaerShipDetailStatus
          : guarantorStatus?.dealaerShipDetailStatus,
    },
    {
      screenName: 'Loan Details',
      navigation: ScreenNames.LoanDetails,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.loanDetailsStatus
          : guarantorStatus?.loanDetailsStatus,
    },
    // {
    //   screenName: 'Deviation Documents',
    //   navigation: ScreenNames.DeviationDocuments,
    //   isActive: true
    //     // applicantType === 'mainApplicant'
    //     //   ? mainApplicantStatus?.postDisbursalDocument
    //     //   : guarantorStatus?.postDisbursalDocument,
    // },
    {
      screenName: 'Loan Offer',
      navigation: ScreenNames.LoanOffer,
      isActive: 
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.loanOfferStatus
          : guarantorStatus?.loanOfferStatus,
    },
    {
      screenName: 'References',
      navigation: ScreenNames.References,
      isActive: 
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.referenceStatus
          : guarantorStatus?.referenceStatus,
    },
    {
      screenName: 'Employment Details',
      navigation: ScreenNames.EmploymentDetails,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.empStatus
          : guarantorStatus?.empStatus,
    },
    {
      screenName: 'Sanction Letter',
      navigation: ScreenNames.SanctionLetter,
      isActive: 
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.sanctionLetterStatus
          : guarantorStatus?.sanctionLetterStatus,
    },
    {
      screenName: 'Bank Details',
      navigation: ScreenNames.BankDetails,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.bankDetailsStatus
          : guarantorStatus?.bankDetailsStatus,
    },
    {
      screenName: 'Repayment Details',
      navigation: ScreenNames.RepaymentDetails,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.repaymentStatus
          : guarantorStatus?.repaymentStatus,
    },
    {
      screenName: 'KFS (Key Fact Statement)',
      navigation: ScreenNames.KFS,
      isActive: 
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.kfsStatus
          : guarantorStatus?.kfsStatus,
    },
    {
      screenName: 'Loan Agreement',
      navigation: ScreenNames.LoanAgreement,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.isLoanAgreement
          : guarantorStatus?.isLoanAgreement,
    },
    {
      screenName: 'Pre Disbursal Documents',
      navigation: ScreenNames.PreDisbursalDocuments,
      isActive: 
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.preDisbursalDocument
          : guarantorStatus?.preDisbursalDocument,
    },
    {
      screenName: 'PSD',
      navigation: ScreenNames.PSDDocument,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.isPsd
          : guarantorStatus?.isPsd,
    },
    {
      screenName: 'Deferral Documents',
      navigation: ScreenNames.DeferralDocuments,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.isDeferral
          : guarantorStatus?.isDeferral,
    },
    {
      screenName: 'Post Disbursal Documents',
      navigation: ScreenNames.PostDisbursalDocument,
      isActive:
        applicantType === 'mainApplicant'
          ? mainApplicantStatus?.postDisbursalDocument
          : guarantorStatus?.postDisbursalDocument,
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      const getMasterLogin = async () => {
        const value = await AsyncStorage.getItem('ismasterLogin');
        console.log("mmmmmm&&&&&&&&&&&&&&&&mm", value);
        setMasterLogin(value);
      };

      getMasterLogin();
      const onBackPress = async () => {
        await AsyncStorage.getItem('ismasterLogin') == 'true' ?
          navigation.navigate('Dashboard')
          :
          navigation.navigate('LeadManagement')
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    if (memoizedCKYCStatusData) {
      SaveCKYCData(memoizedCKYCStatusData);
    }
  }, [memoizedCKYCStatusData]);

  useEffect(() => {
    GetCKYCStatus.reset();
    GetCKYCStatus.mutateAsync();
    SetMainApplicant(applicantType === 'mainApplicant');
  }, [applicantType]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true)
      ViewStatus.reset();
      GetCKYCStatus.reset();
      GetCKYCStatus.mutateAsync();
      ViewStatus.mutateAsync();
      GetSanctionLetterDetails.mutateAsync();

      // const timer = setTimeout(() => {
      //   setIsLoading(false);
      // }, 5000); // 2 minutes in milliseconds

      // return () => clearTimeout(timer);
    }, []),
  );

  useEffect(() => {
    if (memoizedViewStatusData) {
      console.log("memoizedViewStatusData", JSON.stringify(memoizedViewStatusData, null, 4));

      SaveViewStatus({
        isFreeze:
          (applicantType === 'guarantor'
            ? guarantorStatus?.isFreeze
            : mainApplicantStatus?.isFreeze),
        isSubmitToCreditFreeze: memoizedViewStatusData?.isSubmitToCreditFreeze,
        isSubmitToDisbursement: memoizedViewStatusData?.isSubmitToDisbursementFreeze,
        isDisbursementFreeze: memoizedViewStatusData?.isDisbursementFreeze,
        mainApplicant: memoizedViewStatusData?.mainApplicant,
        guarantor: memoizedViewStatusData?.guarantor,
        isSalesReject: memoizedViewStatusData?.isSalesReject,
        isSalesRejectButtonVisible: memoizedViewStatusData?.isSalesRejectButtonVisible,
        isReEdit: memoizedViewStatusData?.isReEdit,
        isReEditButtonVisible: memoizedViewStatusData?.isReEditButtonVisible,
        isReEditbankDetails: memoizedViewStatusData?.isReEditbankDetails,
        isReEditRepayment: memoizedViewStatusData?.isReEditRepayment

      });
      setIsLoading(false)
    }
  }, [memoizedViewStatusData, applicantType, guarantorStatus, mainApplicantStatus]);

  const filteredGuarantorSections = [
    ...qdeSections.slice(
      0,
      qdeSections.findIndex(section => section.screenName === 'Loan Offer') + 1,
    ),
  ];

  // console.log("rrrrrrrr", isLoading);

  return (
    <WaveBackground isMasterApp={JSON.parse(masterLogin)} loading={[
      ViewStatusIsLoading, GetCKYCStatusDataIsLoading, GetSanctionLetterDetailsIsLoading,
      isLoading]} title={'Loan Summary'}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.container]}>
          {applicantTypes.map((item: applicantTypeObect, index: number) => (
            <TouchableOpacity
              onPress={() => {
                setApplicantType(item.applicantType);
              }}
              key={index}
              style={[
                styles.cardContainer,
                [item.applicantType === applicantType && styles.selected],
              ]}
              disabled={item.applicantType === applicantType}>
              <Text style={styles.applicantText}>
                {item.applicantType === 'guarantor'
                  ? 'Guarantor'
                  : 'Main-Applicant'}
              </Text>
              <Text style={styles.appIdText}>{item?.applicantId}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {applicantType == 'guarantor' && guarantorStatus?.consentStatus == "consent_pending" &&
       <View style={[styles.leadContainer]}>
        <View style={styles.cardContainer}>
          <Text style={styles.activeCardHeaderStyle}>{"Lead Registration"}</Text>
          <Button
            text={'Continue'}
            active
            position
            marginTop={25}
            // marginVertical={30}
            halfSize
            onPress={() => {
              SetMainApplicant(false);
              SaveGuarantorId(guarantorId),
              navigation.navigate('LeadRegistration')
            }}
          />

        </View>
      </View>}


    { (applicantType == 'guarantor' && guarantorStatus?.consentStatus == "consent_pending") ? null : 
     <SummaryCardPL
        section={
          applicantType == 'guarantor' ?
            !guarantorStatus?.isGuarantorMandatory ?
              GetCKYCStatusData?.isPanAvailable ?
                filteredGuarantorSections.filter(el => el.screenName !== 'OVD Verification' && el.screenName !== 'Product Details')
                : filteredGuarantorSections.filter(el => el.screenName !== 'PAN Verification' && el.screenName !== 'Product Details')
              :
              GetCKYCStatusData?.isPanAvailable ?
                filteredGuarantorSections.filter(el => (memoizedViewStatusData?.productType == 'NIP' || memoizedViewStatusData?.productType == 'Asset') ? el.screenName !== 'OVD Verification' && el.screenName !== 'Loan Details' && el.screenName !== 'Delarship Details' : el.screenName !== 'OVD Verification')
                : filteredGuarantorSections.filter(el => (memoizedViewStatusData?.productType == 'NIP' || memoizedViewStatusData?.productType == 'Asset') ? el.screenName !== 'PAN Verification' && el.screenName !== 'Loan Details' && el.screenName !== 'Delarship Details' : el.screenName !== 'PAN Verification')

            // filteredGuarantorSections.filter(el => el.screenName !== 'PAN Verification')
            : GetCKYCStatusData?.isPanAvailable ?
              qdeSections.filter(el => el.screenName !== 'OVD Verification')
              : qdeSections.filter(el => el.screenName !== 'PAN Verification')
        }
        CKYCData={GetCKYCStatusData || null}
        title={'Quick Data Entry'}
        criffReportPath={
          (applicantType === 'guarantor'
            ? guarantorStatus?.criffReportPath
            : mainApplicantStatus?.criffReportPath) || ''
        }
        navigation={navigation}
        docNumber={
          (applicantType === 'guarantor'
            ? guarantorStatus?.documentNumber
            : mainApplicantStatus?.documentNumber) || ''
        }
        appId={applicantType === 'guarantor' ? guarantorId : applicantId || ''}
        applicantType={applicantType || ''}
        applicantName={
          (applicantType === 'guarantor'
            ? guarantorStatus?.applicantName
            : mainApplicantStatus?.applicantName) || ''
        }
        bureauScore={
          (applicantType === 'guarantor'
            ? guarantorStatus?.bureauScore
            : mainApplicantStatus?.bureauScore) || ''
        }
        isGuarantorMandatory={
          (applicantType === 'guarantor'
            ? guarantorStatus?.isGuarantorMandatory
            : mainApplicantStatus?.isGuarantorMandatory) || false
        }
        key={applicantType}
        continueDisable={
          (applicantType === 'guarantor' ?
            guarantorStatus?.productStatus :
            mainApplicantStatus?.postDisbursalDocument) || false
        }
        loanOffer={applicantType === 'mainApplicant' ? isNextEnable : true}
        creditNextEnable={memoizedViewStatusData?.isSubmitToCreditFreeze}
        empStatus={mainApplicantStatus?.empStatus}
        SactionNextEnable={
          memoizedViewStatusData?.isCreditApproved
        }
        isSubmitToDisbursementFreeze={
          memoizedViewStatusData?.isSubmitToDisbursementFreeze
        }
        isSalesReject={memoizedViewStatusData?.isSalesReject || false}
        isEditButtonVisible={applicantType === 'mainApplicant' ? (memoizedViewStatusData?.isReEditButtonVisible || false) : false}
        isReEdit={memoizedViewStatusData?.isReEdit || false}
        isRejectButtonVisible={applicantType === 'mainApplicant' ? (memoizedViewStatusData?.isSalesRejectButtonVisible || false) : false}
        loanPopup={(applicantType === 'guarantor'
          ? guarantorStatus?.loanPopup
          : mainApplicantStatus?.loanPopup) || false}
        rejectMessage={(applicantType === 'guarantor'
          ? guarantorStatus?.rejectMessage
          : mainApplicantStatus?.rejectMessage) || ''}
        isReAppeal={(applicantType === 'guarantor'
          ? guarantorStatus?.isReAppealButtonVisible
          : mainApplicantStatus?.isReAppealButtonVisible)}
        isDealershipDetailVisible={
          (applicantType === 'guarantor'
            ? guarantorStatus?.isDealershipDetailVisible
            : mainApplicantStatus?.isDealershipDetailVisible)
        }
      />}
    </WaveBackground>
  );
};
export default LoanSummary;