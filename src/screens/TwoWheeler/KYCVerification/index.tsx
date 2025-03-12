import React, { FC, useCallback, useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View, Modal, Text, Image } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCKYCData } from 'context/useCKYCData';
import {
  useGetAadharDetailsByOTP,
  useGetAadharOTP,
  useGetExistingAadharDetails,
  useGetCKYC,
  useCKYCDetailsEditable
} from 'api/ReactQuery/TwoWheeler/AadharApi';
import {
  GetAadharDetailsByOTPRequest,
  GetAadharOTPRequest,
  CKYCDetailsEditableRequest
} from 'api/ReactQuery/TwoWheeler/AadharApi/types';
import {
  GetAadharFrontOCRRequest,
  GetAadharBackOCRRequest,
  SaveAadharDetailsRequest,
} from 'api/ReactQuery/TwoWheeler/OCR/types';
import {
  useGetAadharFrontOCR,
  useGetAadharBackOCR,
  useGetAadharDetails,
  useSaveAadharDetails,
} from 'api/ReactQuery/TwoWheeler/OCR';
import WaveBackground from 'components/WaveBackground';
import LabeledTextInput from 'components/LabeledTextInput';
import LabeledRadioButtonGroup from 'components/RadioButtonGroup';
import Icon from 'components/Icon';
import { ErrorObject } from 'config/Types';
import Colors from 'config/Colors';
import { useApplicantDetails } from 'context/useApplicantDetails';
import useActive from 'hooks/useActive';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import styles from './styles';
import useSelectImage from 'hooks/useSelectImage';
import convertImageFileToBase64 from 'config/Functions/ConvertImageToBase64';
import CaptureImage from 'config/Functions/CaptureImage';
import useFontNormalise from 'hooks/useFontNormalise';
import { useDelete, useGetLead, useGetPincode } from 'api/ReactQuery/TwoWheeler/Lead';
import LabeledDropdown from 'components/LabeledDropdown';

import LoanSummaryButton from 'components/LoanSummaryButton';
import Button from 'components/Button';
import { usedViewStatus } from 'context/useViewStatus';
import useShowFlashMessage from 'hooks/useShowFlashMessage';

type KYCVerificationNavigationProp = StackNavigationProp<
  RootStackParamList,
  'KYCVerification'
>;
type KYCVerificationRouteProp = RouteProp<
  RootStackParamList,
  'KYCVerification'
>;

interface KYCVerificationScreenProps {
  navigation: KYCVerificationNavigationProp;
  route: KYCVerificationRouteProp;
}

const KYCVerification: FC<KYCVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const { applicantId, aadharNumber, isMainApplicant, guarantorId } =
    useApplicantDetails();

  const [isError, setIsError] = useState<ErrorObject[]>([]);

  type AadharDocType = 'aadhar front' | 'aadhar back' | 'CKYC';

  const [name, setName] = useState<string>('');
  const [selectedAadharAuthentication, setSelectedAadharAuthentication] =
    useState<string>('');
  const [dateofbirth, setDateofBirth] = useState<string>('');
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [selectingCalendar, setSelectingCalendar] = useState<boolean>(false);
  const [addressLine1, setAddressLine1] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>('');
  const [landMark, setLandMark] = useState<string>('');
  const [AadharNumber, setAadharNumber] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');
  const [otp, setOTP] = useState<string>('');
  const [docType, setDocType] = useState<AadharDocType>('aadhar front');
  const [selectedImageSelection, setSelectedImageSelection] = useState<
    'upload' | 'capture' | null
  >(null);
  const [aadharDocType, setAadharDocType] = useState<any>('');

  const [aadharFrontImagePath, setAadharFrontImagePath] = useState<string>('');
  const [aadharBackImagePath, setAadharBackImagePath] = useState<string>('');
  const [aadharcKycPath, setAadharcKycPath] = useState<string>('');

  const [aadharFrontImageBase64, setAadharFrontImageBase64] =
    useState<string>('');
  const [aadharBackImageBase64, setAadharBackImageBase64] =
    useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [isCkycViewOnly, setIsCkycViewOnly] = useState<boolean>(false);
  const [cityCode, setCityCode] = useState<string>('');
  const [stateCode, setStateCode] = useState<string>('');
  const [postOffice, setPostOffice] = useState<string>('');
  const [aadharFrontImageType, setAadharFrontImageType] = useState<
    'jpg' | 'png'
  >('jpg');
  const [aadharBackImageType, setAadharBackImageType] = useState<'jpg' | 'png'>(
    'jpg',
  );
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [postOfficeId, setPostOfficeId] = useState<string>('');
  const [dateOfBirthForCalendar, setDateofBirthForCalendar] = useState<any>('');
  const [tempdateOfBirth, setTempDateOfBirth] = useState<string>('');
  const { CKYCData } = useCKYCData();
  const { useViewStatus } = usedViewStatus();

  // console.log("ckkkkkkkk",CKYCData);

  const moment = require('moment');
  const dobFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY/MM/DD', 'YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY'];

  function convertDateFormat(inputDate) {
    // Use Moment.js to parse the input date
    const parsedDate = moment(inputDate, ['DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD'], true);

    // Check if the parsed date is valid
    if (parsedDate.isValid()) {
      // Format the date as "dd-mm-yyyy"
      const formattedDate = parsedDate.format('DD-MM-YYYY');
      return formattedDate;
    } else {
      // Handle invalid date formats
      console.error('Invalid date format');
      return null;
    }
  }

  function dateRangeCheckDOB(dob: any) {

    const currentDate = moment(new Date(), 'DD-MM-YYYY');
    const eighteenYearsAgoMoment = moment(currentDate).subtract(18, 'years').format('DD-MM-YYYY')
    const sixtenYearsAgo = moment(currentDate).subtract(67, 'years').format('DD-MM-YYYY')

    const parseDate = (dateString: any) => {
      const [day, month, year] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    };
    const startDate = parseDate(sixtenYearsAgo);
    const endDate = parseDate(eighteenYearsAgoMoment);
    const dateToCheck = parseDate(dob);

    if (dateToCheck >= startDate && dateToCheck <= endDate) {
      setDateofBirth(convertDateFormat(dob) || '');
      setTempDateOfBirth(convertDateFormat(dob) || '');
    } else {
      useShowFlashMessage('warning', "Date of birth exceeding the Limit");
      setDateofBirth('');
      setTempDateOfBirth('');
    }
  }


  const [GetLead, { data: GetLeadData, isLoading: GetLeadDataIsLoading }] =
    useGetLead(
      `${isMainApplicant ? applicantId : guarantorId}&applicantType=${isMainApplicant ? 'mainApplicant' : 'guarantor'
      }`,
    );

  const OCRRef = useRef<View & { fadeIn: Function; fadeOut: Function }>(null);
  const PANnumberRef = useRef<View & { fadeIn: Function; fadeOut: Function }>(
    null,
  );

  const GetAadharOTPGetExistingAadharDetailsCommonRequest: GetAadharOTPRequest =
  {
    appId: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    aadhaarNo: aadharNumber || String(GetLeadData?.aadharNo),
  };

  const [
    GetAadharOTP,
    { data: GetAadharOTPData, isLoading: GetAadharOTPIsLoading },
  ] = useGetAadharOTP(GetAadharOTPGetExistingAadharDetailsCommonRequest);

  const GetAadharDetailsByOTPRequest: GetAadharDetailsByOTPRequest = {
    appId: isMainApplicant ? applicantId : guarantorId,
    aadhaarNo: aadharNumber || String(GetLeadData?.aadharNo),
    otp,
    requestId: GetAadharOTPData?.requestId || '',
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
  };

  const GetAadharFrontOCRRequest: GetAadharFrontOCRRequest = {
    base64value: aadharFrontImageBase64,
    doctype: 'addhar front',
    appId: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    imageType: 'jpg',
  };

  const GetAadharBackOCRRequest: GetAadharBackOCRRequest = {
    base64value: aadharBackImageBase64,
    doctype: 'addhar back',
    appId: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    imageType: 'jpg',
  };

  const SaveAadharDetailsRequest: SaveAadharDetailsRequest = {
    appId: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    aadhaarNumber: AadharNumber,
    verifyBy:
      selectedAadharAuthentication === 'OCR'
        ? 'OCR'
        : selectedAadharAuthentication === 'OTP'
          ? 'OTP'
          : 'CKYC',

    aadhaarGender: selectedGender,
    // aadhaarDataSource:
    //   selectedAadharAuthentication === 'OCR'
    //     ? 'OCR'
    //     : selectedAadharAuthentication === 'OTP'
    //     ? 'OTP'
    //     : 'CKYC',
    // aadhaarVerifiedStatus: false,
    aadhaarAddressLine1: addressLine1,
    aadhaarAddressLine2: addressLine2,
    district: cityCode,
    state: stateCode,
    city: cityCode,
    aadharPostOffice: postOfficeId,
    aadhaarPincode: pinCode,
    landmark: landMark,
    aadhaarName: name,
    aadhaarDob: dateofbirth,
  };

  const CKYCDetailsEditableRequest: CKYCDetailsEditableRequest = {
    appId: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    isEdit: true,
    type: "Aadhaar"

  };

  const [
    GetAadharFrontOCR,
    { data: GetAadharFrontOCRData, isLoading: GetAadharFrontOCRIsLoading },
  ] = useGetAadharFrontOCR(GetAadharFrontOCRRequest);

  const [
    GetAadharBackOCR,
    { data: GetAadharBackOCRData, isLoading: GetAadharBackOCRIsLoading },
  ] = useGetAadharBackOCR(GetAadharBackOCRRequest);

  const [
    CKYCDetailsEditable,
    { data: CKYCDetailsEditableData, isLoading: CKYCDetailsEditableIsLoading },
  ] = useCKYCDetailsEditable(CKYCDetailsEditableRequest);

  const [
    GetAadharDetails,
    { data: GetAadharDetailsData, isLoading: GetAadharDetailsIsLoading },
  ] = useGetAadharDetails({
    applicationId: isMainApplicant ? applicantId : guarantorId,
    type: isMainApplicant ? 'mainApplicant' : 'guarantor',
  });

  const [
    GetCKYCDetails,
    { data: GetCKYCDetailsData, isLoading: GetCKYCDetailsIsLoading },
  ] = useGetCKYC(`${isMainApplicant ? applicantId : guarantorId}/${isMainApplicant ? 'mainApplicant' : 'guarantor'}`);


  const [
    GetExistingAadharDetails,
    { data: GetExistingAadharDetailsData, isLoading: GetExistingAadharDetailsIsLoading },
  ] = useGetExistingAadharDetails(
    GetAadharOTPGetExistingAadharDetailsCommonRequest,
  );

  const [
    DeleteAadharBack,
    { data: DeleteAadharBackData, isLoading: DeleteAadharBackIsLoading },
  ] = useDelete(
    `appId=${isMainApplicant ? applicantId : guarantorId
    }&type=aadharBack&applicantType=${isMainApplicant ? 'mainApplicant' : 'guarantor'
    }`,
  );

  const [
    DeleteAadharFront,
    { data: DeleteAadharFrontData, isLoading: DeleteAadharFrontIsLoading },
  ] = useDelete(
    `appId=${isMainApplicant ? applicantId : guarantorId
    }&type=aadharFront&applicantType=${isMainApplicant ? 'mainApplicant' : 'guarantor'
    }`,
  );

  const [
    DeleteCKYC,
    { data: DeleteCKYCData, isLoading: DeleteCKYCIsLoading },
  ] = useDelete(
    `appId=${isMainApplicant ? applicantId : guarantorId
    }&type=CKYCImage&applicantType=${isMainApplicant ? 'mainApplicant' : 'guarantor'
    }`,
  );

  const [
    DeleteRadioButton,
    { data: DeleteRadioButtonData, isLoading: DeleteRadioButtonIsLoading },
  ] = useDelete(
    `appId=${isMainApplicant ? applicantId : guarantorId
    }&type=${selectedAadharAuthentication}&applicantType=${isMainApplicant ? 'mainApplicant' : 'guarantor'
    }`,
  );

  useEffect(() => {
    if (CKYCDetailsEditableData) {
      GetAadharDetails.mutateAsync()
      console.log("CKYCDetailsEditableData", CKYCDetailsEditableData);

    }
  }, [CKYCDetailsEditableData])
console.log(" useViewStatusjjjjjj ", useViewStatus?.isFreeze );

  useEffect(() => {
    if (GetExistingAadharDetailsData) {
      if (GetExistingAadharDetailsData.isAadhaarAlreadyExists) {
        setAadharNumber(GetExistingAadharDetailsData.aadhaarNo || '');
        setName(GetExistingAadharDetailsData.aadhaarName || '');

        const aadharByOTPDate = moment(GetExistingAadharDetailsData.aadhaarDob, dobFormats, true).format('DD/MM/YYYY')
        var dateComponents = (aadharByOTPDate).split('/');
        var outputDate = dateComponents[0] + '-' + dateComponents[1] + '-' + dateComponents[2];
        if (GetExistingAadharDetailsData?.aadhaarDob) {
          dateRangeCheckDOB(outputDate)
        }

        // setTempDateOfBirth(convertDateFormat(GetExistingAadharDetailsData.aadhaarDob) || '');
        // setDateofBirth(convertDateFormat(GetExistingAadharDetailsData.aadhaarDob) || '');

        setAddressLine1(GetExistingAadharDetailsData.aadhaarAddressLine1 || '');
        setAddressLine2(GetExistingAadharDetailsData.aadhaarAddressLine2 || '');
        setCity(GetExistingAadharDetailsData.city || '');
        setState(GetExistingAadharDetailsData.state || '');
        setPinCode(GetExistingAadharDetailsData.aadhaarPincode || '');
        setDistrict(GetExistingAadharDetailsData.district || '');
        setLandMark(GetExistingAadharDetailsData.landmark || '');
        setAadharFrontImagePath(
          GetExistingAadharDetailsData.aadhaarOcrFrontFilePath || '',
        );
        setAadharBackImagePath(
          GetExistingAadharDetailsData.aadhaarOcrBackFilePath || '',
        );
      }
    }
  }, [GetExistingAadharDetailsData]);

  const [
    GetAadharDetailsByOTP,
    {
      data: GetAadharDetailsByOTPData,
      isLoading: GetAadharDetailsByOTPIsLoading,
    },
  ] = useGetAadharDetailsByOTP(GetAadharDetailsByOTPRequest);

  const [
    SaveAadharDetails,
    { data: SaveAadharDetailsData, isLoading: SaveAadharDetailsIsLoading },
  ] = useSaveAadharDetails(SaveAadharDetailsRequest);

  const [GetPincode, { data: GetPincodeData, isLoading: GetPincodeIsLoading }] =
    useGetPincode(pinCode);

  useEffect(() => {
    if (SaveAadharDetailsData) {
      setIsChanged(false);
      navigation.navigate('PhotoVerification');
    }
  }, [SaveAadharDetailsData]);
// console.log("iiiiiii",isChanged);

  useEffect(() => {
    console.log("mmjjjhjhhh");
    
    if (pinCode.length === 6) {
      GetPincode.mutateAsync();
    } else {
      setCity('');
      setCityCode('');
      setDistrict('');
      setState('');
      setStateCode('');
    }
  }, [pinCode]);

  useEffect(() => {
    if (GetPincodeData) {
      console.log("GetPincodeData",GetPincodeData);
    
      setCity(GetPincodeData.city || '');
      setCityCode(GetPincodeData.cityCode || '');
      setDistrict(GetPincodeData.city || '');
      setState(GetPincodeData.state || '');
      setStateCode(GetPincodeData.stateCode || '');
    }
  }, [GetPincodeData]);

  useFocusEffect(
    useCallback(() => {
      if (applicantId && useViewStatus) {
        GetAadharDetailsByOTP.reset();
        GetAadharDetails.mutateAsync();
        !aadharNumber && GetLead.mutateAsync();
      }
    }, []),
  );
  useEffect(() => {
    if (useViewStatus) {

      setIsViewOnly(
        useViewStatus?.isSalesReject ? true :
          useViewStatus?.isSubmitToCreditFreeze ? true :
            useViewStatus?.isFreeze ? true : false,
      );
      setIsCkycViewOnly(
        isMainApplicant ?
          useViewStatus?.mainApplicant && useViewStatus?.mainApplicant[0]?.isEditableAadhaar || false
          : useViewStatus?.mainApplicant && useViewStatus?.mainApplicant[0]?.isEditableAadhaar || false

      )
    }
  }, []);


  useEffect(() => {
    if (GetAadharDetailsByOTPData) {
      console.log("GetAadharDetailsByOTPData", GetAadharDetailsByOTPData?.aadhaarDob);


      setAadharNumber(GetAadharDetailsByOTPData.aadhaarNo || '');
      setName(GetAadharDetailsByOTPData.aadhaarName || '');

      const aadharByOTPDate = moment(GetAadharDetailsByOTPData?.aadhaarDob, dobFormats, true).format('DD/MM/YYYY')
      var dateComponents = (aadharByOTPDate).split('/');
      var outputDate = dateComponents[0] + '-' + dateComponents[1] + '-' + dateComponents[2];
      if (GetAadharDetailsByOTPData?.aadhaarDob) {
        dateRangeCheckDOB(outputDate)
      }
      // setTempDateOfBirth(GetAadharDetailsByOTPData.aadhaarDob || '');
      // setDateofBirth(convertDateFormat(GetAadharDetailsByOTPData.aadhaarDob) || '');

      setAddressLine1(GetAadharDetailsByOTPData.aadhaarAddressLine1 || '');
      setAddressLine2(GetAadharDetailsByOTPData.aadhaarAddressLine2 || '');
      setCity(GetAadharDetailsByOTPData.city || '');
      setState(GetAadharDetailsByOTPData.state || '');
      setPinCode(GetAadharDetailsByOTPData.aadhaarPincode || '');
      setDistrict(GetAadharDetailsByOTPData.district || '');
      setLandMark(GetAadharDetailsByOTPData.landmark || '');
      setAadharFrontImagePath(
        GetAadharDetailsByOTPData.aadhaarOcrFrontFilePath || '',
      );
      setAadharBackImagePath(
        GetAadharDetailsByOTPData.aadhaarOcrBackFilePath || '',
      );
    }
  }, [GetAadharDetailsByOTPData]);

  useEffect(() => {
    if (selectedAadharAuthentication !== '') {
      if (selectedAadharAuthentication === 'OTP') {
        setSelectedImageSelection(null);
        PANnumberRef.current?.fadeIn(500);
      } else {
        OCRRef.current?.fadeIn(500);
      }
    }
  }, [selectedAadharAuthentication]);

  const ResetAadharFrontData = () => {
    setAadharFrontImagePath('');
    setName('');
    setDateofBirth('');
    setTempDateOfBirth('');
    setAadharNumber('');
  };

  const ResetAadharBackData = () => {
    setAadharBackImagePath('');
    setAddressLine1('');
    setAddressLine2('');
    setLandMark('');
    setPinCode('');
    setCity('');
    setState('');
    setDistrict('');
  };

  const ResetkycData = () => {
    // setName('');
    setAadharcKycPath('')

  };

  useEffect(() => {
    if (GetAadharDetailsData && GetAadharDetailsData) {
      console.log("GetAadharDetailsData1111", GetAadharDetailsData);

      setAadharNumber(GetAadharDetailsData.aadhaarNumber || '');
      setName(GetAadharDetailsData.aadhaarName || '');
      setAadharDocType(GetAadharDetailsData?.ckycImageType)

      const aadharByOTPDate = moment(GetAadharDetailsData.aadhaarDob, dobFormats, true).format('DD/MM/YYYY')
      var dateComponents = (aadharByOTPDate).split('/');
      var outputDate = dateComponents[0] + '-' + dateComponents[1] + '-' + dateComponents[2];
      if (GetAadharDetailsData?.aadhaarDob) {
        dateRangeCheckDOB(outputDate)
      }

      // setTempDateOfBirth(convertDateFormat(GetAadharDetailsData.aadhaarDob) || '');
      // setDateofBirth(convertDateFormat(GetAadharDetailsData.aadhaarDob) || '');


      setAddressLine1(GetAadharDetailsData.aadhaarAddressLine1 || '');
      setAddressLine2(GetAadharDetailsData.aadhaarAddressLine2 || '');
      setCity(GetAadharDetailsData.city || '');
      setState(GetAadharDetailsData.state || '');
      setPinCode(GetAadharDetailsData.aadhaarPincode || '');
      // setPostOffice(GetAadharDetailsData.postOffice || '');
      setDistrict(GetAadharDetailsData.district || '');
      setLandMark(GetAadharDetailsData.landmark || '');

      setAadharFrontImagePath(
        GetAadharDetailsData.aadhaarOcrFrontFilePath || '',
      );
      // GetAadharDetailsData.aadhaarOcrFrontFilePath && setSelectedImageSelection('upload');
      setAadharBackImagePath(GetAadharDetailsData.aadhaarOcrBackFilePath || '');
      setAadharcKycPath(GetAadharDetailsData.aadhaarFilePath || '');
      setSelectedAadharAuthentication(
        GetAadharDetailsData.aadhaarDataSource == 'OCR'
          ? 'OCR'
          : GetAadharDetailsData.aadhaarDataSource == 'OTP'
            ? 'OTP'
            : GetAadharDetailsData.aadhaarDataSource == 'CKYC'
              ? 'CKYC'
              : '',
      );
    }
  }, [GetAadharDetailsData]);

  useEffect(() => {
    if (selectedAadharAuthentication && isChanged) {
      setAadharNumber('');
      setName('');
      setDateofBirth('');
      setTempDateOfBirth('');
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setState('');
      setPinCode('');
      setPostOffice('');
      setDistrict('');
      setLandMark('');
      setOTP('');
      setAadharFrontImagePath('');
      // aadhaarOcrFrontFilePath && setSelectedImageSelection('upload');
      setAadharBackImagePath('');
    }
  }, [selectedAadharAuthentication]);

  useEffect(() => {
    if (GetAadharDetailsData && GetPincodeData) {
      console.log("mjjjbbbb");
      
      let findPostOffice = GetPincodeData?.postOfficeList?.find(
        item => item.postOfficeId === GetAadharDetailsData.aadharPostOffice,
      )?.postOffice;
      findPostOffice && setPostOffice(findPostOffice);
    }
  }, [GetAadharDetailsData, GetPincodeData]);

  useEffect(() => {
    if (GetAadharFrontOCRData) {
      console.log("GetAadharFrontOCRData", GetAadharFrontOCRData);

      var dateComponents = GetAadharFrontOCRData?.dateOfBirth?.split('/');
      var outputDate = (GetAadharFrontOCRData?.dateOfBirth) ? dateComponents[0] + '-' + dateComponents[1] + '-' + dateComponents[2] : ''
      if (GetAadharFrontOCRData?.dateOfBirth) {
        dateRangeCheckDOB(outputDate)
      }
      setName(GetAadharFrontOCRData.addharName || '');
      // setTempDateOfBirth(convertDateFormat(outputDate) || '');
      // setDateofBirth(convertDateFormat(outputDate) || '');

      setAadharNumber(GetAadharFrontOCRData.addharNo || '');
    }
  }, [GetAadharFrontOCRData]);

  useEffect(() => {
    if (GetAadharBackOCRData) {
      setAddressLine1(GetAadharBackOCRData.addresdetails.line1 || '');
      setAddressLine2(GetAadharBackOCRData.addresdetails.line2 || '');
      setLandMark(GetAadharBackOCRData.addresdetails.line2 || '');
      setPinCode(GetAadharBackOCRData.addresdetails.pin || '');
      setCity(GetAadharBackOCRData.addresdetails.city || '');
      setState(GetAadharBackOCRData.addresdetails.state || '');
      setDistrict(GetAadharBackOCRData.addresdetails.district || '');
    }
  }, [GetAadharBackOCRData]);

  useEffect(() => {
    if (aadharFrontImageBase64) {
      GetAadharFrontOCR.mutateAsync();
    }
  }, [aadharFrontImageBase64]);

  useEffect(() => {
    if (aadharBackImageBase64) {
      GetAadharBackOCR.mutateAsync();
    }
  }, [aadharBackImageBase64]);

  useEffect(() => {
    if (selectedImageSelection !== null) {
      setAadharBackImagePath('');
      setAadharFrontImagePath('');
      setAadharFrontImageBase64('');
      setAadharBackImageBase64('');
    }
  }, [selectedImageSelection]);

  // useEffect(() => {

  //   setAadharBackImagePath('');
  //   setAadharFrontImagePath('');
  //   setAadharFrontImageBase64('');
  //   setAadharBackImageBase64('');
  // }, [selectedAadharAuthentication]);

  useEffect(() => {
    if (postOffice) {
      let findPostOffice = GetPincodeData?.postOfficeList?.find(
        item => item.postOffice === postOffice,
      )?.postOfficeId;
      findPostOffice && setPostOfficeId(findPostOffice);
    }
  }, [postOffice]);

  const handleOnPress = (docType: 'aadhar front' | 'aadhar back') => {
    const callback = (response: any, path: any, name: string) => {
      if (response) {
        if (docType === 'aadhar front') {
          setDocType('aadhar front');

          setAadharFrontImagePath(response[0]?.fileCopyUri);
          if (
            String(response[0]?.type).includes('jpg') ||
            String(response[0]?.type).includes('jpeg')
          ) {
            setAadharFrontImageType('jpg');
          } else {
            setAadharFrontImageType('png');
          }

          convertImageFileToBase64(response[0]?.fileCopyUri)
            .then(base64Data => {
              if (base64Data) {
                setAadharFrontImageBase64(base64Data);
              }
            })
            .catch(error => {
              useShowFlashMessage('warning', error);
            });
        } else {
          setDocType('aadhar back');
          setAadharBackImagePath(response[0]?.fileCopyUri);
          if (
            String(response[0]?.type).includes('jpg') ||
            String(response[0]?.type).includes('jpeg')
          ) {
            setAadharBackImageType('jpg');
          } else {
            setAadharBackImageType('png');
          }
          convertImageFileToBase64(response[0]?.fileCopyUri)
            .then(base64Data => {
              if (base64Data) {
                setAadharBackImageBase64(base64Data);
              }
            })
            .catch(error => {
              console.error('Error converting image file to base64:', error);
            });
        }
      }
    };
    useSelectImage(callback, 'onlypickimage', setSelectedImageSelection);
  };

  const handleCapture = async (docType: 'aadhar front' | 'aadhar back') => {
    try {
      const capturedImageUri = await CaptureImage();
      if (capturedImageUri) {
        if (docType == 'aadhar front') {
          setAadharFrontImagePath(capturedImageUri);
          setAadharFrontImageType('jpg');
          convertImageFileToBase64(capturedImageUri)
            .then(base64Data => {
              if (base64Data) {
                setAadharFrontImageBase64(base64Data);
              }
            })
            .catch(error => {
              console.error('Error converting image file to base64:', error);
            });
        } else {
          setAadharBackImagePath(capturedImageUri);
          setAadharBackImageType('jpg');
          convertImageFileToBase64(capturedImageUri)
            .then(base64Data => {
              if (base64Data) {
                setAadharBackImageBase64(base64Data);
              }
            })
            .catch(error => {
              console.error('Error converting image file to base64:', error);
            });
        }
      }
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  };

  type ImageSelectionButtonsTypes = {
    buttonType: 'upload' | 'capture';
    docType: 'aadhar front' | 'aadhar back';
  };

  const ImageSelectionButtons = ({
    buttonType,
    docType,
  }: ImageSelectionButtonsTypes) => (
    <View>
      <TouchableOpacity
        style={{
          backgroundColor:
            buttonType === 'capture' ? Colors.CaptureLight : Colors.UploadLight,
          paddingVertical: 40,
          paddingHorizontal: 30,
          borderRadius: 7,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          if (buttonType === 'upload') {
            handleOnPress(docType);
          } else {
            handleCapture(docType);
          }
        }}>
        <Icon name={buttonType} />
        <Text style={styles.ButtonText}>
          {docType === 'aadhar front' ? 'Aadhar Front' : 'Aadhar Back'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  type RenderImageTypes = {
    docType: AadharDocType;
    url?: string;
  };
  // console.log("isViewOnly",isViewOnly);

  const RenderImage = ({ docType, url }: RenderImageTypes) => {
    // console.log("jjjjjj", url)

    return (
      <View>
        <Image
          source={{
            uri: url,
          }}
          style={{
            width: useFontNormalise(120),
            height: useFontNormalise(110),
            borderRadius: 10,
          }}
        />

        {!isViewOnly && url !== '' &&
          (
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -9,
                right: -5,
                backgroundColor: 'transparent',
                alignSelf: 'flex-end',
              }}
              onPress={() => {
                if (docType === 'aadhar front') {
                  ResetAadharFrontData();
                  DeleteAadharFront.mutateAsync();
                } else if (docType === 'aadhar back') {
                  ResetAadharBackData();
                  DeleteAadharBack.mutateAsync();
                }
                else if (docType === 'CKYC' &&  (GetAadharDetailsData?.isEdited == true && GetAadharDetailsData?.aadhaarVerifiedStatus == false)) {
                  ResetkycData();
                  DeleteCKYC.mutateAsync();
                  console.log("deeeeee");

                }
                else {
                  console.log("eeeee");

                }
              }}>
              <Icon name="close" />
            </TouchableOpacity>
          )}
      </View>
    )
  };

  type RenderPDFTypes = {
    url: string;
    docType: string;
    isNonDeletable?: boolean;
    fileName?: string;
    isMandatory?: 'Y' | 'N';
  };

  const RenderPDF = ({
    url,
    docType,
    fileName,
    isNonDeletable,
    isMandatory,
  }: RenderPDFTypes) => (
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
      }}
    >
      {!isViewOnly && url !== '' && (
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
            if (docType === 'aadhar front') {
              ResetAadharFrontData();
              DeleteAadharFront.mutateAsync();
            } else if (docType === 'aadhar back') {
              ResetAadharBackData();
              DeleteAadharBack.mutateAsync();
            }
            else if (docType === 'CKYC' && GetAadharDetailsData?.isEdited) {
              ResetkycData();
              DeleteCKYC.mutateAsync();
              console.log("deeeeee");

            }
            else {
              console.log("eeeee");

            }
          }}>
          <Icon name="close" />
        </TouchableOpacity>
      )}
      <Icon name="prePdf" />
    </View>
  );

  useEffect(() => {
    if (selectedAadharAuthentication === 'OTP' && isChanged) {
      GetExistingAadharDetails.mutateAsync();
      DeleteRadioButton.mutateAsync()
    } else if (selectedAadharAuthentication === 'CKYC' && isChanged) {
      GetCKYCDetails.mutateAsync();
      DeleteRadioButton.mutateAsync()
    }
    else if (selectedAadharAuthentication === 'OCR' && isChanged) {
      // GetAadharDetails.mutateAsync();
      DeleteRadioButton.mutateAsync()

    }
  }, [selectedAadharAuthentication]);

  useEffect(() => {
    if (GetCKYCDetailsData?.errorFlag == false) {
      
      console.log("GetCKYCDetailsData", JSON.stringify(GetCKYCDetailsData, null, 4));
      setAadharNumber(GetCKYCDetailsData.aadhaarNumber || '');
      setName(GetCKYCDetailsData.aadhaarName || '');
      const aadharByOTPDate = moment(GetCKYCDetailsData.aadhaarDob, dobFormats, true).format('DD/MM/YYYY')
      var dateComponents = (aadharByOTPDate).split('/');
      var outputDate = dateComponents[0] + '-' + dateComponents[1] + '-' + dateComponents[2];
      if (GetCKYCDetailsData?.aadhaarDob) {
        dateRangeCheckDOB(outputDate)
      }

      // setTempDateOfBirth(convertDateFormat(GetCKYCDetailsData.aadhaarDob) || '');
      // setDateofBirth(convertDateFormat(GetCKYCDetailsData.aadhaarDob) || '');

      setAadharcKycPath(GetCKYCDetailsData.aadhaarFilePath || '');
      setAddressLine1(GetCKYCDetailsData.aadhaarAddressLine1 || '');
      setAddressLine2(GetCKYCDetailsData.aadhaarAddressLine2 || '');
      setCity(GetCKYCDetailsData.city || '');
      setState(GetCKYCDetailsData.state || '');
      setPinCode(GetCKYCDetailsData.aadhaarPincode || '');
      // setPostOffice(GetCKYCDetailsData.postOffice || '');
      setDistrict(GetCKYCDetailsData.district || '');
      setLandMark(GetCKYCDetailsData.landmark || '');

      setAadharFrontImagePath(
        GetCKYCDetailsData.aadhaarOcrFrontFilePath || '',
      );
      // GetCKYCDetailsData.aadhaarOcrFrontFilePath && setSelectedImageSelection('upload');
      setAadharBackImagePath(GetCKYCDetailsData.aadhaarOcrBackFilePath || '');
      setSelectedAadharAuthentication(
        GetCKYCDetailsData.aadhaarDataSource == 'OCR'
          ? 'OCR'
          : GetCKYCDetailsData.aadhaarDataSource == 'OTP'
            ? 'OTP'
            : GetCKYCDetailsData.aadhaarDataSource == 'CKYC'
              ? 'CKYC'
              : '',
      )
    }
    else if (GetCKYCDetailsData?.errorFlag){
      useShowFlashMessage('warning', "CKYC data not found for this app id");
      setSelectedAadharAuthentication('')
    }
  }, [GetCKYCDetailsData]);

  useEffect(() => {
    if (GetExistingAadharDetailsData?.isAadhaarAlreadyExists === false) {
      setSelectedAadharAuthentication('OTP');
      GetAadharOTP.mutateAsync();
    }
  }, [GetExistingAadharDetailsData]);

  const handleSave = () => {
    if (isChanged) {
      if (AadharNumber.includes('XX')) {
        useShowFlashMessage(
          'warning',
          'Please correct your Aadhaar Number before saving!',
        );
      } else {
        SaveAadharDetails.mutateAsync();
      }
    } else {
      setIsChanged(false)
      navigation.navigate('PhotoVerification');
    }
  };

  const PostOffceList: string[] = GetPincodeData
    ? GetPincodeData.postOfficeList.map(item => item.postOffice)
    : [];

  const ondobChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate =
      event?.type == 'set' ? selectedDate : dateOfBirthForCalendar;
    setSelectingCalendar(false);
    event.type == 'set' ? setTempDateOfBirth(event.type == 'set' ? convertDateFormat(currentDate) : '') : null
    event.type == 'set' ? setDateofBirth(event.type == 'set' ? convertDateFormat(currentDate) : '') : null
    event.type == 'set' ? setDateofBirthForCalendar(event.type == 'set' ? currentDate : '') : null
    setIsChanged(true);
  };

  const currentDate = new Date();
  const eighteenYearsAgo = moment(currentDate).subtract(18, 'years').toDate();
  const sixtenYearsAgo = moment(currentDate).subtract(67, 'years').toDate();

  useEffect(() => {
    const eighteenYearsAgoMoment = moment(currentDate)
      .subtract(18, 'years')
      .format('DD-MM-YYYY');
    if (
      dateofbirth !== '' && isChanged &&
      moment(dateofbirth).isAfter(eighteenYearsAgoMoment)
    ) {
      // setDateofBirth(moment(tempdateOfBirth).format('DD-MM-YYYY') || '');
      setDateofBirth(convertDateFormat(tempdateOfBirth))

    }
  }, [dateofbirth]);

  const activeArray = [
    AadharNumber,
    dateofbirth,
    addressLine1,
    addressLine2,
    landMark,
    district,
    state,
    city,
    pinCode,
    postOffice,
    selectedAadharAuthentication
  ];

  let isActive: boolean = useActive(activeArray);
  let hasError: boolean = isError.some(error => error.hasError === true);
  // console.log("isCkycViewOnly", isViewOnly, GetAadharDetailsData?.isEdited);

  return (
    <WaveBackground
      loading={[
        GetAadharOTPIsLoading,
        GetAadharDetailsByOTPIsLoading,
        GetExistingAadharDetailsIsLoading,
        GetAadharFrontOCRIsLoading,
        GetAadharBackOCRIsLoading,
        GetAadharDetailsIsLoading,
        SaveAadharDetailsIsLoading,
        GetLeadDataIsLoading,
        GetPincodeIsLoading,
        DeleteCKYCIsLoading,
        DeleteRadioButtonIsLoading,
        DeleteAadharBackIsLoading,
        DeleteAadharFrontIsLoading,
        GetCKYCDetailsIsLoading,
        CKYCDetailsEditableIsLoading
      ]}
      title={'KYC Verification'}>
      {selectingCalendar && (
        <DateTimePicker
          testID="date"
          value={dateOfBirthForCalendar || new Date()}
          maximumDate={eighteenYearsAgo}
          minimumDate={sixtenYearsAgo}
          mode="date"
          onChange={ondobChange}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisibleModal}
        onRequestClose={() => { }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.TitleText]}>
              WARNING!!!
            </Text>
            <Text
              style={[
                styles.messageText,
              ]}>
              {` Are you sure? You want to modify ${selectedAadharAuthentication} information.`}
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity
                onPress={() => {
                  CKYCDetailsEditable.mutateAsync()
                  setIsVisibleModal(false)
                }}
                style={[
                  styles.Button,
                ]}>
                <Text
                  style={[
                    styles.SuccessText,
                  ]}>
                  YES
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setIsVisibleModal(false)}
                style={[
                  styles.Button,
                ]}>
                <Text
                  style={[
                    styles.CloseText,
                  ]}>
                  NO
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {
      (selectedAadharAuthentication == 'CKYC' || selectedAadharAuthentication == 'OTP') &&
        <Button
          text={`Edit ${selectedAadharAuthentication}`}
          active={
            isViewOnly 
            ? !isViewOnly: 
             GetAadharDetailsData?.isEdited ? false : true
            }
          marginVertical={10}
          flexEnd
          // marginTop={30}
          halfSize
          onPress={() => {
            setIsVisibleModal(true)
          }}

        />} 

      <LabeledRadioButtonGroup
        heading={`To proceed with KYC Verification, select your preferred method ?`}
        options={['OTP', 'OCR', 'CKYC']}
        onChange={setSelectedAadharAuthentication}
        value={selectedAadharAuthentication}
        isChange={setIsChanged}
        mandatory
        disabled={
          GetAadharDetailsData?.isEdited == false && GetAadharDetailsData?.aadhaarVerifiedStatus === true ? true :
            isViewOnly
        }
      />

      {selectedAadharAuthentication === 'OTP' &&
        !GetAadharDetailsByOTPData &&
        GetExistingAadharDetailsData?.isAadhaarAlreadyExists === false 
        // aadharFrontImagePath === '' &&
        // aadharBackImagePath === '' 
        ? (
        <Animatable.View ref={PANnumberRef}>
          <LabeledTextInput
            label="Enter OTP"
            onChange={setOTP}
            defaultValue={otp}
            setErrorFlag={setIsError}
            IsErrorArray={isError}
            maxLength={6}
            isChange={setIsChanged}
            NumberPad
            mandatory
          />
          <Button
            text="Submit"
            active={otp.length === 6}
            marginVertical={10}
            marginTop={10}
            onPress={() => {
              GetAadharDetailsByOTP.mutateAsync();
            }}
          />
        </Animatable.View>
      ) : selectedAadharAuthentication === 'OCR' &&
        aadharFrontImagePath === '' ? (
        <Animatable.View ref={OCRRef}>
          <View
            style={{
              marginVertical: 10,
              width: '90%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.Upload,
                  paddingVertical: 10,
                  paddingHorizontal: 50,
                  borderRadius: 10,
                }}
                onPress={() => {
                  isViewOnly ? null : setSelectedImageSelection('upload');
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
                onPress={() => {
                  isViewOnly ? null : setSelectedImageSelection('capture');
                }}>
                <Icon name="capture" />
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      ) : (
        <></>
      )}

      {selectedAadharAuthentication === 'OCR' &&
        selectedImageSelection === 'capture' ? (
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            marginTop: 20,
            marginVertical: 10,
            paddingHorizontal: 5,
          }}>
          {aadharFrontImagePath !== '' ? (
            <RenderImage docType="aadhar front" />
          ) : (
            <ImageSelectionButtons
              buttonType="capture"
              docType="aadhar front"
            />
          )}
          {aadharBackImagePath !== '' ? (
            <RenderImage docType="aadhar back" />
          ) : (
            <ImageSelectionButtons buttonType="capture" docType="aadhar back" />
          )}
        </View>
      ) : selectedAadharAuthentication === 'OCR' &&
        selectedImageSelection === 'upload' ? (
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            marginTop: 20,
            marginVertical: 10,
            paddingHorizontal: 5,
          }}>
          {aadharFrontImagePath !== '' ? (
            <RenderImage docType="aadhar front" url={aadharFrontImagePath} />
          ) : (
            <ImageSelectionButtons buttonType="upload" docType="aadhar front" />
          )}
          {aadharBackImagePath !== '' ? (
            <RenderImage docType="aadhar back" url={aadharBackImagePath} />
          ) : (
            <ImageSelectionButtons buttonType="upload" docType="aadhar back" />
          )}
        </View>
      ) : (
        <></>
      )}

      {selectedAadharAuthentication === 'OCR' &&
        GetAadharDetailsData?.aadhaarOcrFrontFilePath !== '' &&
        (aadharFrontImagePath || aadharBackImagePath) &&
        selectedImageSelection === null &&
        GetAadharDetailsData?.aadhaarOcrBackFilePath !== '' && (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              marginVertical: 10,
              paddingHorizontal: 5,
            }}>
            {aadharFrontImagePath !== '' ? (
              <RenderImage docType="aadhar front" url={aadharFrontImagePath} />
            ) : (
              <ImageSelectionButtons
                buttonType="upload"
                docType="aadhar front"
              />
            )}
            {aadharBackImagePath !== '' ? (
              <RenderImage docType="aadhar back" url={aadharBackImagePath} />
            ) : (
              <ImageSelectionButtons
                buttonType="upload"
                docType="aadhar back"
              />
            )}
          </View>
        )}

      {
        // !(GetAadharDetailsData?.aadhaarFilePath == null ||
        //   GetAadharDetailsData?.aadhaarFilePath == undefined) &&
        //   GetAadharDetailsData?.aadhaarDataSource === 'CKYC' &&
        selectedAadharAuthentication == 'CKYC' && aadharcKycPath &&
        (

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
            }}>

            {
              aadharDocType == 'png' ?
                <RenderImage
                  docType="CKYC"
                  url={aadharcKycPath}
                />
                :
                <RenderPDF
                  url={aadharcKycPath}
                  docType={'CKYC'}
                  fileName='CKYC'

                />
            }

          </View>
        )}

      <LabeledTextInput
        label="Aadhaar Name"
        autoCapitalize="sentences"
        onChange={setName}
        defaultValue={name}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        // disabled={
        //   GetAadharDetailsData?.isEdited ? true :
        //     isCkycViewOnly ? !isCkycViewOnly :
        //       (isViewOnly ||
        //         GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
        //         GetAadharDetailsData?.aadhaarDataSource === 'OCR' ||
        //         GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        // }
        disabled={
          isViewOnly ? true :
            GetAadharDetailsData?.isEdited ? false :
              isCkycViewOnly ? !isCkycViewOnly :
                (CKYCData?.adharStatus ||
                  isViewOnly ||
                  GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
                  // GetAadharDetailsData?.aadhaarDataSource === 'OCR' ||
                  GetAadharDetailsData?.aadhaarDataSource === 'OTP'
                )
        }

      />

      <LabeledTextInput
        label="Aadhaar Number"
        onChange={setAadharNumber}
        defaultValue={AadharNumber}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        NumberPad
        // disabled={
        //   GetAadharDetailsData?.isEdited ? true :
        //   isCkycViewOnly
        //     ? !isCkycViewOnly :
        //     (isViewOnly ||
        //       GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
        //       GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        // }
        disabled={
          // CKYCData?.adharStatus ||
          isViewOnly ? true :
            GetAadharDetailsData?.isEdited ? false :
              isCkycViewOnly
                ? !isCkycViewOnly :
                (isViewOnly ||
                  GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
                  GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        }

        maxLength={12}
      />

      <View style={styles.dobContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              styles.labelText,
              { color: selectingCalendar ? Colors.Black : Colors.LabelGrey },
            ]}>
            {'DOB '}
          </Text>
          <Icon name="pointed-star" />
        </View>
        <TouchableOpacity
          style={[
            styles.inputbox,
            {
              marginTop: 10,
              borderColor: selectingCalendar ? Colors.Black : Colors.LightGrey,
            },
          ]}
          onPress={() => {
            setSelectingCalendar(true);
          }}
          // disabled={
          //   GetAadharDetailsData?.isEdited ? true :
          //   isCkycViewOnly ? !isCkycViewOnly : isViewOnly

          // }
          disabled={
            isViewOnly ? true :
              GetAadharDetailsData?.isEdited ? false :
                isCkycViewOnly ? !isCkycViewOnly :
                  (CKYCData?.adharStatus ||
                    isViewOnly ||
                    GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
                    GetAadharDetailsData?.aadhaarDataSource === 'OTP'
                  )
          }
        >
          <Text
            style={{
              color: dateofbirth ? Colors.Black : Colors.LabelGrey,
            }}>
            {dateofbirth}
          </Text>
        </TouchableOpacity>
      </View>

      <LabeledTextInput
        label="Address line 1"
        autoCapitalize="sentences"
        onChange={setAddressLine1}
        defaultValue={addressLine1}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        // disabled={
        //   GetAadharDetailsData?.isEdited ? true :
        //   isCkycViewOnly ? !isCkycViewOnly : isViewOnly
        //     // (
        //     //   isViewOnly ||
        //     //   GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
        //     //   GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        // }
        disabled={
          isViewOnly ? true :
            GetAadharDetailsData?.isEdited ? false :
              isCkycViewOnly ? !isCkycViewOnly :
                (CKYCData?.adharStatus ||
                  isViewOnly ||
                  GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
                  GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        }

      />

      <LabeledTextInput
        label="Address line 2"
        autoCapitalize="sentences"
        onChange={setAddressLine2}
        defaultValue={addressLine2}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        // disabled={
        //   GetAadharDetailsData?.isEdited ? true :
        //   isCkycViewOnly ? !isCkycViewOnly : isViewOnly
        //     // (
        //     //   isViewOnly ||
        //     //   GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
        //     //   GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        // }
        disabled={
          isViewOnly ? true :
            GetAadharDetailsData?.isEdited ? false :
              isCkycViewOnly ? !isCkycViewOnly :
                (CKYCData?.adharStatus ||
                  isViewOnly ||
                  GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
                  GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        }
      />

      <LabeledTextInput
        label="Landmark"
        autoCapitalize="sentences"
        onChange={setLandMark}
        defaultValue={landMark}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly ? true : GetAadharDetailsData?.isEdited ? false :
          isCkycViewOnly ? !isCkycViewOnly : isViewOnly}
      />

      <LabeledTextInput
        label="Pincode"
        maxLength={6}
        onChange={setPinCode}
        defaultValue={pinCode}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        NumberPad
        disabled={
          isViewOnly ? true :
            GetAadharDetailsData?.isEdited ? false :
              isCkycViewOnly ? !isCkycViewOnly : isViewOnly
          // (
          //   isViewOnly ||
          //   GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
          //   GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        }
      />


      <LabeledDropdown
        label="Post Office"
        defaultValue={postOffice}
        options={PostOffceList}
        setSelectedOption={setPostOffice}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly ? true : GetAadharDetailsData?.isEdited ? false :
          isCkycViewOnly ? !isCkycViewOnly : isViewOnly}
      />
      <LabeledTextInput
        label="City"
        autoCapitalize="sentences"
        onChange={setCity}
        defaultValue={city}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        disabled={

          GetPincodeData?.city ? true : false ||
            isViewOnly ? true :
            GetAadharDetailsData?.isEdited ? false :
              isCkycViewOnly ? !isCkycViewOnly : isViewOnly
          // (
          //   isViewOnly ||
          //   GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
          //   GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        }
      />

      <LabeledTextInput
        label="District"
        autoCapitalize="sentences"
        onChange={setDistrict}
        defaultValue={district}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        disabled={
          GetPincodeData?.city ? true : false ||
            isViewOnly ? true :

            GetAadharDetailsData?.isEdited ? false :
              isCkycViewOnly ? !isCkycViewOnly : isViewOnly
          // (
          //   isViewOnly ||
          //   GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
          //   GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        }
      />

      <LabeledTextInput
        label="State"
        autoCapitalize="sentences"
        onChange={setState}
        defaultValue={state}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        disabled={
          GetPincodeData?.state ? true : false ||
            isViewOnly ? true :
            GetAadharDetailsData?.isEdited ? false :
              isCkycViewOnly ? !isCkycViewOnly : isViewOnly
          //  (
          //   isViewOnly ||
          //   GetAadharDetailsByOTPData?.aadhaarNo !== undefined ||
          //   GetAadharDetailsData?.aadhaarDataSource === 'OTP')
        }
      />

      <Button
        text={isChanged ? 'Save' : 'Next'}
        active={isActive && !hasError}
        marginVertical={10}
        marginTop={30}
        onPress={handleSave}
      />
      <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />
    </WaveBackground>
  );
};
export default KYCVerification;
