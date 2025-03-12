import React, { FC, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import LabeledTextInput from 'components/LabeledTextInput';
import {
  useRegisterRepaymentDetails,
  useValidateVpa,
  useCreateMandateVpa,
} from 'api/ReactQuery/PL/Wrapper';
import { SaveRepaymentDetailsRequest, deleteNachRequest, UploadNachRequest, saveCashRequest, GetPhysicalNachRequest } from 'api/ReactQuery/PL/Repayment/types';
import {
  useGetApplicationDetails,
  useGetCamspayResponse,
  useGetRepaymentDetails,
  useSaveRepaymentDetails,
  useSaveCashDetails,
  useGetCashDetails,
  useGetPhysicalNach,
  UploadProduct,
  UseDeleteEnach,
  useEmandateBankList,
  useEsignBankList
} from 'api/ReactQuery/PL/Repayment';
import {
  CreateMandateVpaRequest,
  RegisterRepaymentDetailsRequest,
  ValidateVpaRequest,
} from 'api/ReactQuery/PL/Wrapper/types';
import DateTimePicker from '@react-native-community/datetimepicker';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import { usedViewStatus } from 'context/useViewStatus';
import WaveBackground from 'components/WaveBackground';
import Card from 'components/RepaymentCard';
import Button from 'components/Button';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import Colors from 'config/Colors';
import { ErrorObject } from 'config/Types';
import { useApplicantDetails } from 'context/useApplicantDetails';
import useActive from 'hooks/useActive';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import LoanSummaryButton from 'components/LoanSummaryButton';
import { useGetLead } from 'api/ReactQuery/PL/Lead';
import styles from './styles';
import DownloadFile from 'config/Functions/DownloadFile';
import useSelectImage from 'hooks/useSelectImage';
import convertImageFileToBase64 from 'config/Functions/ConvertImageToBase64';
import { APP_FONTS, FONT_SIZE } from 'config/Fonts';
import LabeledDropdown from 'components/LabeledDropdown';
import useFontNormalise from 'hooks/useFontNormalise';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RepaymentDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'RepaymentDetails'
>;
type RepaymentDetailsRouteProp = RouteProp<
  RootStackParamList,
  'RepaymentDetails'
>;

interface RepaymentDetailsScreenProps {
  navigation: RepaymentDetailsNavigationProp;
  route: RepaymentDetailsRouteProp;
}

type RepaymentMethoodTypes =
  | 'eNACH'
  | 'Physical Nach'
  | 'UPI Autopay'
  | 'Cash'
  | '';
const RepaymentDetails: FC<RepaymentDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { applicantId, isMainApplicant } = useApplicantDetails();
  // const applicantId = 'MU910411'
  const { useViewStatus } = usedViewStatus();

  const [isError, setIsError] = useState<ErrorObject[]>([]);
  const [isAadharNumberError, setIsAadharNumberError] = useState<ErrorObject[]>(
    [],
  );
  const [isCashError, setIsCashError] = useState<ErrorObject[]>([]);
  const [isVPAError, setIsVPAError] = useState<ErrorObject[]>([]);
  const [accountNumberVerified, setAccountNumberVerified] =
    useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [IfscCode, setIfscCode] = useState<string>('');
  const [cheque1, setCheque1] = useState<string>('');
  const [cheque2, setCheque2] = useState<string>('');
  const [cheque3, setCheque3] = useState<string>('');
  const [accHolderNumber, setAccHolderNumber] = useState<string>('');
  const [IFSCCode, setIFSCode] = useState<string>('');
  const [isCashVisible, setIsCashVisible] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [selectNull, setSelectedNull] = useState<'upload' | 'capture' | null>(
    null,
  );
  const [docType, setDocType] = useState<'pdf' | 'jpg' | null>(null);

  const [bankName, setBankName] = useState<string>('');
  const [aadharNumber, setAadharNumber] = useState<string>('');
  const [accountHolderName, setAccountHolderName] = useState<string>('');
  const [DateOfDebit, setDateOfDebit] = useState<string>('');
  const [debitStartDate, setDebitStartDate] = useState<string>(moment(new Date()).format('DD-MM-YYYY'));
  const [selectingCalendar, setSelectingCalendar] = useState<boolean>(false);
  const [selectedeNACHType, setSelectedeNACHType] = useState<eNACHTypes>(null);
  const [appData, setAppData] = useState<ApplicationData>();
  const [selectedRepaymentMethod, setSelectedRepaymentMethod] =
    useState<RepaymentMethoodTypes>('');
  const [isAgreement, setIsAgrement] = useState<boolean>(false);
  const [popupVisible, setPopUPVisible] = useState<boolean>(false);
  const [isButtonPress, setIsButtonPress] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [errorPopUp, setErrorPopup] = useState<boolean>(false);
  const [VPA, setVPA] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [debitDateForCalendar, setDebitDateForCalendar] = useState<any>('');
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [emandateBank, setEmandateBank] = useState<string>('');
  const [esignBank, setEsignBank] = useState<string>('');
  const [emandateBankItem, setEmandateBankItem] = useState<any>('');
  const [bankId, setBankId] = useState<string>('');
  const [bankCode, setBankCode] = useState<string>('');
  const [isNachReactivation, setIsNachReactivation] = useState<boolean>(false);

  const [esignBankItem, setEsignBankItem] = useState<any>('');

  type eNACHTypes = 'Aadhar' | 'Debit Card' | 'Net Banking' | 'Cash' | 'Esign' | 'NetBanking' | null;
  type ApplicationData = {
    emi: string;
    tenure: string;
    emailId: string;
    mobileNumber: string;
    applicantUniqueId: string;
    debitStartDate: string;
    accountHolderName: string;
    bankCode: string;
    ifsc: string;
    accountNumber: string;
    aadharNo: string;
    service: string;
    authenticationMode: string;
  };

  interface Item {
    label?: string;
    value?: string;
    bankCode?: string;
    id?: number;
    name?: string;
    bankId?: number;
    mode?: string;
  }

  const SaveRepaymentDetailsRequest: SaveRepaymentDetailsRequest = {
    paymentType:
      selectedRepaymentMethod == 'eNACH' ? 'enach' : selectedRepaymentMethod,
    applicantUniqId: applicantId,
    debitStartDate: moment(new Date()).format('DD-MM-YYYY'),
    vpa: VPA,
    authenticationMode:
      selectedRepaymentMethod == 'UPI Autopay'
        ? 'V'
        : selectedRepaymentMethod == 'Cash'
          ? 'C'
          : selectedRepaymentMethod == 'Physical Nach'
            ? 'P'
            : selectedeNACHType == 'Aadhar'
              ? 'A'
              : selectedeNACHType == 'Debit Card'
                ? 'D'
                : 'N',
    repaymentMode:
      selectedRepaymentMethod == 'eNACH' ? 'enach' : selectedRepaymentMethod,
    bank: emandateBankItem?.label,
    bankId: emandateBankItem?.bankId,
    bankCode: emandateBankItem?.bankCode

  };

  const GetPhysicalNachRequest: GetPhysicalNachRequest = {
    appId: applicantId,
    applicantType: 'mainApplicant',
    isNachReactivation: isNachReactivation

  };



  const RegisterRepaymentDetailsRequest: RegisterRepaymentDetailsRequest = {
    emi: (appData?.emi) ? appData.emi?.toString() : '',
    tenure: (appData?.tenure) ? appData.tenure?.toString() : '',
    emailId: (appData?.emailId) ? appData.emailId?.toString() : '',
    mobileNumber: (appData?.mobileNumber) ? appData.mobileNumber?.toString() : '',
    applicantUniqueId: applicantId,
    debitStartDate:
      // DateOfDebit
      // need
      // ? moment(DateOfDebit, 'DD-MM-YYYY').format('YYYY-MM-DD')
      // : 
      moment(new Date()).format('YYYY-MM-DD'),
    accountHolderName: appData?.accountHolderName
      ? appData?.accountHolderName?.toString()
      : '',
    bankCode: bankCode,
    // isNachReactivation: isNachReactivation,
    // appData?.bankCode ? appData.bankCode?.toString() : '',
    bankId: bankId,
    ifsc: appData?.ifsc ? appData.ifsc?.toString() : '',
    accountNumber: appData?.accountNumber
      ? appData.accountNumber?.toString()
      : '',
    aadharNo: aadharNumber,
    service: 'salesApp',
    mode: selectedeNACHType == 'Debit Card' ? 'DebitCard'
      : selectedeNACHType == 'Aadhar' ? 'Esign'
        : selectedeNACHType == 'Net Banking' ? 'NetBanking' : '',
    authenticationMode:
      selectedeNACHType == 'Aadhar'
        ? 'A'
        : selectedeNACHType == 'Debit Card'
          ? 'D'
          : selectedRepaymentMethod == 'UPI Autopay'
            ? 'V'
            : selectedRepaymentMethod == 'Cash'
              ? 'C'
              : 'N',
  };

  const saveCashRequest: saveCashRequest = {
    appId: applicantId,
    accountHolderName: accHolderNumber,
    applicantType: 'mainApplicant',
    bankName: bankName,
    ifscCode: IFSCCode,
    paymentType: "Cash",
    repaymentMode: "Cash",
    instrumentNo1: cheque1,
    instrumentNo2: cheque2,
    instrumentNo3: cheque3
  };

  const ValidateVpaRequest: ValidateVpaRequest = {
    accountHolderName: accountHolderName,
    applicantUniqueId: applicantId,
    service: 'salesApp',
    vpa: VPA,
  };

  const UploadNachRequest: UploadNachRequest = {
    appId: applicantId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    base64value: imageBase64,
    type: docType

  };

  const deleteNachRequest: deleteNachRequest = {
    appId: applicantId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
  };

  const [
    DeleteNachDocument,
    { data: DeleteNachDocumentData, isLoading: DeleteNachDocumentIsLoading },
  ] = UseDeleteEnach(deleteNachRequest);

  const [
    emandateBankList,
    { data: emandateBankListData, isLoading: emandateBankListIsLoading },
  ] = useEmandateBankList();

  // useEffect(() => {
  //   if (emandateBankListData) {
  //     console.log("emandateBankListData", emandateBankListData);

  //   }
  // }, [emandateBankListData])

  const [
    esignBankList,
    { data: esignBankListData, isLoading: esignBankListIsLoading },
  ] = useEsignBankList();

  const [
    saveCashDetails,
    { data: SaveCashDetailsData, isLoading: SaveCashDetailsIsLoading },
  ] = useSaveCashDetails(saveCashRequest);

  const [
    uploadNachDocument,
    { data: uploadNachDocumentData, isLoading: SetNachDocumentIsLoading },
  ] = UploadProduct(UploadNachRequest);

  const [
    GetPhysicalNach,
    { data: GetPhysicalNachData, isLoading: GetPhysicalNachIsLoading },
  ] = useGetPhysicalNach(GetPhysicalNachRequest);

  const [
    GetApplicationDetails,
    {
      data: GetApplicationDetailsData,
      isLoading: GetApplicationDetailsIsLoading,
    },
  ] = useGetApplicationDetails({ applicantUniqueId: applicantId });

  const [
    GetRepaymemtDetails,
    { data: GetRepaymemtDetailsData, isLoading: GetRepaymemtDetailsisLoading },
  ] = useGetRepaymentDetails(applicantId);

  const [
    RegisterRepaymentDetails,
    {
      data: RegisterRepaymentDetailsData,
      isLoading: RegisterRepaymentDetailsIsLoading,
    },
  ] = useRegisterRepaymentDetails(RegisterRepaymentDetailsRequest);

  const [
    ValidateVPA,
    { data: ValidateVPAData, isLoading: ValidateVPAIsLoading },
  ] = useValidateVpa(ValidateVpaRequest);

  const CreateMandateVpaRequest: CreateMandateVpaRequest = {
    applicantUniqueId: applicantId,
    authenticationMode: 'V',
    debitStartDate: debitStartDate,
    emi:
      // '1.00',
      (appData?.emi) || '',
    payerName: ValidateVPAData?.data?.payerName || '',
    payerVpa: ValidateVPAData?.data?.payerVpa || '',
    service: 'salesApp',
    isNachReactivation: isNachReactivation

  };

  const [
    CreateMandateVpa,
    { data: CreateMandateVpaData, isLoading: CreateMandateVpaIsLoading },
  ] = useCreateMandateVpa(CreateMandateVpaRequest);

  const [
    SaveBankDetails,
    { data: SaveBankDetailsData, isLoading: SaveBankDetailsIsLoading },
  ] = useSaveRepaymentDetails(SaveRepaymentDetailsRequest);

  const [
    GetEnachResponse,
    { data: GetEnachResponseData, isLoading: GetEnachResponseIsLoading },
  ] = useGetCamspayResponse({ loanId: applicantId });

  const [GetLead, { data: GetLeadData, isLoading: GetLeadDataIsLoading }] =
    useGetLead(`${applicantId}&applicantType=mainApplicant`);

  const [GetCashDetails, { data: GetCashDetailsData, isLoading: GetCashDetailsIsLoading }] =
    useGetCashDetails(`${applicantId}`);

  useEffect(() => {
    if (imageBase64) {
      uploadNachDocument.mutateAsync();
    }
  }, [imageBase64]);

  useEffect(() => {
    if (ValidateVPAData && ValidateVPAData?.data?.nameMatched) {
      CreateMandateVpa.mutateAsync();
    } else if (ValidateVPAData && !ValidateVPAData?.data?.nameMatched) {
      useShowFlashMessage('warning', 'Kindly provide applicant UPI ID');
    }
  }, [ValidateVPAData]);

  useEffect(() => {
    if (SaveCashDetailsData) {
      console.log("SaveCashDetailsData", SaveCashDetailsData);

      setIsChanged(false)
      GetRepaymemtDetails.mutateAsync();

    }
  }, [SaveCashDetailsData])

  useEffect(() => {
    if (uploadNachDocumentData) {
      GetRepaymemtDetails.mutateAsync()
    }
  }, [uploadNachDocumentData])

  useEffect(() => {
    if (DeleteNachDocumentData) {
      GetRepaymemtDetails.mutateAsync()
    }
  }, [DeleteNachDocumentData])




  const emandateBankDropdownList: Item[] = emandateBankListData
    ? emandateBankListData && emandateBankListData?.map(item => ({
      label: item.name,
      value: item.name,
      id: item.id,
      name: item.name,
      bankId: item.bankId,
      mode: item.mode,
      bankCode: item.bankCode
    }))
    : [];

  // console.log("hhhhhhhh",esignBankListData);

  const esignBankDropdownList: Item[] = esignBankListData ? esignBankListData &&
    esignBankListData?.map(item => ({
      label: item.name,
      value: item.name,
      id: item.id,
      name: item.name,
      bankId: item.bankId,
      mode: item.mode,
      bankCode: item.bankCode
    }))
    : [];



  useEffect(() => {
    if (GetPhysicalNachData) {
      console.log("GetPhysicalNachData", GetPhysicalNachData);
      GetApplicationDetails.mutateAsync()
      GetPhysicalNachData?.pdf_url &&
        DownloadFile(
          GetPhysicalNachData?.pdf_url,
          String(applicantId + '_EnachReport'),
        )
    }
  }, [GetPhysicalNachData])

  useEffect(() => {
    if (GetCashDetailsData) {
      // console.log("GetCashDetailsData", GetCashDetailsData);
      setIsCashVisible(GetCashDetailsData.isCash)
      setCheque1(GetCashDetailsData?.instrumentNo1)
      setCheque2(GetCashDetailsData?.instrumentNo2)
      setCheque3(GetCashDetailsData?.instrumentNo3)
      setAccHolderNumber(GetCashDetailsData.accountHolderName)
      setIFSCode(GetCashDetailsData.ifscCode)
      setBankName(GetCashDetailsData.bankName)
      GetCashDetailsData.repaymentMode === 'Cash'
        ? setSelectedRepaymentMethod('Cash') : null

    }
  }, [GetCashDetailsData])

  useEffect(() => {
    if (CreateMandateVpaData) {
      GetRepaymemtDetails.mutateAsync();
      GetEnachResponse.mutateAsync()
      // GetApplicationDetails.mutateAsync();
    }
  }, [CreateMandateVpaData]);

  useEffect(() => {
    if (GetEnachResponseData) {
      GetRepaymemtDetails.mutateAsync();
    }
  }, [GetEnachResponseData]);

  useEffect(() => {
    if (GetLeadData) {
      setAadharNumber(GetLeadData?.aadharNo);
    }
  }, [GetLeadData]);

  useEffect(() => {
    if (SaveBankDetailsData) {
      console.log("SaveBankDetailsData", SaveBankDetailsData);
      setIsChanged(false)
      selectedRepaymentMethod == 'Physical Nach' ?
        GetPhysicalNach.mutateAsync() :
        GetApplicationDetails.mutateAsync();

    }
  }, [SaveBankDetailsData]);

  useEffect(() => {
    if (GetRepaymemtDetailsData) {
      isNachReactivation ?
        setIsViewOnly(false) :
        setIsViewOnly(
          GetRepaymemtDetailsData?.isReEditRepayment == false ? true :
            useViewStatus?.isSalesReject ? true :
              useViewStatus?.isDisbursementFreeze ? true :
                false);
    }
  }, [GetRepaymemtDetailsData, isNachReactivation]);

  useEffect(() => {
    if (GetApplicationDetailsData) {
      // console.log("GetApplicationDetailsD999jjjjjjjjjata", JSON.stringify(GetApplicationDetailsData, null, 4));
      setAppData({
        ...appData,
        emi: GetApplicationDetailsData?.emi?.toString(),
        tenure: GetApplicationDetailsData?.tenure?.toString(),
        emailId: GetApplicationDetailsData?.emailId?.toString(),
        mobileNumber: GetApplicationDetailsData?.mobileNumber?.toString(),
        applicantUniqueId: applicantId,
        debitStartDate: moment(new Date()).format('DD-MM-YYYY'),
        accountHolderName:
          GetApplicationDetailsData?.accountHolderName?.toString(),
        bankCode: GetApplicationDetailsData?.bankCode?.toString(),
        ifsc: GetApplicationDetailsData?.ifsc?.toString(),
        accountNumber: GetApplicationDetailsData?.accountNumber?.toString(),
        aadharNo: aadharNumber,
        service: 'salesApp',
        authenticationMode:
          selectedeNACHType == 'Aadhar'
            ? 'A'
            : selectedeNACHType == 'Debit Card'
              ? 'D'
              : 'N',
      });
      GetApplicationDetailsData?.debitStartDate
        ? setDateOfDebit(GetApplicationDetailsData?.debitStartDate)
        : null;
      setAccountNumber(GetApplicationDetailsData?.accountNumber);
      setIfscCode(GetApplicationDetailsData?.ifsc);
      setAccountHolderName(GetApplicationDetailsData?.accountHolderName);

    }
  }, [GetApplicationDetailsData]);

  useEffect(() => {
    if (GetRepaymemtDetailsData) {
      console.log("GetApplicationDetailsDatahhhhhhh", JSON.stringify(GetRepaymemtDetailsData, null, 4));
      setImageUrl(GetRepaymemtDetailsData?.physicalNachFilePath || '')
      setDocType(GetRepaymemtDetailsData?.type)

      GetRepaymemtDetailsData?.isAgreementDone
        ? setIsAgrement(GetRepaymemtDetailsData?.isAgreementDone)
        : null;
      GetRepaymemtDetailsData.repaymentType
        ? GetRepaymemtDetailsData.repaymentType === 'enach'
          ? setSelectedRepaymentMethod('eNACH')
          : GetRepaymemtDetailsData.repaymentType === 'Physical Nach'
            ? setSelectedRepaymentMethod('Physical Nach')
            : GetRepaymemtDetailsData.repaymentType === 'UPI Autopay'
              ? setSelectedRepaymentMethod('UPI Autopay')
              : null
        : null;
      GetRepaymemtDetailsData?.debit_start_date
        ? setDebitStartDate(GetRepaymemtDetailsData?.debit_start_date)
        : null;
      GetRepaymemtDetailsData?.AuthenticationType
        ? GetRepaymemtDetailsData?.AuthenticationType == 'Esign'
          ? setSelectedeNACHType('Aadhar')
          : GetRepaymemtDetailsData?.AuthenticationType == 'DebitCard'
            ? setSelectedeNACHType('Debit Card')
            : GetRepaymemtDetailsData?.AuthenticationType == 'NetBanking'
              ? setSelectedeNACHType('Net Banking')
              : null
        : null;
      setVPA(GetRepaymemtDetailsData?.upi || '');
      setEmandateBank(GetRepaymemtDetailsData?.bankName)
      setBankCode(GetRepaymemtDetailsData?.bankCode)
      setBankId(GetRepaymemtDetailsData?.bankId)
      GetRepaymemtDetailsData?.nachSuccessFlag ? setIsChanged(false) : null
    }
  }, [GetRepaymemtDetailsData]);

  useEffect(() => {
    if (appData && selectedRepaymentMethod == 'eNACH' && isButtonPress) {
      RegisterRepaymentDetails.mutateAsync();
    } else if (
      appData &&
      selectedRepaymentMethod == 'UPI Autopay' &&
      isButtonPress
    ) {
      ValidateVPA.mutateAsync();
    }
  }, [appData]);

  useEffect(() => {
    if (RegisterRepaymentDetailsData) {
      console.log("RegisterRepaymentDetailsData", RegisterRepaymentDetailsData);
      // need
      var temp = RegisterRepaymentDetailsData?.Enachregistrationurl
        // var temp = RegisterRepaymentDetailsData?.data?.enachResponseUrl
        ?.split('to ')
        ?.pop();
      if (temp) {
        setIsButtonPress(false);
        navigation.navigate('NachRegistration', { webRedirectionUrl: temp });
        // Linking.openURL(temp)
        //   .then(() => setPopUPVisible(true))
        //   .catch(err => {
        //     console.log('error', err);
        //     setErrorPopup(true);
        //   });
      }
    }
  }, [RegisterRepaymentDetailsData]);

  const handleOnPress = () => {
    const callback = (response: any, path: any, name: string) => {
      if (response) {
        if (String(response[0].type).includes('pdf')) {
          setDocType('pdf');
        } else {
          setDocType('jpg');
        }
        setImageUrl(response[0]?.fileCopyUri);
        convertImageFileToBase64(response[0]?.fileCopyUri)
          .then(base64Data => {
            if (base64Data) {
              setImageBase64(base64Data);
            }
          })
          .catch(error => {
            console.error('Error converting image file to base64:', error);
          });
      }
    };
    useSelectImage(callback, 'allDocument', setSelectedNull);
  };

  // const handleCloseImage = () => {
  //   setImageBase64('');
  //   setImageUrl('');
  //   DeleteNachDocument.mutateAsync()
  // };

  const handleButtonPress = (item: RepaymentMethoodTypes) => {
    setSelectedRepaymentMethod(item == selectedRepaymentMethod ? '' : item);
  };

  // console.log("esignBankDropdownList",esignBankDropdownList);

  const eNACHMethods: eNACHTypes[] = ['Aadhar', 'Debit Card', 'Net Banking'];

  const RendereNACHOptions: FC = () => (
    <View>
      {eNACHMethods.map((item: eNACHTypes, index) => (
        <View key={index}>
          <TouchableWithoutFeedback
            onPress={() => { setSelectedeNACHType(item), setEmandateBank(''), setIsChanged(true) }}
            disabled={isNachReactivation ? false : (isAgreement || isViewOnly || GetRepaymemtDetailsData?.status == "SUCCESS")}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 15,
                alignItems: 'center',
              }}>
              <Text style={styles.eNachTypeText}>{item}</Text>
              {item === selectedeNACHType && <Icon name="tick-green" />}
            </View>
          </TouchableWithoutFeedback>


        </View>
      ))}
      {(selectedeNACHType == 'Debit Card' || selectedeNACHType == 'Net Banking') &&
        <LabeledDropdown
          label="Bank List"
          defaultValue={emandateBank}
          options={emandateBankDropdownList}
          setSelectedOption={setEmandateBank}
          bottom
          isChange={setIsChanged}
          mandatory
          setSelectedItem={item => {
            console.log("bbb", item);
            setEmandateBankItem(item);
            setBankCode(item?.bankCode)
            setBankId(item?.bankId)
          }}
          disabled={isViewOnly || GetRepaymemtDetailsData?.status == "SUCCESS"}
        />}

      {selectedeNACHType == 'Aadhar' && esignBankDropdownList &&
        <LabeledDropdown
          label="Bank List"
          defaultValue={emandateBank}
          options={esignBankDropdownList}
          setSelectedOption={setEmandateBank}
          bottom
          setSelectedItem={item => {
            console.log("bbb", item);
            setEmandateBankItem(item);
            setBankCode(item?.bankCode)
            setBankId(item?.bankId)
          }}
          isChange={setIsChanged}
          mandatory
          disabled={isViewOnly || GetRepaymemtDetailsData?.status == "SUCCESS"}
        />}
    </View>
  );

  const RenderPhysicalNach: FC = () => (
    <View style={{ marginVertical: 30 }}>
      <Button
        text="Generate Prefill Nach Form"
        active
        onPress={() => {
          isViewOnly ? null :
            SaveBankDetails.mutateAsync()
        }}
        marginVertical={15}
      />

      <View style={{ marginVertical: 20 }}>
        {imageUrl === '' && (
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
              disabled={isViewOnly ? isViewOnly : !GetApplicationDetailsData?.moveForwardFlag}
              onPress={() => {
                handleOnPress();
              }}>
              <Icon name="upload" />
            </TouchableOpacity>
          </View>
        )}

        {imageUrl !== '' && (
          <View
            style={{
              // flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            {docType == 'pdf' ?
              <View style={{ flexDirection: 'row', width: '80%' }}>
                <Icon name="pdf" />
                <Text
                  style={{
                    color: 'LightBlue',
                    fontFamily: APP_FONTS.Roboto_Regular,
                    fontSize: FONT_SIZE.l,
                    marginLeft: 10,
                  }}
                  onPress={() => {
                    // DownloadFile(imageUrl, applicantId + '_' + documentType);
                    // Linking.openURL(imageUrl);
                    // console.log('mjjjj', imageUrl.split('/').pop());
                  }}>
                  {`${'Physical nach'}.pdf`}
                </Text>
              </View>
              :
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{
                    uri: imageUrl,
                  }}
                  style={{
                    width: useFontNormalise(180),
                    height: useFontNormalise(180),
                    borderRadius: 10,
                  }}
                />
              </View>
            }
            {/* <TouchableOpacity
              style={{
                backgroundColor: 'transparent',
                alignSelf: 'flex-end',
                paddingHorizontal: '16%',
              }}
              disabled={isViewOnly}
              onPress={() => {
                handleCloseImage();
              }}>
              <Icon name="close" />
            </TouchableOpacity> */}
          </View>
        )}
      </View>
    </View>
  );
  type RenderRadioButtonTypes = {
    index: number;
    item: RepaymentMethoodTypes;
  };
  // console.log("GetRepaymemtDetailsDataStatus", GetRepaymemtDetailsData?.nachSuccessFlag);

  const RenderRadioButton = (item, index) => {
    return (
      <View key={index} style={{ marginVertical: item !== 'eNACH' ? 5 : 0 }}>
        <Card
          paddingVeritcal={20}
          borderLine={selectedRepaymentMethod === item}>
          <TouchableOpacity
            disabled={isNachReactivation ? false : isViewOnly ? isViewOnly : GetRepaymemtDetailsData?.nachSuccessFlag}
            onPress={() => {
              handleButtonPress(item);
            }}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.RadioButton}>
              {selectedRepaymentMethod === item && (
                <View style={styles.RadioButtonSelected} />
              )}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color:
                    selectedRepaymentMethod === item
                      ? Colors.Black
                      : Colors.TextInputColor,
                },
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        </Card>

        {item === 'eNACH' && selectedRepaymentMethod === 'eNACH' && (
          <RendereNACHOptions key={index} />
        )}

        {item === 'UPI Autopay' && selectedRepaymentMethod == 'UPI Autopay' && (
          <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
            <LabeledTextInput
              label="UPI ID"
              onChange={setVPA}
              defaultValue={VPA}
              // disabled={isViewOnly}
              disabled={isViewOnly ? isViewOnly : GetRepaymemtDetailsData?.nachSuccessFlag}
              setErrorFlag={setIsVPAError}
              IsErrorArray={isVPAError}
              isChange={setIsChanged}
              mandatory
            />
            {/* <View style={styles.dobContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.labelText,
                    {
                      color: selectingCalendar
                        ? Colors.Black
                        : Colors.LabelGrey,
                    },
                  ]}>
                  Disbustment Date{' '}
                </Text>
                <Icon name="pointed-star" />
              </View>
              <TouchableOpacity
                style={[
                  styles.inputbox,
                  {
                    marginTop: 10,
                    borderColor: selectingCalendar
                      ? Colors.Black
                      : Colors.LightGrey,
                  },
                ]}
                onPress={() => setSelectingCalendar(true)}>
                <Text
                  style={{
                    color: debitStartDate ? Colors.Black : Colors.LabelGrey,
                  }}>
                  {debitStartDate || 'DD/MM/YYYY'}
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>
        )}

        {item === 'Cash' && selectedRepaymentMethod == 'Cash' && (
          <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
            <LabeledTextInput
              label="Instrument No 1"
              setErrorFlag={setIsCashError}
              isChange={setIsChanged}
              onChange={setCheque1}
              defaultValue={cheque1}
              IsErrorArray={isCashError}
              disabled={isViewOnly}
              NumberPad
              mandatory
              placeholder='Instrument number'
            />
            <LabeledTextInput
              label="Instrument No 2"
              setErrorFlag={setIsCashError}
              isChange={setIsChanged}
              onChange={setCheque2}
              defaultValue={cheque2}
              IsErrorArray={isCashError}
              disabled={isViewOnly}
              NumberPad
              placeholder='Instrument number'
            />
            <LabeledTextInput
              label="Instrument No 3"
              setErrorFlag={setIsCashError}
              isChange={setIsChanged}
              onChange={setCheque3}
              defaultValue={cheque3}
              IsErrorArray={isCashError}
              disabled={isViewOnly}
              NumberPad
              placeholder='Instrument number'
            />
            <LabeledTextInput
              label="Account Holder Name"
              onChange={setAccHolderNumber}
              isChange={setIsChanged}
              IsErrorArray={isCashError}
              setErrorFlag={setIsCashError}
              defaultValue={accHolderNumber}
              mandatory
              disabled={isViewOnly}
            />
            <LabeledTextInput
              label="Bank Name"
              onChange={setBankName}
              isChange={setIsChanged}
              IsErrorArray={isCashError}
              setErrorFlag={setIsCashError}
              defaultValue={bankName}
              mandatory
              disabled={isViewOnly}
            />

            <LabeledTextInput
              label="IFSC Code"
              onChange={setIFSCode}
              isChange={setIsChanged}
              defaultValue={IFSCCode}
              setErrorFlag={setIsCashError}
              autoCapitalize="characters"
              maxLength={11}
              IsErrorArray={isCashError}
              mandatory
              disabled={isViewOnly}
            />
          </View>
        )}

        {item === 'Physical Nach' &&
          selectedRepaymentMethod === 'Physical Nach' && (
            <RenderPhysicalNach key={index} />
          )}

        {/* {selectedRepaymentMethod === 'eNACH' &&
          selectedRepaymentMethod === item && (
            <View style={styles.dobContainer}>
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.labelText,
                    {
                      color: selectingCalendar
                        ? Colors.Black
                        : Colors.LabelGrey,
                    },
                  ]}>
                  Debit Start Date{' '}
                </Text>
                <Icon name="pointed-star" />
              </View>
              <TouchableOpacity
                style={[
                  styles.inputbox,
                  {
                    marginTop: 10,
                    borderColor: selectingCalendar
                      ? Colors.Black
                      : Colors.LightGrey,
                  },
                ]}
                onPress={() => setSelectingCalendar(true)}>
                <Text
                  style={{
                    color: debitStartDate ? Colors.Black : Colors.LabelGrey,
                  }}>
                  {debitStartDate || 'DD/MM/YYYY'}
                </Text>
              </TouchableOpacity>
            </View>
          )} */}


        {item == 'Physical Nach' ? null :
          item == "UPI Autopay" && GetRepaymemtDetailsData?.status == 'PENDING' ? null :
            selectedRepaymentMethod === item &&
            (!isChanged ? !GetRepaymemtDetailsData?.nachSuccessFlag : isChanged) &&

            (
              <Button
                text="Continue"
                active={
                  (selectedRepaymentMethod === 'Cash' &&
                    isActveCash && !hasCashError
                  ) ||
                  (selectedRepaymentMethod === 'eNACH' &&
                    selectedeNACHType == 'Aadhar' &&
                    isActveEnach &&
                    !hasEnachError) ||
                  (selectedRepaymentMethod === 'UPI Autopay' &&
                    isActveVPA &&
                    !hasVPAError) ||
                  (isActive &&
                    !hasError &&
                    (selectedeNACHType === 'Debit Card' ||
                      selectedeNACHType === 'Net Banking'))
                }
                onPress={() => {
                  selectedRepaymentMethod === 'Cash' ?
                    saveCashDetails.mutateAsync()
                    :
                    (SaveBankDetails.mutateAsync(),
                      setIsButtonPress(true))
                }}
                marginVertical={15}
              />
            )}
      </View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      //manoj
      if (applicantId) {
        const isNachReactivation = async () => {
          const isNachReactivation = await AsyncStorage.getItem('isNachReactivation')
          console.log("isNachReactivation666666666", isNachReactivation);
          setIsNachReactivation(isNachReactivation == 'true' ? true : false)

          isNachReactivation == 'true' ?
            setIsViewOnly(false) :
            setIsViewOnly(
              GetRepaymemtDetailsData?.isReEditRepayment == false ? true :
                useViewStatus?.isSalesReject ? true :
                  useViewStatus?.isDisbursementFreeze ? true :
                    false)

          esignBankList.mutateAsync()
          emandateBankList.mutateAsync();
          GetRepaymemtDetails.mutateAsync();
          GetEnachResponse.reset();
          GetLead.mutateAsync();
          GetApplicationDetails.mutateAsync();
          GetCashDetails.mutateAsync()

        }
        isNachReactivation()
      }
    }, []),
  );

  const RepaymentMethodOptions: RepaymentMethoodTypes[] = [
    'eNACH',
    'UPI Autopay',
    'Cash',
    'Physical Nach',

  ];

  const onDebitDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setSelectingCalendar(false);
    setDebitStartDate(event.type == 'set' ? moment(currentDate).format('DD-MM-YYYY') : '');
    setDebitDateForCalendar(event.type == 'set' ? currentDate : '');
    setIsChanged(true);
  };

  let isActive: boolean = useActive([
    accountNumber,
    IfscCode,
    emandateBank,
    String(debitStartDate),
  ]);
  let hasError: boolean = isError.some(error => error.hasError === true);
  let hasEnachError: boolean = isAadharNumberError.some(
    error => error.hasError === true,
  );
  let hasCashError: boolean = isCashError.some(error => error.hasError === true);

  let hasVPAError: boolean = isVPAError.some(error => error.hasError === true);
  let isActveEnach: boolean = useActive([aadharNumber, String(debitStartDate), emandateBank]);
  let isActveVPA: boolean = useActive([VPA, String(debitStartDate)]);
  let isActveCash: boolean = useActive([cheque1, accHolderNumber, bankName, IFSCCode]);


  return (
    <WaveBackground
      loading={[
        RegisterRepaymentDetailsIsLoading,
        GetApplicationDetailsIsLoading,
        SaveBankDetailsIsLoading,
        GetRepaymemtDetailsisLoading,
        GetEnachResponseIsLoading,
        GetLeadDataIsLoading,
        ValidateVPAIsLoading,
        SetNachDocumentIsLoading,
        CreateMandateVpaIsLoading,
        SaveCashDetailsIsLoading,
        GetPhysicalNachIsLoading,
        GetCashDetailsIsLoading,
        DeleteNachDocumentIsLoading,
        emandateBankListIsLoading,
        esignBankListIsLoading
      ]}
      title={'Repayment Details'}>
      {selectingCalendar && (
        <DateTimePicker
          testID="date"
          value={debitDateForCalendar || new Date()}
          maximumDate={new Date()}
          mode="date"
          onChange={onDebitDateChange}

        />
      )}
      <Modal
        buttonTitle="Okay"
        title=""
        status="normal"
        message="Please Press the Okay button to know the status of signed document"
        visible={popupVisible}
        onClose={() => {
          setPopUPVisible(false);
          GetRepaymemtDetails.mutateAsync();
          GetEnachResponse.reset();
        }}
      />

      <Modal
        onClose={() => {
          setErrorPopup(false);
        }}
        visible={errorPopUp}
        message={'Something went wrong! We request you to try again.'}
        status={'failure'}
        buttonTitle={'Try Again'}
      />

      <Text style={styles.title}>{'Repayment Method'}</Text>

      <FlatList
        style={{ flex: 1 }}
        data={isCashVisible ? RepaymentMethodOptions : RepaymentMethodOptions.filter(item => item !== 'Cash')
        }
        renderItem={({ item, index }) => RenderRadioButton(item, index)}
        extraData={RepaymentMethodOptions}
      />

      {selectedRepaymentMethod !== 'Cash' &&
        GetRepaymemtDetailsData?.repaymentType !== "Physical Nach" &&
        GetRepaymemtDetailsData?.status && (
          // !GetEnachResponseData &&
          <View style={{ marginVertical: 15 }}>
            <Button
              text="Get Nach Status"
              onPress={() => {
                GetEnachResponse.mutateAsync()
                // GetRepaymemtDetails.mutateAsync();
              }}
              active
            />
          </View>
        )}
      {GetRepaymemtDetailsData?.status &&
        GetRepaymemtDetailsData?.repaymentType !== "Physical Nach" &&
        GetEnachResponseData && (
          <View style={{ marginBottom: 10 }}>
            <Card paddingVeritcal={20}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: Colors.TextInputColor,
                    },
                  ]}>
                  Transaction Amount
                </Text>
                <Text
                  style={[
                    styles.label,
                    {
                      color: Colors.Black,
                      fontWeight: '700',
                    },
                  ]}>
                  ₹ {GetEnachResponseData?.enachAmount}
                </Text>
              </View>
            </Card>
            <Card paddingVeritcal={20}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: Colors.TextInputColor,
                    },
                  ]}>
                  Transaction Status
                </Text>
                <Text
                  style={[
                    styles.label,
                    {
                      color: Colors.Black,
                      fontWeight: '700',
                    },
                  ]}>
                  {GetEnachResponseData?.status}
                </Text>
              </View>
            </Card>
          </View>
        )}
      {
        isNachReactivation ? null :
          isChanged ? null :
            GetRepaymemtDetailsData?.nachSuccessFlag
            &&
            (
              <View style={{ marginBottom: 15 }}>
                <Button
                  text={'Next'}
                  onPress={() => {
                    navigation.navigate('KFS');
                    // navigation.navigate('LoanAgreement');
                  }}
                  active
                />
              </View>
            )}

      {
        isNachReactivation &&
        <Button
          text={'Back to NACH Reactivation'}
          onPress={() => {
            navigation.navigate('NactReactivationStack', { screen: 'NachReactivation' })
            // navigation.navigate('LoanAgreement');
          }}
          active
        />}
      {
        !isNachReactivation &&
        <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />}
    </WaveBackground>
  );
};

export default RepaymentDetails;