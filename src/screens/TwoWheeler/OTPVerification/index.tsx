import React, { FC, useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { TouchableOpacity, TextInput, View, Text, Keyboard, PermissionsAndroid, DeviceEventEmitter } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LabelDropdown from 'components/LabelDropdown';
import WaveBackground from 'components/WaveBackground';
import Button from 'components/Button';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import styles from './styles';
import Colors from 'config/Colors';
import { useGenerateOTP, useValidateOTP, useSaveRelation } from 'api/ReactQuery/TwoWheeler/MobileOTP';
import {
  GenerateOTPRequest,
  ValidateOTPRequest,
  SaveRelationRequest
} from 'api/ReactQuery/TwoWheeler/MobileOTP/types';
import { useApplicantDetails } from 'context/useApplicantDetails';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import { useGetCKYCStatus } from 'api/ReactQuery/TwoWheeler/CKYC';
import { GetCKYCStatusRequest } from 'api/ReactQuery/TwoWheeler/CKYC/types';
import { useEmployeeDetails } from 'context/useEmployeeDetails';
import {
  useGetRelationshipMaster,
} from 'api/ReactQuery/TwoWheeler/Relationship';
import { DropdownObject, ErrorObject } from 'config/Types';
import { useGetRefrence } from 'api/ReactQuery/TwoWheeler/Lead';
import {
  GetRelationshipMasterRequest,
} from 'api/ReactQuery/TwoWheeler/Relationship/types';
type OTPVerificationNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OTPVerification'
>;
type OTPVerificationRouteProp = RouteProp<
  RootStackParamList,
  'OTPVerification'
>;

interface OTPVerificationScreenProps {
  navigation: OTPVerificationNavigationProp;
  route: OTPVerificationRouteProp;
}

const OTPVerification: FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const { applicantId, mobileNumber, guarantorId, isMainApplicant } =
    useApplicantDetails();
  const { employeeId } = useEmployeeDetails();
  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [isResendOTP, setIsResendOTP] = useState<boolean>(false);
  const [isResendOTPPressed, setIsResendOTPPressed] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(45);
  const [receiveSmsPermission, setReceiveSmsPermission] = useState('');
  const [relationshipFamily, setRelationshipFamily] = useState<string>('');
  const [isChangedFamily, setIsChangedFamily] = useState<boolean>(false);

  const [isOpenRelationshipFamily, setIsOpenRelationshipFamily] = useState<boolean>(false);


  const GetCKYCStatusRequest: GetCKYCStatusRequest = {
    appId: guarantorId ? guarantorId : applicantId,
    applicantType: guarantorId ? 'guarantor' : 'mainApplicant',
    ckycNumber: 5,
    employeeId,
  };
  const [CkycStatus, { data: ckycdata, isLoading: cKycIsLoading }] =
    useGetCKYCStatus(GetCKYCStatusRequest);

  const GenerateOTPRequest: GenerateOTPRequest = {
    appId: !isMainApplicant ? guarantorId : applicantId,
    applicantType: guarantorId ? 'guarantor' : 'mainApplicant',
    mobile: mobileNumber,
    employeeId,
    otpmode: isResendOTPPressed ? 'R' : 'F',
  };

  const [GetRefrence, { data: GetRefrenceData }] =
  useGetRefrence(`?type=${'telecomOtpDropdown'}`);

  const languageList: DropdownObject[] = GetRefrenceData
    ? GetRefrenceData.map(item => ({
      id: item.id,
      label: item.dropdownLabel,
      value: item.dropdownLabel,
      dropdownValue: item.dropdownValue
    }))
    : [];


  const [
    GenerateOTP,
    { data: GenerateOTPData, isLoading: GenerateOTPIsLoading },
  ] = useGenerateOTP(GenerateOTPRequest);

  // console.log("GenerateOTjjjPData",GenerateOTPData);
  
  const ValidateOTPRequest: ValidateOTPRequest = {
    appId: !isMainApplicant ? guarantorId : applicantId,
    applicantType: guarantorId ? 'guarantor' : 'mainApplicant',
    mobile: mobileNumber,
    otp: enteredOTP,
    employeeId,
    otpmode: isResendOTPPressed ? 'R' : 'F',
  };

  const GetFamilyRelationshipMasterRequest: GetRelationshipMasterRequest = {
    relationType: 'family',
    isDelete: false,
  };

  
  const SaveRelationRequest: SaveRelationRequest = {
    appId: !isMainApplicant ? guarantorId : applicantId,
    applicantType: guarantorId ? 'guarantor' : 'mainApplicant',
    leadRelation: relationshipFamily,
  };
  const [
    GetFamilyRelationshipMaster,
    {
      data: GetFamilyRelationshipMasterData,
      isLoading: GetFamilyRelationshipMasterIsLoading,
    },
  ] = useGetRelationshipMaster(GetFamilyRelationshipMasterRequest);


  // useEffect(() => {
  //   if (GenerateOTPData) {
  //     requestSmsPermission();
  //   }
  // }, [GenerateOTPData]);

  const [
    ValidateOTP,
    { data: ValidateOTPData, isLoading: ValidateOTPIsLoading },
  ] = useValidateOTP(ValidateOTPRequest);

  const [
    SaveRelation,
    { data: SaveRelationData, isLoading: SaveRelationIsLoading },
  ] = useSaveRelation(SaveRelationRequest);

  // useEffect(() => {
  //   if (ValidateOTPData != undefined) {
  //     const isEmpty = Object.keys(ValidateOTPData).length === 0;

  //     if (isEmpty) {
  //       useShowFlashMessage('success', 'OTP Verified Successfully !');
  //     }
  //   }
  // }, [ValidateOTPData]);


  // useEffect(() => {
  //   console.log("lllllllll",receiveSmsPermission,  PermissionsAndroid.RESULTS.GRANTED);

  //   if (
  //     receiveSmsPermission == PermissionsAndroid.RESULTS.GRANTED 
  //     // && enteredOTP.length < 4
  //   ) {
  //     console.log("mmmmm");

  //     let subscriber = DeviceEventEmitter.addListener(
  //       'onSMSReceived',
  //       message => {
  //         console.log("message");

  //         console.log("message",message);

  //         const {messageBody, senderPhoneNumber} = JSON.parse(message);
  //         const otpRegex = /\b\d+\b/;
  //         const match = messageBody.match(otpRegex);
  //         console.log('message body', messageBody);
  //         if (match) {
  //           const otp = match[0];
  //           console.log('OTP:', otp);
  //           setEnteredOTP(otp);
  //         } else {
  //           console.log('No OTP found in the message.');
  //         }
  //       },
  //     );

  //     return () => {
  //       subscriber.remove();
  //     };
  //   }
  // }, [receiveSmsPermission]);

  // useEffect(() => {
  //   console.log("Permission status:", receiveSmsPermission);

  //   if (receiveSmsPermission === PermissionsAndroid.RESULTS.GRANTED) {
  //     console.log("Registering SMS listener...");


  //     let subscriber = DeviceEventEmitter.addListener(
  //       'onSMSReceived',
  //       message => {
  //         console.log("SMS received:", message);

  //         const { messageBody, senderPhoneNumber } = JSON.parse(message);
  //         const otpRegex = /\b\d+\b/;
  //         const match = messageBody.match(otpRegex);

  //         console.log('Message body:', messageBody);

  //         if (match) {
  //           const otp = match[0];
  //           console.log('OTP:', otp);
  //           setEnteredOTP(otp);
  //         } else {
  //           console.log('No OTP found in the message.');
  //         }
  //       },
  //     );

  //     return () => {
  //       console.log("Removing SMS listener...");
  //       subscriber.remove();
  //     };
  //   }
  // }, [receiveSmsPermission]);


  // const requestSmsPermission = async () => {
  //   console.log("requestSmsPermission", requestSmsPermission);

  //   try {
  //     const permission = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  //     );
  //     console.log("Permission result:", permission);
  //     setReceiveSmsPermission(permission);


  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    if (isResendOTPPressed) {
      GenerateOTP.mutateAsync();
    }
  }, [isResendOTPPressed]);

  useEffect(() => {
    GetRefrence.mutateAsync()

    if (applicantId) {
      GenerateOTP.mutateAsync();
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      setIsResendOTP(true);
    }
  }, [timer]);

  useEffect(() => {
    if (enteredOTP.length === 6) {
      Keyboard.dismiss();
    }
  }, [enteredOTP]);

  useEffect(() => {
    if (ckycdata) {
      // need to manoj
      navigation.replace('LoanSummary');
    }
  }, [ckycdata]);

  useEffect(() => {
    if (SaveRelationData) {
      CkycStatus.mutateAsync();

    }
  }, [SaveRelationData]);

  useEffect(() => {
    if (ValidateOTPData) {
      console.log("ValidateOTPData", ValidateOTPData);

      if (ValidateOTPData.isOtpValidated) {
        useShowFlashMessage('success', 'OTP Verified Successfully !');
        CkycStatus.mutateAsync();
      } else {
        useShowFlashMessage(
          'warning', ValidateOTPData.message
          // 'The entered OTP is incorrect. Please double-check and try again.',
        );
      }
    }
  }, [ValidateOTPData]);

  const RelationshipFamilyOptions = GetFamilyRelationshipMasterData
    ? GetFamilyRelationshipMasterData.map(item => item.relationName)
    : [];

  return (
    <WaveBackground
      loading={[GenerateOTPIsLoading,SaveRelationIsLoading, ValidateOTPIsLoading, cKycIsLoading, GetFamilyRelationshipMasterIsLoading]}
      title={'OTP Verification'}>
        
      <View style={{ flex: 1, }}>
        <Text style={[styles.OTPText, { marginTop: '10%' }]}>
          We will send you a one time password on this Mobile Number
        </Text>
        <Text style={[styles.BoldText, { marginTop: '1%' }]}>{mobileNumber}</Text>
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          {/*<NumberField onOTPChange={setEnteredOTP} />*/}
          <TextInput
            autoComplete="one-time-code"
            maxLength={6}
            value={enteredOTP}
            // underlineColorAndroid={Colors.LightGrey}
            textContentType='oneTimeCode'
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              textAlign: 'center',
              borderWidth: 1,
              borderColor: Colors.LightGrey,
              width: '30%',
              backgroundColor: Colors.White,
              height: 40,
              borderRadius: 5,
              borderBottomWidth: 1,

              color: Colors.Black,
            }}
            onChangeText={text => setEnteredOTP(text)}
            keyboardType="numeric"
          />
        </View>
        {ValidateOTPData?.isOtpValidated == false ? null : <View style={{ alignItems: 'center' }}>
          <Text style={[styles.OTPText, { marginTop: '5%' }]}>
            Didn't received OTP ?
          </Text>
          {timer !== 0 && <Text style={styles.TimerText}>{timer}</Text>}

          <TouchableOpacity
            onPress={() => {
              setIsResendOTP(false);
              setIsResendOTPPressed(true);
              setTimer(45);
            }}
            disabled={!isResendOTP}>
            <Text
              style={[
                styles.OTPText,
                { color: isResendOTP ? Colors.Blue : Colors.LabelGrey },
              ]}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>}

        {
          ValidateOTPData?.isOtpValidated == false && 
          <LabelDropdown
            label={'Relationship'}
            options={languageList}
            isChange={setIsChangedFamily}
            setSelectedOption={setRelationshipFamily}
            defaultValue={relationshipFamily}
            open={isOpenRelationshipFamily}
            setDropdownOpen={setIsOpenRelationshipFamily}
            setSelectedItem={() => { }}
            zIndex={isOpenRelationshipFamily ? 1000 : 0}
          //  disabled={isViewOnly}
          />
        }

        <View style={{ marginTop: '50%' }}>
          <Button
            text={
              ValidateOTPData?.isOtpValidated == false ? "Save" : 
              "Verify"}
            active
            onPress={() => {
              ValidateOTPData?.isOtpValidated == false ? 
              SaveRelation.mutateAsync() :
              ValidateOTP.mutateAsync()
            }}
            marginVertical={50}
            marginTop={20}
            backgroundColor={Colors.Blue}
            textColor={Colors.White}
          />
        </View>
      </View>
    </WaveBackground>
  );
};
export default OTPVerification;
