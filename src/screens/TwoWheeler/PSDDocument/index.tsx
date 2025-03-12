import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import LabeledTextInput from 'components/LabeledTextInput';
import useActive from 'hooks/useActive';
import * as Animatable from 'react-native-animatable';
import {
  PSDDocumentTypes,
  DeleteDeferralDocumentRequest,
  UploadDeferralDocumentRequest,
} from 'api/ReactQuery/TwoWheeler/Document/types';
import {
  useDeleteDeferralDocument,
  useUploadDeferralDocument,
} from 'api/ReactQuery/TwoWheeler/Document';
import {
  docTypes,
  SavePSDRequest,
  getInvoiceDetailsWithIPBranchRequest,
  SaveGoDigitRequest,
} from 'api/ReactQuery/TwoWheeler/PSDDocument/types';
import {
  useGetPSD,
  useSavePSD,
  useGetInsuranceCompanyMaster,
  useGetInvoiceDetailsWithIPBranch,
  useSaveGoDigit,
} from 'api/ReactQuery/TwoWheeler/PSDDocument';
import GoDigitInsurance from './GoDigitInsurance';
import WaveBackground from 'components/WaveBackground';
import Button from 'components/Button';
import {RootStackParamList} from 'navigation/HomeStack/TwoWheelerStack';
import LoanSummaryButton from 'components/LoanSummaryButton';
import {useApplicantDetails} from 'context/useApplicantDetails';
import Colors from 'config/Colors';
import Icon from 'components/Icon';
import {APP_FONTS, FONT_SIZE} from 'config/Fonts';
import useFontNormalise from 'hooks/useFontNormalise';
import {ErrorObject} from 'config/Types';
import {ConvertToPrefixedAmount} from 'config/Functions/ConvertToPrefix';
import LabeledRadioButtonGroup from 'components/RadioButtonGroup';
import moment from 'moment';
import LabelDropdown from 'components/LabelDropdown';
import LabeledDropdown from 'components/LabeledDropdown';
import convertImageFileToBase64 from 'config/Functions/ConvertImageToBase64';
import useSelectImage from 'hooks/useSelectImage';
import {ImagePickerResponse, launchCamera} from 'react-native-image-picker';
import DateTimePickerComponent from 'components/DateTimePickerComponent';
import {usedViewStatus} from 'context/useViewStatus';
import Modal from 'components/Modal';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import {GetRelationshipMasterRequest} from 'api/ReactQuery/TwoWheeler/Relationship/types';
import {useGetRelationshipMaster} from 'api/ReactQuery/TwoWheeler/Relationship';
import {
  useGenerateSanctionLetter,
  useGetSanctionLetter,
  useSendOTPSanctionLetter,
  useVerifyOTPSanctionLetter,
} from 'api/ReactQuery/TwoWheeler/SanctionLetter';
import {VerifyOTPSanctionLetterRequest} from 'api/ReactQuery/TwoWheeler/SanctionLetter/types';
import DownloadFile from 'config/Functions/DownloadFile';
import ModalComponent from 'components/ModalComponent';

interface PosDto {
  documentType: docTypes;
  isMandatory: 'Y' | 'N';
  section: string;
  documentFilePath?: string;
  type?: 'jpg' | 'pdf';
}
type PSDDocumentNavigationProp = StackNavigationProp<
  RootStackParamList,
  'PSDDocument'
>;

type PSDDocumentRouteProp = RouteProp<RootStackParamList, 'PSDDocument'>;

interface PSDDocumentScreenProps {
  navigation: PSDDocumentNavigationProp;
  route: PSDDocumentRouteProp;
}

const PSDDocument: FC<PSDDocumentScreenProps> = ({navigation, route}) => {
  const {applicantId, isMainApplicant, guarantorId} = useApplicantDetails();
  // var applicantId = 'MU582103'
  const {useViewStatus} = usedViewStatus();

  const [originalInvoice, setOriginalInvoice] = useState<string>('Yes');
  const [advEMIAmount, setAdvEMIAmount] = useState<number>(0);
  const [margin, setMargin] = useState<string>('0');
  const [consolidatedChareges, setConsolidatedChareges] = useState<string>('0');
  const [totalIP, setTotalIP] = useState<string>('0');
  const [IPPaidBranch, setIPPaidBranch] = useState<string>('');
  const [IPPaidAtDelar, setIPPaidAtDelar] = useState<string>('');
  const [IPPaidAtBranch, setIPPaidAtBranch] = useState<string>('');
  const [delar, setDelar] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [subDelar, setSubDelar] = useState<string>('');
  const [downPayment, setDownPayment] = useState<number>(0);
  const [ipUrl, setIpUrl] = useState<string>('');
  const [iPBase64, setIPBase64] = useState<string>('');
  const [goldReceiptUrl, setGoldReceiptUrl] = useState<string>('');
  const [goldReceiptBase64, setGoldReceiptBase64] = useState<string>('');
  const [goldWeight, setGoldWeight] = useState<string>('');
  const [isSmartPlusScheme, setIsSmartPlusScheme] = useState<boolean>(false);
  const [isConsent, setIsConsent] = useState<boolean>(false);

  const [ipUrlType, setIpUrlType] = useState<string>('');
  const [retailInvoiceUrlType, setRetailInvoiceUrlType] = useState<string>('');
  const [performaInvoiceUrlType, setPerformaInvoiceUrlType] =
    useState<string>('');
  const [insuranceUrlType, setInsuranceUrlType] = useState<string>('');
  const [goldReceiptUrlType, setGoldReceiptUrlType] = useState<string>('');

  const [retailInvoiceUrl, setRetailInvoiceUrl] = useState<string>('');
  const [retailInvoiceBase64, setRetailInvoiceBase64] = useState<string>('');
  const [retailInvoiceNumber, setRetailInvoiceNumber] = useState<string>('');

  const [nomineeName, setNomineeName] = useState<string>('');
  const [RelationshipWithApplicant, setRelationshipWithApplicant] =
    useState<string>('');
  const [nomineeGender, setNomineeGender] = useState<string>('');
  const [nomineeMaritalStatus, setNomineeMaritalStatus] = useState<string>('');
  const [nomineeMobileNumber, setNomineeMobileNumber] = useState<string>('');
  const [nomineeEmailId, setNomineeEmailId] = useState<string>('');
  const [nomineeDOBOpen, setNomineeDOBOpen] = useState<boolean>(false);
  const [nomineeDOB, setNomineeDOB] = useState<any>('');
  const [isNomineeMandatory, setIsNomineeMandatory] = useState<boolean>(false);
  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [InvoicedBy, setInvoicedBy] = useState<string>('');
  const [InvoicedByOpen, setInvoicedByOpen] = useState<boolean>(false);

  const [invoiceCalendarOpen, setInvoiceCalendarOpen] =
    useState<boolean>(false);
  const [PerformCalendarOpen, setPerformCalendarOpen] =
    useState<boolean>(false);
  const [insuranceFromCalendarOpen, setInsuranceFromCalendarOpen] =
    useState<boolean>(false);
  const [insuranceTocalendarOpen, setInsuranceToCalendarOpen] =
    useState<boolean>(false);

  const [invoiceDate, setInvoiceDate] = useState<any>('');
  const [exShoroomPrice, setExShoroomPrice] = useState<string>('');
  const [engineNumber, setEngineNumber] = useState<string>('');
  const [chassisNumber, setChassisNumber] = useState<string>('');
  const [performaInvoiceUrl, setPerformaInvoiceUrl] = useState<string>('');
  const [performaInvoiceBase64, setPerformaInvoiceBase64] =
    useState<string>('');
  const [performaDate, setPerformaDate] = useState<any>('');
  const [performaInvoiceNumber, setPerformaInvoiceNumber] =
    useState<string>('');
  const [exShowroomPriceAsPerPerforma, setExShowroomPriceAsPerPerforma] =
    useState<string>('');
  const [performaInvoicedBy, setPerformaInvoicedBy] = useState<string>('');

  const [isInvoiceBy, setIsInvoiceby] = useState<string>('');
  const [originalInsurance, setOriginalInsurance] = useState<string>('No');
  const [insuranceUrl, setInsuranceUrl] = useState<string>('');
  const [insuranceBase64, setInsuranceBase64] = useState<string>('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] =
    useState<string>('');
  const [insuranceCompany, setInsuranceCompany] = useState<string>('');
  const [insuranceCompanyOpen, setInsuranceCompanyOpen] =
    useState<boolean>(false);
  const [insuranceFromDate, setinsuranceFromDate] = useState<any>('');
  const [insuranceToDate, setinsuranceToDate] = useState<any>('');
  const [sumInsured, setSumInsured] = useState<string>('');
  const [insurenceCaping, setInsurenceCaping] = useState<string>('');
  const [premiumAmount, setPremiumAmount] = useState<string>('');
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);

  const [goDigitUnSignInsuranceUrl, setGoDigitUnSignInsuranceUrl] =
    useState<string>('');
  const [goDigitInsuranceUrl, setGoDigitInsuranceUrl] = useState<string>('');
  const [isResendOTPPressed, setIsResendOTPPressed] = useState<boolean>(false);
  const [TCPopup, setTCPopup] = useState<boolean>(false);
  const [goodHealthConsent, setGoodHealthConsent] = useState<string>('');
  const [goDigitOtpVerified, setGoDigitOtpVerified] = useState<boolean>(false);
  const [goDigitVisible, setGoDigitVisible] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isResendOTP, setIsResendOTP] = useState<boolean>(false);

  const [selectNull, setSelectedNull] = useState<'upload' | 'capture' | null>(
    null,
  );
  const [uploadingDocumentType, setUploadingDocumentType] =
    useState<PSDDocumentTypes | null>(null);
  const [base64value, setBase64Value] = useState<string>('');
  const [deletingDocumentType, setDeletingDocumentType] =
    useState<PSDDocumentTypes | null>(null);
  const [docType, setDocType] = useState<'pdf' | 'jpg' | null>(null);
  const [isError, setIsError] = useState<ErrorObject[]>([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [commonPopupVisible, setCommonPopUPVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const GetFamilyRelationshipMasterRequest: GetRelationshipMasterRequest = {
    relationType: 'family',
    isDelete: false,
  };

  const isOrignalInvoice = [
    isNomineeMandatory && nomineeName,
    isNomineeMandatory && RelationshipWithApplicant,
    isNomineeMandatory && nomineeGender,
    isNomineeMandatory && nomineeMaritalStatus,
    isNomineeMandatory && nomineeDOB,
    goDigitVisible && goodHealthConsent,
    goDigitVisible && goDigitInsuranceUrl,
    originalInvoice,
    originalInsurance,
    isInvoiceBy,
    delar,
    invoiceDate,
    exShoroomPrice,
    retailInvoiceNumber,
    engineNumber,
    chassisNumber,
    advEMIAmount,
    margin,
    consolidatedChareges,
    totalIP,
    IPPaidBranch,
    isSmartPlusScheme ? goldWeight : 'dfsd',
    isSmartPlusScheme ? goldReceiptUrl : 'dfsd',
    IPPaidBranch == 'IP Paid at Branch' ? IPPaidAtBranch : IPPaidAtDelar,
  ];

  let isActivePerforma = [
    isNomineeMandatory && nomineeName,
    isNomineeMandatory && RelationshipWithApplicant,
    isNomineeMandatory && nomineeGender,
    isNomineeMandatory && nomineeMaritalStatus,
    isNomineeMandatory && nomineeDOB,
    goDigitVisible && goodHealthConsent,
    goDigitVisible && goDigitInsuranceUrl,
    originalInvoice,
    delar,
    originalInsurance,
    isInvoiceBy,
    performaInvoiceNumber,
    performaDate,
    exShowroomPriceAsPerPerforma,
    advEMIAmount,
    margin,
    consolidatedChareges,
    totalIP,
    IPPaidBranch,
    IPPaidBranch == 'IP Paid at Branch' ? IPPaidAtBranch : IPPaidAtDelar,
    isSmartPlusScheme ? goldWeight : 'dfsd',
    isSmartPlusScheme ? goldReceiptUrl : 'dfsd',
  ];

  const isOrignalInvoiceWithInsurance = [
    isNomineeMandatory && nomineeName,
    isNomineeMandatory && RelationshipWithApplicant,
    isNomineeMandatory && nomineeGender,
    isNomineeMandatory && nomineeMaritalStatus,
    isNomineeMandatory && nomineeDOB,
    goDigitVisible && goodHealthConsent,
    goDigitVisible && goDigitInsuranceUrl,
    originalInvoice,
    delar,
    originalInsurance,
    isInvoiceBy,
    invoiceDate,
    exShoroomPrice,
    retailInvoiceNumber,
    engineNumber,
    chassisNumber,
    advEMIAmount,
    margin,
    consolidatedChareges,
    totalIP,
    IPPaidBranch,
    insuranceUrl,
    insurancePolicyNumber,
    insuranceCompany,
    insuranceFromDate,
    sumInsured,
    insuranceToDate,
    premiumAmount,
    isSmartPlusScheme ? goldWeight : 'dfsd',
    isSmartPlusScheme ? goldReceiptUrl : 'dfsd',
    IPPaidBranch == 'IP Paid at Branch' ? IPPaidAtBranch : IPPaidAtDelar,
  ];

  let isActivePerformaWithInsurance = [
    isNomineeMandatory && nomineeName,
    isNomineeMandatory && RelationshipWithApplicant,
    isNomineeMandatory && nomineeGender,
    isNomineeMandatory && nomineeMaritalStatus,
    isNomineeMandatory && nomineeDOB,
    goDigitVisible && goodHealthConsent,
    goDigitVisible && goDigitInsuranceUrl,
    originalInvoice,
    delar,
    originalInsurance,
    isInvoiceBy,
    performaInvoiceNumber,
    performaDate,
    exShowroomPriceAsPerPerforma,
    advEMIAmount,
    margin,
    consolidatedChareges,
    totalIP,
    IPPaidBranch,
    insuranceUrl,
    insurancePolicyNumber,
    insuranceCompany,
    insuranceFromDate,
    sumInsured,
    insuranceToDate,
    premiumAmount,
    isSmartPlusScheme ? goldWeight : 'dfsd',
    isSmartPlusScheme ? goldReceiptUrl : 'dfsd',
    IPPaidBranch == 'IP Paid at Branch' ? IPPaidAtBranch : IPPaidAtDelar,
  ];

  let isActiveGoDigit = [
    goodHealthConsent,
    nomineeName,
    RelationshipWithApplicant,
    nomineeGender,
    nomineeMaritalStatus,
    nomineeDOB,
  ];
  // console.log("goodHealthConsentgoodHealthConsent",goodHealthConsent);

  let hasErrorRegistered: boolean = isError.some(
    error => error.hasError === true,
  );

  let isActive: boolean = useActive(
    originalInvoice == 'Yes' && originalInsurance == 'Yes'
      ? isOrignalInvoiceWithInsurance
      : originalInvoice == 'No' && originalInsurance == 'Yes'
      ? isActivePerformaWithInsurance
      : originalInvoice == 'Yes'
      ? isOrignalInvoice
      : isActivePerforma,
  );

  let isGoDigitActive: boolean = useActive(isActiveGoDigit);

  const UploadDeferralDocumentRequest: UploadDeferralDocumentRequest = {
    appId: applicantId,
    base64: base64value,
    documentType: uploadingDocumentType,
    applicantType: 'mainApplicant',
    type: docType,
    uploadFrom: 'psd',
  };

  const VerifyOTPSanctionLetterRequest: VerifyOTPSanctionLetterRequest = {
    applicantId,
    otp: enteredOTP,
    employeeId: 'MCSL104091',
    otpmode: 'F',
  };

  const [
    SendOTPForSanctionLetter,
    {
      data: SendOTPForSanctionLetterData,
      isLoading: SendOTPForSanctionLetterIsLoading,
    },
  ] = useSendOTPSanctionLetter(applicantId, 'MCSL104091', 'F');

  const [
    VerifyOTPSanctionLetter,
    {
      data: VerifyOTPSanctionLetterData,
      isLoading: VerifyOTPSanctionLetterIsLoading,
    },
  ] = useVerifyOTPSanctionLetter(VerifyOTPSanctionLetterRequest);

  const [
    UploadDocuments,
    {data: UploadDocumentData, isLoading: UploadDocumentsIsLoading},
  ] = useUploadDeferralDocument(UploadDeferralDocumentRequest);

  const DeleteDocumentRequest: DeleteDeferralDocumentRequest = {
    appId: applicantId,
    documentType: deletingDocumentType,
    applicantType: 'mainApplicant',
  };

  const [
    DeleteDocument,
    {data: DeleteDocumentData, isLoading: DeleteDocumentIsLoading},
  ] = useDeleteDeferralDocument(DeleteDocumentRequest);

  const getInvoiceDetailsWithIPBranchRequest: getInvoiceDetailsWithIPBranchRequest =
    {
      appId: applicantId,
      ipBranch: IPPaidBranch,
    };

  const [
    GetInsuranceCompanyMasterDetails,
    {
      data: GetInsuranceCompanyData,
      isLoading: GetInsuranceCompanyMasterIsLoading,
    },
  ] = useGetInsuranceCompanyMaster();

  const InsuranceCompanyMasterList: string[] = GetInsuranceCompanyData
    ? GetInsuranceCompanyData?.InsuranceMasterList?.map(
        item => item.insuranceCompanyName,
      )
    : [];

  const [
    GetInvoiceDetailsWithIPBranch,
    {
      data: GetInvoiceDetailsWithIPBranchData,
      isLoading: GetInvoiceDetailsWithIPBranchIsLoading,
    },
  ] = useGetInvoiceDetailsWithIPBranch(getInvoiceDetailsWithIPBranchRequest);

  const [
    GetFamilyRelationshipMaster,
    {
      data: GetFamilyRelationshipMasterData,
      isLoading: GetFamilyRelationshipMasterIsLoading,
    },
  ] = useGetRelationshipMaster(GetFamilyRelationshipMasterRequest);

  const RelationshipFamilyOptions = GetFamilyRelationshipMasterData
    ? GetFamilyRelationshipMasterData.map(item => item.relationName)
    : [];

  useEffect(() => {
    if (VerifyOTPSanctionLetterData) {
      console.log('VerifyOTPSanctionLetterData', VerifyOTPSanctionLetterData);
      setTimer(0);
      setGoDigitOtpVerified(VerifyOTPSanctionLetterData?.otpStatus || false);
      SaveGoDigit.mutateAsync();
    }
  }, [VerifyOTPSanctionLetterData]);

  useEffect(() => {
    if (goDigitOtpVerified) {
      SaveGoDigit.mutateAsync();
    }
  }, [goDigitOtpVerified]);

  // useEffect(() => {

  //   if (IPPaidAtDelar && isChanged) {
  //     console.log("mjjjjjjj", Number(IPPaidAtDelar), Number(downPayment));
  //     if (IPPaidBranch == 'IP Paid at Dealer') {
  //       Number(IPPaidAtDelar) >= Number(downPayment) ? (
  //         setErrorMsg(
  //           `Please decrease the IP Paid amount as it exceeding the limit `),
  //         setCommonPopUPVisible(true)
  //         // setIPPaidAtDelar(downPayment?.toString())
  //       ) : null
  //     } else if (IPPaidBranch == 'IP Paid at Both') {
  //       var temp = Number(IPPaidAtBranch) + Number(IPPaidAtDelar)
  //       var temp1 = Number(downPayment) - Number(IPPaidAtBranch)
  //       Number(temp) >= Number(downPayment) ? (
  //         setErrorMsg(
  //           `Please decrease the IP Paid amount as it exceeding the downpayment limit `),
  //         setCommonPopUPVisible(true),
  //         setIPPaidAtDelar(temp1?.toString())
  //       ) : null
  //     }
  //   }
  // }, [IPPaidAtDelar]);

  useEffect(() => {
    if (useViewStatus) {
      setIsViewOnly(
        useViewStatus.isReEdit
          ? false
          : useViewStatus?.isSalesReject
          ? true
          : useViewStatus?.isSubmitToDisbursement
          ? true
          : false,
      );
    }
    GetFamilyRelationshipMaster.mutateAsync();
  }, []);

  useEffect(() => {
    if (UploadDocumentData) {
      // GetPSDDetail.mutateAsync();
      setBase64Value('');
      setUploadingDocumentType(null);
      // setDocType(null);
      // setDeletingDocumentType(null);
    }
  }, [UploadDocumentData]);

  useEffect(() => {
    if (DeleteDocumentData) {
      // GetPSDDetail.mutateAsync();
      setBase64Value('');
      setUploadingDocumentType(null);
      setDeletingDocumentType(null);

      deletingDocumentType == 'Insurance'
        ? setInsuranceUrl('')
        : deletingDocumentType == 'Invoice'
        ? setRetailInvoiceUrl('')
        : deletingDocumentType == 'IP'
        ? setIpUrl('')
        : deletingDocumentType == 'Gold Receipt'
        ? setGoldReceiptUrl('')
        : deletingDocumentType == 'Proforma Invoice'
        ? setPerformaInvoiceUrl('')
        : null;
    }
  }, [DeleteDocumentData]);

  useEffect(() => {
    console.log('after', uploadingDocumentType, base64value);

    if (uploadingDocumentType && base64value) {
      console.log('uploadingDocumentTypebase64value', uploadingDocumentType);

      UploadDocuments.mutateAsync();
    }
  }, [base64value, uploadingDocumentType]);

  useEffect(() => {
    if (deletingDocumentType) {
      DeleteDocument.mutateAsync();
    }
  }, [deletingDocumentType]);

  const handleLaunchCamera = type => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        saveToPhotos: true,
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          void 0;
        } else if (response.errorCode) {
          void 0;
        } else if (response.assets && response.assets.length > 0) {
          const capturedImageUri = response.assets[0].uri;

          if (capturedImageUri) {
            type == 'Invoice'
              ? (setRetailInvoiceUrl(capturedImageUri),
                setRetailInvoiceUrlType('jpg'))
              : type == 'Proforma Invoice'
              ? (setPerformaInvoiceUrl(capturedImageUri),
                setPerformaInvoiceUrlType('jpg'))
              : type == 'Insurance'
              ? (setInsuranceUrl(capturedImageUri), setInsuranceUrlType('jpg'))
              : type == 'IP'
              ? (setIpUrl(capturedImageUri), setIpUrlType('jpg'))
              : type == 'Gold Receipt'
              ? (setGoldReceiptUrl(capturedImageUri),
                setGoldReceiptUrlType('jpg'))
              : null;
            convertImageFileToBase64(capturedImageUri)
              .then(base64Data => {
                if (base64Data) {
                  type == 'Invoice'
                    ? setRetailInvoiceBase64(base64Data)
                    : type == 'Proforma Invoice'
                    ? setPerformaInvoiceBase64(base64Data)
                    : type == 'Insurance'
                    ? setInsuranceBase64(base64Data)
                    : type == 'IP'
                    ? setIpUrl(base64Data)
                    : type == 'Gold Receipt'
                    ? setGoldReceiptBase64(base64Data)
                    : null;
                  setDocType('jpg');
                  setBase64Value(base64Data);
                  setUploadingDocumentType(type);
                }
              })
              .catch(error => {
                console.error('Error converting image file to base64:', error);
              });
          }
        }
      },
    );
  };

  const handleOnPress = type => {
    const callback = (response: any, path: any, name: string) => {
      if (response) {
        type == 'Invoice'
          ? (setRetailInvoiceUrl(response[0]?.fileCopyUri),
            setRetailInvoiceUrlType(
              response[0].type?.split('/')?.pop() == 'pdf' ? 'pdf' : 'jpg',
            ))
          : type == 'Proforma Invoice'
          ? (setPerformaInvoiceUrl(response[0]?.fileCopyUri),
            setPerformaInvoiceUrlType(
              response[0].type?.split('/')?.pop() == 'pdf' ? 'pdf' : 'jpg',
            ))
          : type == 'Insurance'
          ? (setInsuranceUrl(response[0]?.fileCopyUri),
            setInsuranceUrlType(
              response[0].type?.split('/')?.pop() == 'pdf' ? 'pdf' : 'jpg',
            ))
          : type == 'IP'
          ? (setIpUrl(response[0]?.fileCopyUri),
            setIpUrlType(
              response[0].type?.split('/')?.pop() == 'pdf' ? 'pdf' : 'jpg',
            ))
          : type == 'Gold Receipt'
          ? (setGoldReceiptUrl(response[0]?.fileCopyUri),
            setGoldReceiptUrlType(
              response[0].type?.split('/')?.pop() == 'pdf' ? 'pdf' : 'jpg',
            ))
          : null;

        convertImageFileToBase64(response[0]?.fileCopyUri)
          .then(base64Data => {
            if (base64Data) {
              type == 'Invoice'
                ? setRetailInvoiceBase64(base64Data)
                : type == 'Proforma Invoice'
                ? setPerformaInvoiceBase64(base64Data)
                : type == 'Insurance'
                ? setInsuranceBase64(base64Data)
                : type == 'IP'
                ? setIPBase64(base64Data)
                : null;

              setDocType(
                response[0].type?.split('/')?.pop() == 'pdf' ? 'pdf' : 'jpg',
              );
              setBase64Value(base64Data);
              setUploadingDocumentType(type);
            }
          })
          .catch(error => {
            console.error('Error converting image file to base64:', error);
          });
      }
    };
    useSelectImage(callback, 'allDocument', setSelectedNull);
  };

  const handleInvoiceDate = (date: Date) => {
    console.log('handleInvoiceDate', date, moment(date).format('DD-MM-YYYY'));
    setInvoiceCalendarOpen(!invoiceCalendarOpen);
    setInvoiceDate(date);
    setIsChanged(true);
  };

  const handleNomineeDateOfBirth = (date: Date) => {
    setNomineeDOBOpen(!nomineeDOBOpen);
    setNomineeDOB(date);
    setIsChanged(true);
  };

  const handlePerformDate = (date: Date) => {
    setPerformCalendarOpen(!PerformCalendarOpen);
    setPerformaDate(date);
    setIsChanged(true);
  };
  const handleInsuranceFromDate = (date: Date) => {
    setInsuranceFromCalendarOpen(!insuranceFromCalendarOpen);
    setinsuranceFromDate(date);
    setIsChanged(true);
  };
  const handleInsuranceToDate = (date: Date) => {
    setInsuranceToCalendarOpen(!insuranceTocalendarOpen);
    setinsuranceToDate(date);
    setIsChanged(true);
  };

  const SavePSDRequest: SavePSDRequest = {
    appId: applicantId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    isOriginalInvoice: originalInvoice == 'Yes',
    isOriginalInsurance: originalInsurance == 'Yes',
    isInvoiceBy: isInvoiceBy,
    invoiceBy: originalInvoice == 'Yes' ? InvoicedBy : performaInvoicedBy,
    retailInvoiceDate: invoiceDate?.toString(),
    retailInvoiceNumber: retailInvoiceNumber,
    exShoroomPriceAsPerInvoice: parseFloat(exShoroomPrice),
    chasisNumber: chassisNumber,
    engineNumber: engineNumber,
    performaInvoiceDate: performaDate?.toString(),
    performaInvoiceNumber: performaInvoiceNumber,
    exShowroomPriceAsPerPerforma: parseFloat(exShowroomPriceAsPerPerforma) || 0,
    insurancePolicyNumber: insuranceUrl == '' ? '' : insurancePolicyNumber,
    insuranceCompany: insuranceUrl == '' ? '' : insuranceCompany,
    insuranceFromDate: insuranceUrl == '' ? '' : insuranceFromDate?.toString(),
    insuranceToDate: insuranceUrl == '' ? '' : insuranceToDate?.toString(),
    sumInsured:
      insuranceUrl == ''
        ? 0
        : parseFloat(sumInsured)
        ? parseFloat(sumInsured)
        : null,
    isInsurancePremiumAmount: insuranceUrl == '' ? '' : premiumAmount,
    advEmi: advEMIAmount,
    marginAmount: parseFloat(margin),
    consolidatedNumberOfCharges: parseFloat(consolidatedChareges),
    totalIp: totalIP,
    ipPaidAtBranch: IPPaidBranch == 'Yes' ? true : false,
    ipPaidAtDealer: IPPaidAtDelar,
    ipPaidAtBranchAmount: IPPaidAtBranch,
    ipPaidAtDealerAndBranch: IPPaidBranch,
    goldWeight: goldWeight,
    name: nomineeName,
    applicantRelationship: RelationshipWithApplicant,
    martialStatus: nomineeMaritalStatus,
    dob: nomineeDOB,
    emailId: nomineeEmailId,
    mobileNumber: nomineeMobileNumber,
    gender: nomineeGender,
  };

  const [
    GetPSDDetail,
    {data: GetPSDDetailData, isLoading: GetPSDDetailIsLoading},
  ] = useGetPSD(applicantId);

  useEffect(() => {
    if (GetPSDDetailData) {
      console.log('mjjjjjjjj', JSON.stringify(GetPSDDetailData, null, 4));
      setAdvEMIAmount(GetPSDDetailData?.advEmi || 0);
      setDownPayment(GetPSDDetailData?.downPayment);
      setMargin(GetPSDDetailData?.marginAmount?.toString() || '');
      setConsolidatedChareges(
        GetPSDDetailData?.consolidatedNumberOfCharges?.toString() || '',
      );
      setTotalIP(GetPSDDetailData?.totalIp || '');
      setIPPaidBranch(GetPSDDetailData?.ipPaidAtDealerAndBranch);
      setIPPaidAtDelar(GetPSDDetailData?.ipPaidAtDealer || ''),
        setIPPaidAtBranch(
          GetPSDDetailData?.ipPaidAtBranchAmount || ''?.toString(),
        );
      setOriginalInvoice(
        GetPSDDetailData?.isOriginalInvoice
          ? 'Yes'
          : GetPSDDetailData?.isOriginalInvoice == null
          ? originalInvoice
          : 'No',
      );
      setOriginalInsurance(
        GetPSDDetailData?.insuranceFilePath
          ? 'Yes'
          : GetPSDDetailData?.isOriginalInsurance
          ? 'Yes'
          : GetPSDDetailData?.isOriginalInsurance == null
          ? originalInsurance
          : 'No',
      );
      setIsInvoiceby(GetPSDDetailData?.isInvoiceBy || '');
      setInvoicedBy(
        GetPSDDetailData?.isOriginalInvoice ||
          GetPSDDetailData?.isOriginalInvoice == null
          ? GetPSDDetailData?.invoiceBy
          : '',
      );
      setPerformaInvoicedBy(
        GetPSDDetailData?.isOriginalInvoice ||
          GetPSDDetailData?.isOriginalInvoice == null
          ? ''
          : GetPSDDetailData?.invoiceBy,
      );
      setRetailInvoiceNumber(GetPSDDetailData?.retailInvoiceNumber || '');
      setInvoiceDate(
        GetPSDDetailData?.retailInvoiceDate
          ? new Date(GetPSDDetailData?.retailInvoiceDate)
          : '',
      );
      setExShoroomPrice(
        GetPSDDetailData?.exShoroomPriceAsPerInvoice?.toString() || '',
      );
      setEngineNumber(GetPSDDetailData?.engineNumber || '');
      setChassisNumber(GetPSDDetailData?.chasisNumber || '');
      setPerformaDate(
        GetPSDDetailData?.performaInvoiceDate
          ? new Date(GetPSDDetailData?.performaInvoiceDate)
          : '',
      );
      setPerformaInvoiceNumber(GetPSDDetailData?.performaInvoiceNumber || '');
      setExShowroomPriceAsPerPerforma(
        GetPSDDetailData?.exShowroomPriceAsPerPerforma?.toString() || '',
      );
      setInsurancePolicyNumber(GetPSDDetailData?.insurancePolicyNumber || '');
      setinsuranceFromDate(
        GetPSDDetailData?.insuranceFromDate
          ? new Date(GetPSDDetailData?.insuranceFromDate)
          : '',
      );
      setinsuranceToDate(
        GetPSDDetailData?.insuranceToDate
          ? new Date(GetPSDDetailData?.insuranceToDate)
          : '',
      );
      setInsuranceCompany(GetPSDDetailData?.insuranceCompany?.toString() || '');
      setSumInsured(GetPSDDetailData?.sumInsured || '');
      setPremiumAmount(
        GetPSDDetailData?.isInsurancePremiumAmount?.toString() || '',
      );
      setDelar(GetPSDDetailData?.dealerName || '');
      setSubDelar(GetPSDDetailData?.subDealerName || '');
      setVehicleModel(GetPSDDetailData?.vehicleModel || '');
      setNomineeName(GetPSDDetailData?.name || '');
      setRelationshipWithApplicant(
        GetPSDDetailData?.applicantRelationship || '',
      );
      setNomineeGender(GetPSDDetailData?.gender || '');
      setNomineeMaritalStatus(GetPSDDetailData?.martialStatus || '');
      //setNomineeDOB(GetPSDDetailData?.dob || '')
      setNomineeDOB(
        GetPSDDetailData?.dob ? new Date(GetPSDDetailData?.dob) : '',
      );
      setNomineeEmailId(GetPSDDetailData?.emailId || '');
      setNomineeMobileNumber(GetPSDDetailData?.mobileNumber || '');
      setIsNomineeMandatory(GetPSDDetailData?.isNomineeMandatory);
      setInsurenceCaping(GetPSDDetailData?.insuranceAmount?.toString());
      setGoldWeight(GetPSDDetailData?.goldWeight?.toString() || '');
      setIsSmartPlusScheme(GetPSDDetailData?.isSmartPlus);
      setIpUrl(
        GetPSDDetailData?.ipfilePth == null ? '' : GetPSDDetailData?.ipfilePth,
      );
      setRetailInvoiceUrl(
        GetPSDDetailData?.retailInvoiceFilePth == null
          ? ''
          : GetPSDDetailData?.retailInvoiceFilePth || '',
      );
      setGoldReceiptUrl(
        GetPSDDetailData?.goldReceiptUrl == null
          ? ''
          : GetPSDDetailData?.goldReceiptUrl || '',
      );
      setPerformaInvoiceUrl(
        GetPSDDetailData?.proformaInvoiceFilePth == null
          ? ''
          : GetPSDDetailData?.proformaInvoiceFilePth || '',
      );
      setInsuranceUrl(
        GetPSDDetailData?.insuranceFilePath == null
          ? ''
          : GetPSDDetailData?.insuranceFilePath || '',
      );
      setIsChanged(false);
      setIpUrlType(GetPSDDetailData?.ipfilePthType);
      setRetailInvoiceUrlType(GetPSDDetailData?.retailInvoiceFilePthType);
      setPerformaInvoiceUrlType(GetPSDDetailData?.proformaInvoiceFilePthType);
      setInsuranceUrlType(GetPSDDetailData?.insuranceFilePathType);
      setGoldReceiptUrlType(GetPSDDetailData?.goldReceiptUrlType);
      setGoDigitUnSignInsuranceUrl(GetPSDDetailData?.unsignedFilePath || '');
      setGoDigitInsuranceUrl(GetPSDDetailData?.signedFilePath || '');
      setGoodHealthConsent(GetPSDDetailData?.goodHealthConsent || '');
      setIsConsent(GetPSDDetailData?.signedFilePath ? true : false);
      setGoDigitVisible(GetPSDDetailData?.isGoDigitVisible);
    }
  }, [GetPSDDetailData]);

  useEffect(() => {
    if (originalInvoice == 'Yes' && GetPSDDetailData) {
      setInvoicedBy(
        GetPSDDetailData?.isOriginalInvoice ||
          GetPSDDetailData?.isOriginalInvoice == null
          ? GetPSDDetailData?.invoiceBy
          : '',
      );
      setRetailInvoiceNumber(GetPSDDetailData?.retailInvoiceNumber || '');
      setInvoiceDate(
        GetPSDDetailData?.retailInvoiceDate
          ? new Date(GetPSDDetailData?.retailInvoiceDate)
          : '',
      );
      setExShoroomPrice(
        GetPSDDetailData?.exShoroomPriceAsPerInvoice?.toString() || '',
      );
      setEngineNumber(GetPSDDetailData?.engineNumber || '');
      setChassisNumber(GetPSDDetailData?.chasisNumber || '');
      setRetailInvoiceUrl(
        GetPSDDetailData?.retailInvoiceFilePth == null
          ? ''
          : GetPSDDetailData?.retailInvoiceFilePth || '',
      );
      setPerformaDate('');
      setPerformaInvoicedBy('');
      setPerformaInvoiceNumber('');
      setExShowroomPriceAsPerPerforma('');
      setPerformaInvoiceUrl('');
      setIsChanged(false);
    } else {
      setPerformaInvoicedBy(
        GetPSDDetailData?.isOriginalInvoice ||
          GetPSDDetailData?.isOriginalInvoice == null
          ? ''
          : GetPSDDetailData?.invoiceBy,
      );
      setPerformaInvoiceUrl(
        GetPSDDetailData?.proformaInvoiceFilePth == null
          ? ''
          : GetPSDDetailData?.proformaInvoiceFilePth || '',
      );
      setPerformaDate(
        GetPSDDetailData?.performaInvoiceDate
          ? new Date(GetPSDDetailData?.performaInvoiceDate)
          : '',
      );
      setPerformaInvoiceNumber(GetPSDDetailData?.performaInvoiceNumber || '');
      setExShowroomPriceAsPerPerforma(
        GetPSDDetailData?.exShowroomPriceAsPerPerforma?.toString() || '',
      );
      setRetailInvoiceUrl('');
      setInvoicedBy('');
      setRetailInvoiceNumber('');
      setInvoiceDate('');
      setExShoroomPrice('');
      setEngineNumber('');
      setChassisNumber('');
      setIsChanged(false);
      // setNomineeName('')
      // setRelationshipWithApplicant('')
      // setNomineeGender('')
      // setNomineeMaritalStatus('')
      // setNomineeDOB('')
      // setNomineeEmailId('')
      // setNomineeMobileNumber('')
    }
  }, [originalInvoice]);

  useEffect(() => {
    if (insuranceUrl == '' && isChanged) {
      setInsurancePolicyNumber('');
      setinsuranceFromDate('');
      setinsuranceToDate('');
      setInsuranceCompany('');
      setSumInsured('');
      setPremiumAmount('');
      // setNomineeName('')
      // setRelationshipWithApplicant('')
      // setNomineeGender('')
      // setNomineeMaritalStatus('')
      // setNomineeDOB('')
      // setNomineeEmailId('')
      // setNomineeMobileNumber('')
    }
  }, [insuranceUrl]);

  const EnterOTPSanctionLetterContainer = useRef<
    View & {fadeIn: Function; fadeOut: Function}
  >(null);

  let SaveGoDigitRequest: SaveGoDigitRequest = {
    appId: applicantId,
    goDigitOtpVerified: goDigitOtpVerified,
    goodHealthConsent: goodHealthConsent,
    nomineeName: nomineeName,
    nomineeDob: nomineeDOB,
  };

  const [SavePSDInfo, {data: SavePSDData, isLoading: SavePSDInfoIsLoading}] =
    useSavePSD(SavePSDRequest);

  const [
    SaveGoDigit,
    {data: SaveGoDigitData, isLoading: SaveGoDigitInfoIsLoading},
  ] = useSaveGoDigit(SaveGoDigitRequest);

  useEffect(() => {
    if (SavePSDData) {
      setIsChanged(false);
      navigation.navigate('DeferralDocuments');
    }
  }, [SavePSDData]);

  useEffect(() => {
    if (SaveGoDigitData) {
      setGoDigitUnSignInsuranceUrl(SaveGoDigitData.unsignedFilePath || '');
      setGoDigitInsuranceUrl(SaveGoDigitData.signedFilePath || '');
    }
  }, [SaveGoDigitData]);

  useEffect(() => {
    if (GetInvoiceDetailsWithIPBranchData) {
      setIPPaidAtBranch(
        GetInvoiceDetailsWithIPBranchData?.ipPaidAtBranchAmount?.toString(),
      );
    }
  }, [GetInvoiceDetailsWithIPBranchData]);

  useEffect(() => {
    if (
      IPPaidBranch == 'IP Paid at Branch' ||
      (IPPaidBranch == 'IP Paid at Both' && isChanged)
    ) {
      setIPPaidAtDelar('');
      GetInvoiceDetailsWithIPBranch.mutateAsync();
    }
    // else {
    //   isChanged ? setIPPaidAtDelar('') : null
    // }
  }, [IPPaidBranch]);

  const minDate = insuranceFromDate ? new Date(insuranceFromDate) : new Date();
  minDate.setDate(minDate.getDate() + 365);

  useEffect(() => {
    if (insuranceFromDate && isChanged) {
      setinsuranceToDate('');
    }
  }, [insuranceFromDate]);

  useEffect(() => {
    if (timer > 0) {
      const timeoutId = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => {
        // setIsResendOTPPressed(false), setIsResendOTP(false),
        clearTimeout(timeoutId);
      };
    } else {
      setIsResendOTP(isResendOTPPressed ? true : false);
    }
  }, [timer]);

  useFocusEffect(
    useCallback(() => {
      if (applicantId) {
        GetPSDDetail.mutateAsync();
        GetInsuranceCompanyMasterDetails.mutateAsync();
        setIsChanged(false);
      }
    }, []),
  );

  return (
    <WaveBackground
      loading={[
        UploadDocumentsIsLoading,
        GetPSDDetailIsLoading,
        SavePSDInfoIsLoading,
        DeleteDocumentIsLoading,
        GetInsuranceCompanyMasterIsLoading,
        UploadDocumentsIsLoading,
        GetInvoiceDetailsWithIPBranchIsLoading,
        GetFamilyRelationshipMasterIsLoading,
        SaveGoDigitInfoIsLoading,
        SendOTPForSanctionLetterIsLoading,
      ]}
      title={'PSD'}>
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
      <ModalComponent
        onClose={() => {
          setTCPopup(false);
        }}
        visible={TCPopup}
        status={'normal'}
        buttonTitle="I agree"
        tc
      />

      <DateTimePickerComponent
        selectedDate={invoiceDate}
        onDateChange={handleInvoiceDate}
        showPicker={invoiceCalendarOpen}
      />

      <DateTimePickerComponent
        selectedDate={nomineeDOB}
        onDateChange={handleNomineeDateOfBirth}
        showPicker={nomineeDOBOpen}
        maximumDate={new Date()}
        minimumDate={new Date(1800, 0, 1)}
      />

      <DateTimePickerComponent
        selectedDate={performaDate}
        onDateChange={handlePerformDate}
        showPicker={PerformCalendarOpen}
      />

      <DateTimePickerComponent
        selectedDate={insuranceFromDate}
        onDateChange={handleInsuranceFromDate}
        showPicker={insuranceFromCalendarOpen}
        maximumDate={new Date()}
      />

      <DateTimePickerComponent
        selectedDate={insuranceToDate}
        onDateChange={handleInsuranceToDate}
        showPicker={insuranceTocalendarOpen}
        minimumDate={new Date(minDate)}
        // minimumDate={new Date(minDate)}
      />

      <LabeledRadioButtonGroup
        heading="Do you have Original Invoice details?"
        options={['Yes', 'No']}
        onChange={setOriginalInvoice}
        value={originalInvoice}
        isChange={setIsChanged}
        inLine
        // disabled={isViewOnly}

        disabled={
          isViewOnly
            ? isViewOnly
            : originalInvoice == 'Yes'
            ? retailInvoiceUrl !== ''
            : originalInvoice == 'No'
            ? performaInvoiceUrl !== ''
            : false
        }
      />

      <View style={{marginVertical: '5%'}} />

      {originalInvoice == 'Yes' ? (
        <>
          <Text style={style.heading}>
            Original Invoice details <Icon name="pointed-star" />
          </Text>

          <View style={style.container}>
            {retailInvoiceUrl == '' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.Upload,
                    paddingVertical: 10,
                    paddingHorizontal: 50,
                    borderRadius: 10,
                  }}
                  disabled={isViewOnly}
                  onPress={() => {
                    handleOnPress('Invoice');
                  }}>
                  <Icon name="upload" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.Capture,
                    paddingVertical: 10,
                    paddingHorizontal: 50,
                    borderRadius: 10,
                  }}
                  disabled={isViewOnly}
                  onPress={() => {
                    handleLaunchCamera('Invoice');
                  }}>
                  <Icon name="capture" />
                </TouchableOpacity>
              </View>
            )}
            {retailInvoiceUrl !== '' &&
              (retailInvoiceUrlType == 'pdf' ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors.LightGrey,
                      paddingHorizontal: 25,
                      paddingVertical: '5%',
                      height: useFontNormalise(120),
                      justifyContent: 'center',
                      borderRadius: 10,
                      width: useFontNormalise(120),
                      margin: 15,
                      alignItems: 'center',
                    }}>
                    {
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: -9,
                          right: -5,
                          backgroundColor: 'transparent',
                          alignSelf: 'flex-end',
                        }}
                        disabled={isViewOnly}
                        onPress={() => {
                          setDeletingDocumentType('Invoice');
                        }}>
                        <Icon name="close" />
                      </TouchableOpacity>
                    }
                    <Icon name="prePdf" />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    width: '110%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Image
                    source={{uri: retailInvoiceUrl}}
                    style={{
                      width: 250,
                      height: 180,
                      borderRadius: 10,
                      alignSelf: 'center',
                    }}
                  />
                  <TouchableOpacity
                    style={style.deleteButton}
                    disabled={isViewOnly}
                    onPress={() => {
                      setDeletingDocumentType('Invoice');
                    }}>
                    <Icon name="close" />
                  </TouchableOpacity>
                  {/* )} */}
                </View>
              ))}
          </View>

          {/* <View style={[style.FinalLabel, { paddingHorizontal: 20 }]}>
            <Text style={[style.Label, { color: 'black' }]}>{`Invoiced By `}<Icon name="pointed-star" /></Text>
          </View> */}
          <View style={[style.FinalLabel, {paddingHorizontal: 20}]}>
            <View style={{width: '40%'}}>
              <Text style={style.Label}>{`Dealer : `}</Text>
            </View>
            <View style={{width: '60%'}}>
              <Text style={[style.StaticLabel, {flexWrap: 'wrap'}]}>
                {delar}
              </Text>
            </View>
          </View>
          <View style={[style.FinalLabel, {paddingHorizontal: 20}]}>
            <View style={{width: '40%'}}>
              <Text style={style.Label}>{`Sub Dealer : `}</Text>
            </View>
            <View style={{width: '60%'}}>
              <Text style={[style.StaticLabel, {flexWrap: 'wrap'}]}>
                {subDelar}
              </Text>
            </View>
          </View>
          <View style={[style.FinalLabel, {paddingHorizontal: 20}]}>
            <View style={{width: '40%'}}>
              <Text style={style.Label}>{`Vehicle Model : `}</Text>
            </View>
            <View style={{width: '60%'}}>
              <Text style={[style.StaticLabel, {flexWrap: 'wrap'}]}>
                {vehicleModel}
              </Text>
            </View>
          </View>

          <LabeledDropdown
            label="Invoiced By"
            defaultValue={isInvoiceBy}
            options={subDelar != '' ? ['Dealer', 'Sub-Dealer'] : ['Dealer']}
            setSelectedOption={setIsInvoiceby}
            setSelectedItem={item => {}}
            bottom
            isChange={setIsChanged}
            mandatory
            disabled={isViewOnly}
          />

          <LabeledTextInput
            label="Retail Invoice Number"
            onChange={setRetailInvoiceNumber}
            defaultValue={retailInvoiceNumber}
            setErrorFlag={setIsError}
            IsErrorArray={isError}
            autoCapitalize="characters"
            isChange={setIsChanged}
            mandatory
            disabled={isViewOnly}
          />
          <View style={style.dobContainer}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  style.labelText,
                  {
                    color: invoiceCalendarOpen
                      ? Colors.Black
                      : Colors.LabelGrey,
                  },
                ]}>
                {'Retail Invoice Date'}
              </Text>
              <Icon name="pointed-star" />
            </View>
            <TouchableOpacity
              style={[
                style.inputbox,
                {
                  borderColor: invoiceCalendarOpen
                    ? Colors.Black
                    : Colors.LightGrey,
                },
              ]}
              disabled={isViewOnly}
              onPress={() => {
                setInvoiceCalendarOpen(!invoiceCalendarOpen);
              }}>
              <Text
                style={{color: invoiceDate ? Colors.Black : Colors.LabelGrey}}>
                {invoiceDate
                  ? moment(invoiceDate).format('DD-MM-YYYY').toString()
                  : null}
              </Text>
            </TouchableOpacity>
          </View>

          <LabeledTextInput
            label="Ex-Showroom Price as Per Invoice"
            onChange={setExShoroomPrice}
            autoCapitalize="characters"
            defaultValue={exShoroomPrice}
            disabled={isViewOnly}
            setErrorFlag={setIsError}
            IsErrorArray={isError}
            isChange={setIsChanged}
            mandatory
            NumberPad
          />

          <LabeledTextInput
            label="Engine Number"
            onChange={setEngineNumber}
            defaultValue={engineNumber}
            setErrorFlag={setIsError}
            IsErrorArray={isError}
            autoCapitalize="characters"
            isChange={setIsChanged}
            mandatory
            disabled={isViewOnly}
          />

          <LabeledTextInput
            label="Chassis Number"
            onChange={setChassisNumber}
            defaultValue={chassisNumber}
            setErrorFlag={setIsError}
            IsErrorArray={isError}
            autoCapitalize="characters"
            isChange={setIsChanged}
            mandatory
            disabled={isViewOnly}
          />
        </>
      ) : (
        <>
          <Text style={style.heading}>
            Performa Invoice details <Icon name="pointed-star" />
          </Text>

          <View style={style.container}>
            {performaInvoiceUrl == '' && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: 10,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.Upload,
                    paddingVertical: 10,
                    paddingHorizontal: 50,
                    borderRadius: 10,
                  }}
                  disabled={isViewOnly}
                  onPress={() => {
                    handleOnPress('Proforma Invoice');
                  }}>
                  <Icon name="upload" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: Colors.Capture,
                    paddingVertical: 10,
                    paddingHorizontal: 50,
                    borderRadius: 10,
                  }}
                  disabled={isViewOnly}
                  onPress={() => {
                    handleLaunchCamera('Proforma Invoice');
                  }}>
                  <Icon name="capture" />
                </TouchableOpacity>
              </View>
            )}

            {performaInvoiceUrl !== '' &&
              (performaInvoiceUrlType == 'pdf' ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <View
                    style={{
                      backgroundColor: Colors.LightGrey,
                      paddingHorizontal: 25,
                      paddingVertical: '5%',
                      height: useFontNormalise(120),
                      justifyContent: 'center',
                      borderRadius: 10,
                      width: useFontNormalise(120),
                      margin: 15,
                      alignItems: 'center',
                    }}>
                    {
                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: -9,
                          right: -5,
                          backgroundColor: 'transparent',
                          alignSelf: 'flex-end',
                        }}
                        disabled={isViewOnly}
                        onPress={() => {
                          setDeletingDocumentType('Proforma Invoice');
                        }}>
                        <Icon name="close" />
                      </TouchableOpacity>
                    }
                    <Icon name="prePdf" />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    width: '110%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <Image
                    source={{uri: performaInvoiceUrl}}
                    style={{
                      width: 250,
                      height: 180,
                      borderRadius: 10,
                      alignSelf: 'center',
                    }}
                  />

                  <TouchableOpacity
                    style={style.deleteButton}
                    disabled={isViewOnly}
                    onPress={() => {
                      setDeletingDocumentType('Proforma Invoice');
                    }}>
                    <Icon name="close" />
                  </TouchableOpacity>
                  {/* )} */}
                </View>
              ))}
          </View>

          {/* <View style={[style.FinalLabel, { paddingHorizontal: 20 }]}>
            <Text style={[style.Label, { color: 'black' }]}>{`Invoiced By `}<Icon name="pointed-star" /></Text>
          </View> */}
          <View style={[style.FinalLabel, {paddingHorizontal: 20}]}>
            <View style={{width: '40%'}}>
              <Text style={style.Label}>{`Dealer : `}</Text>
            </View>
            <View style={{width: '60%'}}>
              <Text style={[style.StaticLabel, {flexWrap: 'wrap'}]}>
                {delar}
              </Text>
            </View>
          </View>
          <View style={[style.FinalLabel, {paddingHorizontal: 20}]}>
            <View style={{width: '40%'}}>
              <Text style={style.Label}>{`Sub Dealer : `}</Text>
            </View>
            <View style={{width: '60%'}}>
              <Text style={[style.StaticLabel, {flexWrap: 'wrap'}]}>
                {subDelar}
              </Text>
            </View>
          </View>
          <View style={[style.FinalLabel, {paddingHorizontal: 20}]}>
            <View style={{width: '40%'}}>
              <Text style={style.Label}>{`Vehicle Model : `}</Text>
            </View>
            <View style={{width: '60%'}}>
              <Text style={[style.StaticLabel, {flexWrap: 'wrap'}]}>
                {vehicleModel}
              </Text>
            </View>
          </View>

          <LabeledDropdown
            label="Invoiced By"
            defaultValue={isInvoiceBy}
            options={subDelar != '' ? ['Dealer', 'Sub-Dealer'] : ['Dealer']}
            setSelectedOption={setIsInvoiceby}
            setSelectedItem={item => {}}
            bottom
            isChange={setIsChanged}
            mandatory
            disabled={isViewOnly}
          />

          <LabeledTextInput
            label="Performa Invoice Number"
            onChange={setPerformaInvoiceNumber}
            defaultValue={performaInvoiceNumber}
            setErrorFlag={setIsError}
            IsErrorArray={isError}
            autoCapitalize="characters"
            isChange={setIsChanged}
            mandatory
            disabled={isViewOnly}
          />

          <View style={style.dobContainer}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  style.labelText,
                  {
                    color: PerformCalendarOpen
                      ? Colors.Black
                      : Colors.LabelGrey,
                  },
                ]}>
                {'Performa Invoice Date'}
              </Text>
              <Icon name="pointed-star" />
            </View>
            <TouchableOpacity
              style={[
                style.inputbox,
                {
                  borderColor: PerformCalendarOpen
                    ? Colors.Black
                    : Colors.LightGrey,
                },
              ]}
              disabled={isViewOnly}
              onPress={() => {
                setPerformCalendarOpen(!PerformCalendarOpen);
              }}>
              <Text
                style={{color: performaDate ? Colors.Black : Colors.LabelGrey}}>
                {performaDate
                  ? moment(performaDate).format('DD-MM-YYYY').toString()
                  : null}
              </Text>
            </TouchableOpacity>
          </View>

          <LabeledTextInput
            label="Ex-Showroom Price as Per Invoice"
            onChange={setExShowroomPriceAsPerPerforma}
            autoCapitalize="characters"
            defaultValue={exShowroomPriceAsPerPerforma}
            setErrorFlag={setIsError}
            IsErrorArray={isError}
            isChange={setIsChanged}
            mandatory
            NumberPad
            disabled={isViewOnly}
          />
        </>
      )}
      <View style={{marginVertical: '5%'}} />

      <>
        <Text style={style.heading}>Insurance details</Text>
        <LabeledRadioButtonGroup
          heading="Do you have Original Insurance details?"
          options={['Yes', 'No']}
          onChange={setOriginalInsurance}
          value={originalInsurance}
          isChange={setIsChanged}
          inLine
          // disabled={isViewOnly}
          disabled={
            isViewOnly
              ? isViewOnly
              : originalInsurance == 'Yes'
              ? insuranceUrl !== ''
              : false
          }
        />
        <View style={style.container}>
          {originalInsurance == 'Yes' && insuranceUrl == '' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 10,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.Upload,
                  paddingVertical: 10,
                  paddingHorizontal: 50,
                  borderRadius: 10,
                }}
                disabled={isViewOnly}
                onPress={() => {
                  handleOnPress('Insurance');
                }}>
                <Icon name="upload" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.Capture,
                  paddingVertical: 10,
                  paddingHorizontal: 50,
                  borderRadius: 10,
                }}
                disabled={isViewOnly}
                onPress={() => {
                  handleLaunchCamera('Insurance');
                }}>
                <Icon name="capture" />
              </TouchableOpacity>
            </View>
          )}

          {insuranceUrl !== '' &&
            (insuranceUrlType == 'pdf' ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                <View
                  style={{
                    backgroundColor: Colors.LightGrey,
                    paddingHorizontal: 25,
                    paddingVertical: '5%',
                    height: useFontNormalise(120),
                    justifyContent: 'center',
                    borderRadius: 10,
                    width: useFontNormalise(120),
                    margin: 15,
                    alignItems: 'center',
                  }}>
                  {
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: -9,
                        right: -5,
                        backgroundColor: 'transparent',
                        alignSelf: 'flex-end',
                      }}
                      disabled={isViewOnly}
                      onPress={() => {
                        setDeletingDocumentType('Insurance');
                      }}>
                      <Icon name="close" />
                    </TouchableOpacity>
                  }
                  <Icon name="prePdf" />
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: '110%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Image
                  source={{uri: insuranceUrl}}
                  style={{
                    width: 250,
                    height: 180,
                    borderRadius: 10,
                    alignSelf: 'center',
                  }}
                />

                <TouchableOpacity
                  style={style.deleteButton}
                  disabled={isViewOnly}
                  onPress={() => {
                    setDeletingDocumentType('Insurance');
                  }}>
                  <Icon name="close" />
                </TouchableOpacity>
              </View>
            ))}
        </View>

        {insuranceUrl !== '' && (
          <>
            <LabeledTextInput
              label="Insurance Policy Number"
              onChange={setInsurancePolicyNumber}
              defaultValue={insurancePolicyNumber}
              setErrorFlag={setIsError}
              IsErrorArray={isError}
              autoCapitalize="characters"
              isChange={setIsChanged}
              mandatory
              disabled={isViewOnly}
            />

            <LabeledDropdown
              label="Insurance Company"
              defaultValue={insuranceCompany}
              options={InsuranceCompanyMasterList}
              setSelectedOption={setInsuranceCompany}
              setSelectedItem={item => {}}
              bottom
              isChange={setIsChanged}
              mandatory
              disabled={isViewOnly}
            />

            <View style={style.dobContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    style.labelText,
                    {
                      color: insuranceFromCalendarOpen
                        ? Colors.Black
                        : Colors.LabelGrey,
                    },
                  ]}>
                  {'Insurance From Date'}
                </Text>
                <Icon name="pointed-star" />
              </View>
              <TouchableOpacity
                style={[
                  style.inputbox,
                  {
                    borderColor: insuranceFromCalendarOpen
                      ? Colors.Black
                      : Colors.LightGrey,
                  },
                ]}
                disabled={isViewOnly}
                onPress={() => {
                  setInsuranceFromCalendarOpen(!insuranceFromCalendarOpen),
                    setIsChanged(true);
                }}>
                <Text
                  style={{
                    color: insuranceFromDate ? Colors.Black : Colors.LabelGrey,
                  }}>
                  {insuranceFromDate
                    ? moment(insuranceFromDate).format('DD-MM-YYYY').toString()
                    : null}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={style.dobContainer}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={[
                    style.labelText,
                    {
                      color: insuranceTocalendarOpen
                        ? Colors.Black
                        : Colors.LabelGrey,
                    },
                  ]}>
                  {'Insurance To Date'}
                </Text>
                <Icon name="pointed-star" />
              </View>
              <TouchableOpacity
                style={[
                  style.inputbox,
                  {
                    borderColor: insuranceTocalendarOpen
                      ? Colors.Black
                      : Colors.LightGrey,
                  },
                ]}
                disabled={isViewOnly}
                onPress={() => {
                  setInsuranceToCalendarOpen(!insuranceTocalendarOpen),
                    setIsChanged(true);
                }}>
                <Text
                  style={{
                    color: insuranceToDate ? Colors.Black : Colors.LabelGrey,
                  }}>
                  {insuranceToDate
                    ? moment(insuranceToDate).format('DD-MM-YYYY').toString()
                    : null}
                </Text>
              </TouchableOpacity>
            </View>

            <LabeledTextInput
              label="Sum Insured"
              onChange={setSumInsured}
              autoCapitalize="characters"
              defaultValue={sumInsured}
              setErrorFlag={setIsError}
              IsErrorArray={isError}
              isChange={setIsChanged}
              mandatory
              NumberPad
              disabled={isViewOnly}
            />

            <LabeledTextInput
              label=" Premium Amount"
              onChange={setPremiumAmount}
              autoCapitalize="characters"
              defaultValue={premiumAmount}
              setErrorFlag={setIsError}
              IsErrorArray={isError}
              isChange={setIsChanged}
              mandatory
              NumberPad
              disabled={isViewOnly}
            />
          </>
        )}
      </>

      {/* Nominee Details */}
      <>
        <Text style={style.heading}>Nominee Details</Text>
        <LabeledTextInput
          label="Name"
          onChange={setNomineeName}
          defaultValue={nomineeName}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          autoCapitalize="characters"
          isChange={setIsChanged}
          mandatory={isNomineeMandatory}
          disabled={isViewOnly}
        />

        <LabeledDropdown
          label="Relationship With Applicant"
          defaultValue={RelationshipWithApplicant}
          options={RelationshipFamilyOptions}
          setSelectedOption={setRelationshipWithApplicant}
          setSelectedItem={item => {}}
          bottom
          isChange={setIsChanged}
          mandatory={isNomineeMandatory}
          disabled={isViewOnly}
        />

        <LabeledDropdown
          label="Gender"
          defaultValue={nomineeGender}
          options={['Male', 'Female']}
          setSelectedOption={setNomineeGender}
          setSelectedItem={item => {}}
          bottom
          isChange={setIsChanged}
          mandatory={isNomineeMandatory}
          disabled={isViewOnly}
        />

        <LabeledDropdown
          label="Marital Status"
          defaultValue={nomineeMaritalStatus}
          options={['Single', 'Married', 'Divorced', 'Widowed']}
          setSelectedOption={setNomineeMaritalStatus}
          setSelectedItem={item => {}}
          bottom
          isChange={setIsChanged}
          mandatory={isNomineeMandatory}
          disabled={isViewOnly}
        />

        <View style={style.dobContainer}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={[
                style.labelText,
                {color: nomineeDOBOpen ? Colors.Black : Colors.LabelGrey},
              ]}>
              {'Date Of Birth'}
            </Text>
            {isNomineeMandatory && <Icon name="pointed-star" />}
          </View>
          <TouchableOpacity
            style={[
              style.inputbox,
              {borderColor: nomineeDOBOpen ? Colors.Black : Colors.LightGrey},
            ]}
            disabled={isViewOnly}
            onPress={() => {
              setNomineeDOBOpen(!nomineeDOBOpen);
            }}>
            <Text style={{color: nomineeDOB ? Colors.Black : Colors.LabelGrey}}>
              {nomineeDOB
                ? moment(nomineeDOB).format('DD-MM-YYYY').toString()
                : null}
            </Text>
          </TouchableOpacity>
        </View>

        <LabeledTextInput
          label="E-mail ID"
          autoCapitalize="none"
          onChange={setNomineeEmailId}
          defaultValue={nomineeEmailId}
          key={isMainApplicant ? 11 : 12}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          disabled={isViewOnly}
        />

        <LabeledTextInput
          label="Mobile Number "
          autoCapitalize="sentences"
          key={isMainApplicant ? 9 : 10}
          onChange={setNomineeMobileNumber}
          defaultValue={nomineeMobileNumber}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          NumberPad
          maxLength={10}
          disabled={isViewOnly}
        />
      </>

      {goDigitVisible && (
        <>
          <Text style={style.heading}>Go Digit Life Insurance</Text>

          <LabeledRadioButtonGroup
            heading="Do you confirm being in good health?"
            options={['Yes', 'No']}
            onChange={setGoodHealthConsent}
            value={goodHealthConsent}
            isChange={setIsChanged}
            inLine
            disabled={isViewOnly || goDigitInsuranceUrl ? true : false}
          />

          <View
            style={{
              marginTop: '5%',
              width: '100%',
              alignSelf: 'center',
              marginBottom: '5%',
            }}>
            {!goDigitUnSignInsuranceUrl && (
              <Button
                text={'Proceed'}
                active={isGoDigitActive && !isViewOnly}
                marginVertical={10}
                onPress={() => {
                  SaveGoDigit.mutateAsync();
                }}
              />
            )}
          </View>

          <>
            {goDigitUnSignInsuranceUrl &&
              !goDigitInsuranceUrl &&
              !isResendOTPPressed && (
                <View
                  style={{
                    // marginTop: '5%',
                    width: '100%',
                    alignSelf: 'center',
                    marginBottom: '5%',
                  }}>
                  <Button
                    text="Go Digit Life Insurance"
                    onPress={() => {
                      goDigitUnSignInsuranceUrl &&
                        DownloadFile(
                          goDigitUnSignInsuranceUrl,
                          applicantId + '_GoDigitInsurance',
                        );
                    }}
                    marginVertical={20}
                    active={goDigitUnSignInsuranceUrl ? true : false}
                  />
                </View>
              )}

            {/* <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                marginTop: 10,
                marginBottom: 15,
              }}>
              <TouchableOpacity
                disabled={isViewOnly || goDigitInsuranceUrl ? true : false}
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
              <View style={{flexDirection: 'row', left: 15}}>
                <Text
                  style={{
                    color: Colors.Black,
                    fontSize: 13,
                    fontFamily: APP_FONTS.Medium,
                  }}>
                  I agree to have read & understood the{'\b'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setTCPopup(true);
                  }}>
                  <Text
                    style={{
                      color: Colors.Blue,
                      fontSize: 13,
                      fontFamily: APP_FONTS.Medium,
                    }}>
                    T&C
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}

            {!goDigitInsuranceUrl && !isResendOTPPressed && (
              <Button
                text="Generate OTP"
                active={ goDigitUnSignInsuranceUrl ? true : false}
                marginVertical={10}
                marginTop={20}
                onPress={() => {
                  setTimer(45);
                  setIsResendOTPPressed(true);
                  SendOTPForSanctionLetter.mutateAsync();
                }}
              />
            )}
          </>

          {!goDigitInsuranceUrl && (
            <>
              {isResendOTPPressed && (
                <Text style={[style.MessageText, {marginTop: 5}]}>
                  For security, an OTP has been sent to your registered mobile
                  number. Please enter it below to proceed with the download.
                </Text>
              )}

              {!goDigitInsuranceUrl && (
                <View style={{alignItems: 'center', marginVertical: '5%'}}>
                  <Text style={[style.OTPText, {}]}>Didn't received OTP ?</Text>
                  {timer !== 0 && <Text style={style.TimerText}>{timer}</Text>}

                  <TouchableOpacity
                    onPress={() => {
                      setIsResendOTP(false);
                      setIsResendOTPPressed(true);
                      SendOTPForSanctionLetter.mutateAsync();
                      setTimer(45);
                    }}
                    disabled={!isResendOTP}>
                    <Text
                      style={[
                        style.OTPText,
                        {color: isResendOTP ? Colors.Blue : Colors.LabelGrey},
                      ]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {isResendOTPPressed && !goDigitInsuranceUrl && (
                <Animatable.View ref={EnterOTPSanctionLetterContainer}>
                  <LabeledTextInput
                    label="Enter OTP"
                    onChange={setEnteredOTP}
                    defaultValue={enteredOTP}
                    setErrorFlag={setIsError}
                    IsErrorArray={isError}
                    maxLength={6}
                    isChange={setIsChanged}
                    NumberPad
                    mandatory
                  />
                  <Button
                    text="Submit"
                    active
                    marginVertical={10}
                    marginTop={20}
                    onPress={() => {
                      VerifyOTPSanctionLetter.mutateAsync();
                    }}
                  />
                </Animatable.View>
              )}
            </>
          )}
          {/* )} */}

          {goDigitInsuranceUrl && (
            <>
              <View
                style={{
                  // marginTop: '5%',
                  width: '100%',
                  alignSelf: 'center',
                  marginBottom: '5%',
                }}>
                <Button
                  text="Go Digit Life Insurance"
                  onPress={() => {
                    goDigitInsuranceUrl &&
                      DownloadFile(
                        goDigitInsuranceUrl,
                        applicantId + '_GoDigitInsurance',
                      );
                  }}
                  marginVertical={20}
                  active={goDigitInsuranceUrl ? true : false}
                />
              </View>
            </>
          )}
        </>
      )}

      {/* <View style={{marginVertical: '8%', backgroundColor: 'red'}} /> */}
      <View style={{flexDirection: 'row'}}>
        <Text style={style.heading}>{`Gold Receipt `}</Text>
        {isSmartPlusScheme && <Icon name="pointed-star" />}
      </View>

      <View style={[style.container, {marginBottom: 20}]}>
        {goldReceiptUrl == '' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.Upload,
                paddingVertical: 10,
                paddingHorizontal: 50,
                borderRadius: 10,
              }}
              disabled={isViewOnly}
              onPress={() => {
                handleOnPress('Gold Receipt');
              }}>
              <Icon name="upload" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.Capture,
                paddingVertical: 10,
                paddingHorizontal: 50,
                borderRadius: 10,
              }}
              disabled={isViewOnly}
              onPress={() => {
                handleLaunchCamera('Gold Receipt');
              }}>
              <Icon name="capture" />
            </TouchableOpacity>
          </View>
        )}

        {goldReceiptUrl !== '' &&
          (goldReceiptUrlType == 'pdf' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <View
                style={{
                  backgroundColor: Colors.LightGrey,
                  paddingHorizontal: 25,
                  paddingVertical: '5%',
                  height: useFontNormalise(120),
                  justifyContent: 'center',
                  borderRadius: 10,
                  width: useFontNormalise(120),
                  margin: 15,
                  alignItems: 'center',
                }}>
                {
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: -9,
                      right: -5,
                      backgroundColor: 'transparent',
                      alignSelf: 'flex-end',
                    }}
                    disabled={isViewOnly}
                    onPress={() => {
                      setDeletingDocumentType('Gold Receipt');
                    }}>
                    <Icon name="close" />
                  </TouchableOpacity>
                }
                <Icon name="prePdf" />
              </View>
            </View>
          ) : (
            <View
              style={{
                width: '110%',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Image
                source={{uri: goldReceiptUrl}}
                style={{
                  width: 250,
                  height: 180,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
              />

              <TouchableOpacity
                style={style.deleteButton}
                disabled={isViewOnly}
                onPress={() => {
                  setDeletingDocumentType('Gold Receipt');
                }}>
                <Icon name="close" />
              </TouchableOpacity>
            </View>
          ))}

        <View style={{marginVertical: 20}}>
          <LabeledTextInput
            label="Gold Weight (gm)"
            onChange={setGoldWeight}
            defaultValue={goldWeight}
            setErrorFlag={setIsError}
            IsErrorArray={isError}
            isChange={setIsChanged}
            mandatory={isSmartPlusScheme}
            NumberPad
            disabled={isViewOnly}
          />
        </View>
      </View>

      <Text style={style.heading}>IP details</Text>

      <View style={[style.container, {marginBottom: 20}]}>
        {ipUrl == '' && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.Upload,
                paddingVertical: 10,
                paddingHorizontal: 50,
                borderRadius: 10,
              }}
              disabled={isViewOnly}
              onPress={() => {
                handleOnPress('IP');
              }}>
              <Icon name="upload" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.Capture,
                paddingVertical: 10,
                paddingHorizontal: 50,
                borderRadius: 10,
              }}
              disabled={isViewOnly}
              onPress={() => {
                handleLaunchCamera('IP');
              }}>
              <Icon name="capture" />
            </TouchableOpacity>
          </View>
        )}

        {ipUrl !== '' &&
          (ipUrlType == 'pdf' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <View
                style={{
                  backgroundColor: Colors.LightGrey,
                  paddingHorizontal: 25,
                  paddingVertical: '5%',
                  height: useFontNormalise(120),
                  justifyContent: 'center',
                  borderRadius: 10,
                  width: useFontNormalise(120),
                  margin: 15,
                  alignItems: 'center',
                }}>
                {
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: -9,
                      right: -5,
                      backgroundColor: 'transparent',
                      alignSelf: 'flex-end',
                    }}
                    disabled={isViewOnly}
                    onPress={() => {
                      setDeletingDocumentType('IP');
                    }}>
                    <Icon name="close" />
                  </TouchableOpacity>
                }
                <Icon name="prePdf" />
              </View>
            </View>
          ) : (
            <View
              style={{
                width: '110%',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Image
                source={{uri: ipUrl}}
                style={{
                  width: 250,
                  height: 180,
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
              />

              <TouchableOpacity
                style={style.deleteButton}
                disabled={isViewOnly}
                onPress={() => {
                  setDeletingDocumentType('IP');
                }}>
                <Icon name="close" />
              </TouchableOpacity>
            </View>
          ))}
      </View>

      <View style={{}}>
        <View style={style.FinalLabel}>
          <Text style={style.Label}>{`Advance Emi Amount : `}</Text>
          <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
            advEMIAmount?.toString(),
          )}`}</Text>
        </View>
        <View style={style.FinalLabel}>
          <Text style={style.Label}>{`Margin Amount : `}</Text>
          <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
            margin,
          )}`}</Text>
        </View>
        <View style={style.FinalLabel}>
          <Text style={style.Label}>{`Consolidated number of charges : `}</Text>
          <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
            consolidatedChareges,
          )}`}</Text>
        </View>
        <View style={style.FinalLabel}>
          <Text style={style.Label}>{`Total IP : `}</Text>
          <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
            totalIP,
          )}`}</Text>
        </View>

        <LabeledRadioButtonGroup
          heading="IP Paid at?"
          options={[
            'IP Paid at Dealer',
            'IP Paid at Branch',
            'IP Paid at Both',
          ]}
          onChange={setIPPaidBranch}
          value={IPPaidBranch}
          isChange={setIsChanged}
          // inLine
          disabled={isViewOnly}
        />
        {IPPaidBranch == 'IP Paid at Branch' ? (
          <View style={style.FinalLabel}>
            <Text style={style.Label}>{`IP Paid at Branch (Amount): `}</Text>
            <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
              IPPaidAtBranch,
            )}`}</Text>
          </View>
        ) : IPPaidBranch == 'IP Paid at Dealer' ? (
          <LabeledTextInput
            label="IP Paid at Dealer"
            onChange={setIPPaidAtDelar}
            defaultValue={IPPaidAtDelar}
            setErrorFlag={setIsError}
            IsErrorArray={isError}
            autoCapitalize="characters"
            isChange={setIsChanged}
            mandatory
            NumberPad
            disabled={isViewOnly}
          />
        ) : IPPaidBranch == 'IP Paid at Both' ? (
          <>
            <View style={style.FinalLabel}>
              <Text style={style.Label}>{`IP Paid at Branch (Amount): `}</Text>
              <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
                IPPaidAtBranch,
              )}`}</Text>
            </View>
            <LabeledTextInput
              label="IP Paid at Dealer"
              onChange={setIPPaidAtDelar}
              defaultValue={IPPaidAtDelar}
              setErrorFlag={setIsError}
              IsErrorArray={isError}
              autoCapitalize="characters"
              isChange={setIsChanged}
              mandatory
              NumberPad
              disabled={isViewOnly}
            />
          </>
        ) : null}
      </View>

      <View style={{marginVertical: '5%'}} />

      <Button
        text={isChanged ? 'Save' : 'Next'}
        active={isActive && !hasErrorRegistered}
        onPress={() => {
          var temp = Number(IPPaidAtBranch) + Number(IPPaidAtDelar);
          var temp1 = Number(downPayment) - Number(IPPaidAtBranch);
          // console.log("mjjjjjjj",  Number(sumInsured), (Number(0.9) * Number(GetPSDDetailData?.exShowRoomPrice)), Number(sumInsured) > (Number(0.9) * Number(GetPSDDetailData?.exShowRoomPrice)))
          // (percentage / 100) * numberToCalculate
          isChanged
            ? insuranceUrl &&
              Number(premiumAmount?.replaceAll(',', '')) <
                Number(insurenceCaping) - Number(100)
              ? //  ||
                //  (Number(premiumAmount?.replaceAll(',', '')) < Number(insurenceCaping))
                (setErrorMsg(
                  `Please increase the Premium amount as it subceeding the limit `,
                ),
                setCommonPopUPVisible(true))
              : originalInsurance == 'Yes' &&
                Number(sumInsured) <
                  Number(0.9) * Number(GetPSDDetailData?.exShowRoomPrice)
              ? (setErrorMsg(
                  `Sum Insured should not be less than 90% of Ex-showroom price`,
                ),
                setCommonPopUPVisible(true))
              : // originalInsurance == 'Yes' &&  Number(sumInsured) > (Number(GetPSDDetailData?.exShowRoomPrice))? (
              //   setErrorMsg(`Sum Insured should not be  greater than 100% of Ex-showroom price`),
              //     setCommonPopUPVisible(true)
              //   )
              //     :

              originalInvoice == 'Yes' &&
                Number(exShoroomPrice) <
                  Number(GetPSDDetailData?.exShowRoomPrice)
              ? (setErrorMsg(
                  `Ex-Showroom Price as Per Invoice should be greater than or equal to Ex-showroom price`,
                ),
                setCommonPopUPVisible(true))
              : originalInvoice == 'No' &&
                Number(exShowroomPriceAsPerPerforma) <
                  Number(GetPSDDetailData?.exShowRoomPrice)
              ? (setErrorMsg(
                  `Ex-Showroom Price as Per Invoice should be greater than or equal to Ex-showroom price`,
                ),
                setCommonPopUPVisible(true))
              : IPPaidBranch == 'IP Paid at Dealer' &&
                Number(IPPaidAtDelar) != Number(downPayment)
              ? (setErrorMsg(`Please enter the valid IP Paid amount`),
                setCommonPopUPVisible(true))
              : IPPaidBranch == 'IP Paid at Branch' &&
                Number(IPPaidAtBranch) != Number(downPayment)
              ? (setErrorMsg(
                  `IP Paid amount not match with Branch IP amount, Please try again!!!`,
                ),
                setCommonPopUPVisible(true))
              : IPPaidBranch == 'IP Paid at Both' &&
                Number(temp) != Number(downPayment)
              ? (setErrorMsg(`Please enter the valid IP Paid amount`),
                setCommonPopUPVisible(true))
              : // setIPPaidAtDelar(temp1?.toString())
                // console.log("saveeeeeeee")

                SavePSDInfo.mutateAsync()
            : navigation.navigate('DeferralDocuments');
        }}
      />

      <View style={{marginTop: 20}}>
        <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />
      </View>
    </WaveBackground>
  );
};
export default PSDDocument;
const style = StyleSheet.create({
  Label: {
    color: Colors.SubHeadingGrey,
    fontFamily: APP_FONTS.Roboto_Regular,
    fontSize: useFontNormalise(14),
    fontWeight: '400',
  },
  container: {
    marginVertical: 15,
    width: '90%',
    marginTop: 30,
  },
  StaticLabel: {
    fontSize: useFontNormalise(16),
    fontFamily: APP_FONTS.Roboto_SemiBold,
    color: Colors.Black,
  },
  FinalLabel: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    color: Colors.Black,
    fontFamily: APP_FONTS.Roboto_SemiBold,
    fontSize: useFontNormalise(18),
    // marginVertical: '3%',
    marginTop: '8%',
  },
  dobContainer: {
    marginVertical: 15,
    width: '90%',
    alignSelf: 'center',
  },
  inputbox: {
    borderRadius: 15,
    borderColor: Colors.PlaceHolder,
    borderWidth: 1,
    color: Colors.Black,
    fontSize: useFontNormalise(14),
    width: '100%',
    paddingLeft: 10,
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 10,
  },
  labelText: {
    color: Colors.LabelGrey,
    fontFamily: APP_FONTS.Medium,
    fontSize: FONT_SIZE.s,
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    paddingHorizontal: '8%',
  },
  LoanApproved: {
    padding: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LoanApprovedContainer: {
    backgroundColor: 'rgba(106,175,100,0.18)',
    // padding: 10,
    borderRadius: 150,
    // marginHorizontal:'20%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '30%',
  },
  MessageText: {
    color: Colors.Black,
    fontFamily: APP_FONTS.Medium,
    fontSize: useFontNormalise(13),
    textAlign: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
    marginVertical: 15,
  },
  TimerText: {
    fontFamily: APP_FONTS.Roboto_Black,
    fontSize: useFontNormalise(18),
    color: Colors.TimerGreen,
    marginVertical: 5,
  },
  OTPText: {
    color: Colors.Black,
    fontFamily: APP_FONTS.Regular,
    fontSize: FONT_SIZE.s,
    marginVertical: '1%',
    alignSelf: 'center',
    width: '80%',
    textAlign: 'center',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    margin: 20,
    width: '90%', // Take 80% of screen width
    height: 500,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 15,
  },
  listItem: {
    padding: 10,

    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    width: '100%',
  },
  listText: {
    fontSize: FONT_SIZE.xl,
    fontFamily: APP_FONTS.Roboto_Regular,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radioButtonOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelectedOuter: {
    borderColor: Colors.Primary,
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.Primary,
  },
  selectedItem: {
    backgroundColor: '#e0f7fa', // Highlight selected item
  },
  // heading: {
  //   marginTop: 15,
  //   color: Colors.Black,
  //   fontFamily: APP_FONTS.Roboto_SemiBold,
  //   fontSize: useFontNormalise(18),
  // },
});
