import React, { FC, useEffect, useRef, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Animatable from 'react-native-animatable';
import { StyleSheet, Modal, FlatList } from 'react-native';
import WaveBackground from 'components/WaveBackground';
import Button from 'components/Button';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import { TouchableOpacity, View, Text } from 'react-native';
import { APP_FONTS, FONT_SIZE } from 'config/Fonts';
import Colors from 'config/Colors';
import useFontNormalise from 'hooks/useFontNormalise';
import Icon from 'components/Icon';
import { useApplicantDetails } from 'context/useApplicantDetails';
import { DropdownObject, ErrorObject } from 'config/Types';
import LabeledTextInput from 'components/LabeledTextInput';
import { useGetRefrence } from 'api/ReactQuery/TwoWheeler/Lead';
import {
  useGenerateSanctionLetter,
  useGetSanctionLetter,
  useSendOTPSanctionLetter,
  useVerifyOTPSanctionLetter,
} from 'api/ReactQuery/TwoWheeler/SanctionLetter';
import { VerifyOTPSanctionLetterRequest } from 'api/ReactQuery/TwoWheeler/SanctionLetter/types';
import DownloadFile from 'config/Functions/DownloadFile';
import ModalComponent from 'components/ModalComponent';
import LoanSummaryButton from 'components/LoanSummaryButton';
import { usedViewStatus } from 'context/useViewStatus';
import LabeledDropdown from 'components/LabeledDropdown';
import useActive from 'hooks/useActive';

type SanctionLetterNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SanctionLetter'
>;

type SanctionLetterRouteProp = RouteProp<RootStackParamList, 'SanctionLetter'>;

interface SanctionLetterScreenProps {
  navigation: SanctionLetterNavigationProp;
  route: SanctionLetterRouteProp;
}

const SanctionLetter: FC<SanctionLetterScreenProps> = ({ navigation, route }) => {
  const { applicantId } = useApplicantDetails();
  const { useViewStatus } = usedViewStatus();

  // var applicantId = "MU706380"
  const [isError, setIsError] = useState<ErrorObject[]>([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [enteredOTP, setEnteredOTP] = useState<string>('');
  const [requestId, setRequestId] = useState<any>('');
  const [TCPopup, setTCPopup] = useState<boolean>(false);
  const [isConsent, setIsConsent] = useState<boolean>(false);
  const [isResendOTP, setIsResendOTP] = useState<boolean>(false);
  const [isResendOTPPressed, setIsResendOTPPressed] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedValue, setSelectedValue] = useState('');


  const activeLanguageArray = [selectedItem];

  let isActive: boolean = useActive(activeLanguageArray);

  const VerifyOTPSanctionLetterRequest: VerifyOTPSanctionLetterRequest = {
    applicantId,
    otp: enteredOTP,
    employeeId: 'MCSL104091',
    otpmode: 'F',
  };

  const [
    GenerateSanctionLetter,
    {
      data: GenerateSanctionLetterData,
      isLoading: GenerateSanctionLetterIsLoading,
    },
  ] = useGenerateSanctionLetter(`?applicantId=${applicantId}&language=${selectedItem?.dropdownValue}&languageLabel=${selectedItem?.label}`);

  const [GetRefrence, { data: GetRefrenceData }] =
    useGetRefrence(`?type=${'sanctionLetter'}`);

  const languageList: DropdownObject[] = GetRefrenceData
    ? GetRefrenceData.map(item => ({
      id: item.id,
      label: item.dropdownLabel,
      value: item.dropdownLabel,
      dropdownValue: item.dropdownValue
    }))
    : [];

  // console.log("languageList",languageList);

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
    GetSanctionLetter,
    { data: GetSanctionLetterData, isLoading: GetSanctionLetterIsLoading },
  ] = useGetSanctionLetter(applicantId);

  useEffect(() => {
    if (GenerateSanctionLetterData) {
      GetSanctionLetter.mutateAsync();
    }

  }, [GenerateSanctionLetterData])

  useEffect(() => {
    if (GetSanctionLetterData) {
      console.log("GetSanctionLetterData", GetSanctionLetterData);

      setSelectedValue(GetSanctionLetterData?.languageLabel)
    }

  }, [GetSanctionLetterData])

  useEffect(() => {
    if (useViewStatus) {
      setIsViewOnly(
        useViewStatus.isReEdit ? false :
          useViewStatus?.isSalesReject ? true : false);
    }
  }, []);


  const EnterOTPSanctionLetterContainer = useRef<
    View & { fadeIn: Function; fadeOut: Function }
  >(null);


  useEffect(() => {
    if (timer > 0) {

      const timeoutId = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => {
        // setIsResendOTPPressed(false), setIsResendOTP(false), 
        clearTimeout(timeoutId)
      };
    } else {
      setIsResendOTP(isResendOTPPressed ? true : false);
    }
  }, [timer]);


  useEffect(() => {
    if (VerifyOTPSanctionLetterData) {
      setTimer(0)
      GetSanctionLetter.mutateAsync();
    }
  }, [VerifyOTPSanctionLetterData]);

  useEffect(() => {
    GetRefrence.mutateAsync();
    GetSanctionLetter.mutateAsync();
    // GenerateSanctionLetter.mutateAsync();

  }, []);



  useEffect(() => {
    if (VerifyOTPSanctionLetterData) {
      if (VerifyOTPSanctionLetterData.sanction_letter) {
        EnterOTPSanctionLetterContainer.current?.fadeIn(1000);
      }
    } else {
      setEnteredOTP('');
    }
  }, [VerifyOTPSanctionLetterData]);

  const handleSelectItem = (item) => {
    console.log("mmmmmm", item);

    setSelectedValue(item.value);
    setSelectedItem(item);
  };


  const renderItem = ({ item }) => {
    const isSelected = item.label === selectedItem.label;
    // console.log("isSelected",item.label, selectedItem);

    return (
      <TouchableOpacity
        style={[styles.listItem, isSelected && styles.selectedItem]}
        onPress={() => { handleSelectItem(item), setSelectedValue(item.value) }}
      >
        {/* Radio button */}
        <View style={styles.radioButtonContainer}>
          <Text style={styles.listText}>{item.label}</Text>

          <View style={[styles.radioButtonOuter, isSelected && styles.radioButtonSelectedOuter]}>
            {isSelected && <View style={styles.radioButtonInner} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  // console.log("selectedValue",  GenerateSanctionLetterData);

  return (
    <WaveBackground
      loading={[
        GenerateSanctionLetterIsLoading,
        VerifyOTPSanctionLetterIsLoading,
        SendOTPForSanctionLetterIsLoading,
        GetSanctionLetterIsLoading,
      ]}
      // language
      onPress={() => {
        GetSanctionLetterData?.unsigned_sanction_letter ? null :
          setModalVisible(true)
      }}
      title={'Sanction Letter'}>
      <ModalComponent
        onClose={() => {
          setTCPopup(false);
        }}
        visible={TCPopup}
        status={'normal'}
        buttonTitle="I agree"
        tc
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* <Text style={styles.modalTitle}>Select an Item</Text> */}
            <FlatList
              data={languageList}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              style={{ width: '100%' }}
            />
            <Button
              text={'Proceed'}
              active
              marginVertical={10}
              onPress={() => {
                GenerateSanctionLetter.mutateAsync();
                setModalVisible(false)
              }}
            />
          </View>
        </View>
      </Modal>


      <Text style={styles.MessageText}>
        We are pleased to inform you that your sanction letter is now available
        for download. Below, you can find the sample sanction letter:
      </Text>
      <Icon name="sanction-letter-image" />


      <LabeledDropdown
        label="Language"
        defaultValue={selectedValue}
        options={languageList}
        setSelectedItem={(item) => {
          setSelectedItem(item);
        }}
        setSelectedOption={(label) => { setSelectedValue(label) }}
        bottom
        // isChange={}
        mandatory
        disabled={isViewOnly ? isViewOnly : GetSanctionLetterData?.unsigned_sanction_letter ? true : false}
      />

      <View
        style={{
          marginTop: '5%',
          width: '100%',
          alignSelf: 'center',
          marginBottom: '5%',
        }}>

        {
          !GetSanctionLetterData?.unsigned_sanction_letter &&
          <Button
            text={'Proceed'}
            active={isActive && !isViewOnly}
            marginVertical={10}
            onPress={() => {
              GenerateSanctionLetter.mutateAsync();
            }}
          />}
      </View>

      {GetSanctionLetterData?.unsigned_sanction_letter !== null &&
        <>
         {SendOTPForSanctionLetterData&& <Text style={[styles.MessageText, { marginTop: 5 }]}>
            For security, an OTP has been sent to your registered mobile number.
            Please enter it below to proceed with the download.
          </Text>}
          {!GetSanctionLetterData?.signed_sanction_letter &&
            !SendOTPForSanctionLetterData && !isResendOTPPressed && (
              <>
                <View
                  style={{
                    marginTop: '5%',
                    width: '100%',
                    alignSelf: 'center',
                    marginBottom: '5%',
                  }}>
                  <Button
                    text="Sanction Letter"
                    onPress={() => {
                      GetSanctionLetterData?.unsigned_sanction_letter &&
                        DownloadFile(
                          GetSanctionLetterData?.unsigned_sanction_letter,
                          applicantId + '_SanctionLetter',
                        );
                    }}
                    marginVertical={20}
                    active={GetSanctionLetterData?.unsigned_sanction_letter ? true : false}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    marginTop: 10,
                    marginBottom: 15,
                  }}>
                  <TouchableOpacity disabled={isViewOnly} onPress={() => setIsConsent(!isConsent)}>
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
                  <View style={{ flexDirection: 'row', left: 15 }}>
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
                </View>
                <Button
                  text="Generate OTP"
                  active={isConsent && GetSanctionLetterData?.unsigned_sanction_letter ? true : false}
                  marginVertical={10}
                  marginTop={20}
                  onPress={() => {
                    setTimer(45)
                    setIsResendOTPPressed(true);
                    SendOTPForSanctionLetter.mutateAsync();
                  }}
                />
              </>
            )}

          {!GetSanctionLetterData?.signed_sanction_letter && <View style={{ alignItems: 'center', marginVertical: '5%' }}>
            <Text style={[styles.OTPText, {}]}>
              Didn't received OTP ?
            </Text>
            {timer !== 0 && <Text style={styles.TimerText}>{timer}</Text>}

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
                  styles.OTPText,
                  { color: isResendOTP ? Colors.Blue : Colors.LabelGrey },
                ]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>}
          {SendOTPForSanctionLetterData &&
            !GetSanctionLetterData?.signed_sanction_letter && (
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
        </>}

      {(GetSanctionLetterData?.signed_sanction_letter != null && GetSanctionLetterData?.signed_sanction_letter != '') ? (
        <>
          <View
            style={{
              marginTop: '5%',
              width: '70%',
              alignSelf: 'center',
              marginBottom: '10%',
            }}>
            <Button
              text="Sanction Letter"
              onPress={() =>
                GetSanctionLetterData?.signed_sanction_letter &&
                DownloadFile(
                  GetSanctionLetterData?.signed_sanction_letter,
                  applicantId + '_SanctionLetter',
                )
              }
              marginVertical={20}
              active
            />
          </View>
          <Button
            text={'Next'}
            active
            marginVertical={10}
            onPress={() => {
              navigation.navigate('BankDetails');
            }}
          />
        </>
      ) : null}
      <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />
    </WaveBackground>
  );
};
export default SanctionLetter;
const styles = StyleSheet.create({
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
    marginBottom: 15
    // marginVertical: '3%',
  },
  TimerText: {
    fontFamily: APP_FONTS.Roboto_Black,
    fontSize: useFontNormalise(18),
    color: Colors.TimerGreen,
    marginVertical: 5
  },
  OTPText: {
    color: Colors.Black,
    fontFamily: APP_FONTS.Regular,
    fontSize: FONT_SIZE.s,
    marginVertical: '1%',
    alignSelf: 'center',
    width: '80%',
    textAlign: 'center'
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
    fontFamily: APP_FONTS.Roboto_Regular
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
});
