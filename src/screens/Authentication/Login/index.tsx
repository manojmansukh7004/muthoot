import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Modal,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  NativeModules,
} from 'react-native';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import WaveBackground from 'components/WaveBackground';
import * as Animatable from 'react-native-animatable';
import { useLogin, useGetUpdatePassword } from 'api/ReactQuery/TwoWheeler/Auth';
import { useTheme } from 'react-native-paper';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LoginStackParamList } from 'navigation/HomeStack/LoginStack';
import Colors from 'config/Colors';
import { useAuthentication } from 'context/useAuthentication';
import Icon from 'components/Icon';
// import Modal from 'components/Modal';
import { MODAL_CONST } from 'config/StringConstants';
import { useEmployeeDetails } from 'context/useEmployeeDetails';
import { APP_FONTS, FONT_SIZE } from 'config/Fonts';
import useFontNormalise from 'hooks/useFontNormalise';
import { Buffer } from 'buffer';
import Clipboard from '@react-native-clipboard/clipboard';
import DeviceModal from 'components/DeviceModal';
import DeviceInfo from 'react-native-device-info';

const { SecureRandomModule } = NativeModules;

type LoginNavigationProp = StackNavigationProp<LoginStackParamList, 'Login'>;
type LoginRouteProp = RouteProp<LoginStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginNavigationProp;
  route: LoginRouteProp;
}

const Login: FC<LoginScreenProps> = ({ navigation, route }) => {
  const { colors } = useTheme();
  // const dispatch = useDispatch();
  // const themeColor = useSelector(state => state.userReducer)
  const [isLoading, setIsLoading] = React.useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { SaveEmployeeId, SaveEmployeeName, SaveRoleDescription } = useEmployeeDetails();
  const { ActivateLoggingIn } = useAuthentication();
  const [textInputHolder, setTextInputHolder] = useState<string>('');
  const [captchaHolder, setCaptchaHolder] = useState<string>('');
  const [randomNumberOne, setRandomNumberOne] = useState<string>('');
  const [isReEditModalVisible, setIsReEditModalVisible] = useState<boolean>(false);
  const [isDeviceModal, setIsDeviceModal] = useState<boolean>(false);
  const [deviceId, setDeviceId] = useState<string>('');
  const [deviceIdCopied, setDeviceIdCopied] = useState<boolean>(false);

  const [data, setData] = React.useState({
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    loading: false,
  });

  const LoginData = {
    password: data.password,
    employeeId: data.username,
    deviceId: deviceId
  };

  const [
    Authentication,
    { data: AuthenticationData, isLoading: AuthenticationIsLoading },
  ] = useLogin(LoginData);

  const [
    updatePassword,
    { data: updatePasswordData, isLoading: updatePasswordIsLoading },
  ] = useGetUpdatePassword(`employeeId=${data?.username}`);

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captchaCode = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      captchaCode += characters.charAt(randomIndex);
    }

    setRandomNumberOne(captchaCode);
    setTextInputHolder('');
  };

  const uint8ArrayToBase64 = (uint8Array) => {
    return Buffer.from(uint8Array).toString('base64');
  };

  const generateSecureCaptchaBytes = async () => {
    try {
      // Generate random bytes from the native module
      const randomBytesBase64 = await SecureRandomModule.generateRandomBytes(4); // Use 4 bytes to ensure enough randomness
      console.log('Generated secure random bytes (Base64):', randomBytesBase64);

      // Convert the Base64 string to a Uint8Array
      const buffer = Buffer.from(randomBytesBase64, 'base64');
      const randomBytes = new Uint8Array(buffer);

      // Define the character set (uppercase, lowercase letters, and digits)
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const charactersLength = characters.length;

      // Generate a 6-character random string
      let result = '';
      for (let i = 0; i < 6; i++) {
        // Use random byte to select a character from the character set
        const randomIndex = randomBytes[i % randomBytes.length] % charactersLength;
        result += characters[randomIndex];
      }

      console.log('Generated 6-character random string:', result);
      setRandomNumberOne(result); // Set the generated string
      setTextInputHolder('');
    } catch (error) {
      console.error('Error generating random bytes:', error);
    }
  };

  const validateCaptchaCode = () => {
    // console.log("kijj",textInputHolder, randomNumberOne);

    if (String(textInputHolder) === String(randomNumberOne)) {
      // Captcha match
      // Alert.alert('Captcha Matched');
      loginHandle(data.username, data.password);

    } else {
      // Captcha not match
      useShowFlashMessage('warning', 'Invalid Captcha');

      // Alert.alert('Invalid Captcha');
    }
    // Calling captcha function, to generate captcha code
    generateSecureCaptchaBytes()
    // generateCaptcha();
  };

  useEffect(() => {
    if (AuthenticationData?.employeeId) {
      console.log("AuthenticationData", AuthenticationData?.isUpdated);

      if (!AuthenticationData?.isUpdated) {
        console.log("mjjjj");

        setIsReEditModalVisible(true)
      } else {
        SaveEmployeeId(AuthenticationData.employeeId);
        SaveEmployeeName(AuthenticationData.employeeName);
        SaveRoleDescription(AuthenticationData.roleDescription);
        ActivateLoggingIn();
      }

    }
  }, [AuthenticationData]);

  useEffect(() => {
    if (updatePasswordData) {
      console.log("updatePasswordData", updatePasswordData);

      if (updatePasswordData) {
        setData({
          ...data,
          username: '', password: ''
        })
        setIsReEditModalVisible(false)
        navigation.navigate('ResetPassword')
      }

    }
  }, [updatePasswordData]);

  useEffect(() => {
    generateSecureCaptchaBytes()
  }, []);

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        const id = await DeviceInfo.getAndroidId();
        console.log('Device ID:', id);
        setDeviceId(id);
      } catch (error) {
        console.error('Error getting device ID:', error);
      }
    };

    fetchDeviceId();
  }, []);

  const textInputChange = (val: string) => {
    setData({
      ...data,
      username: val,
      check_textInputChange: true,
      isValidUser: /^[a-zA-Z0-9]+$/.test(val),
    });
  };

  const handlePasswordChange = val => {
    // if (/^[ A-Za-z0-9_@./#&+-]*$/.test(val)) {
    //   setData({
    //     ...data,
    //     password: val,
    //     isValidPassword: true,
    //   });
    // } else {
    setData({
      ...data,
      password: val,
      isValidPassword: true,
    });
    // }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const loginHandle = (userName, password) => {
    if (
      userName.length !== 0 &&
      password.length !== 0 &&
      data.isValidUser &&
      data.isValidPassword
    ) {
      Authentication.mutateAsync();
    } else {
      Alert.alert(
        'Wrong Input!',
        'Please enter a valid Employee Id or Password.',
        [{ text: 'Okay' }],
      );
    }
  };

  useEffect(() => {
    if (route.params?.VersionCheckResponse) {
      !route.params.VersionCheckResponse.appVersionflag &&
        setModalVisible(true);
    }
  }, [route.params?.VersionCheckResponse]);

  useEffect(() => {
    if (AuthenticationData?.isUpdated) {
      ActivateLoggingIn();
    }
  }, [AuthenticationData]);

  const handleDeviceModalClose = () => {
    setIsDeviceModal(false);
    setDeviceIdCopied(false)
  };

  const copyToClipboard = () => {
    console.log("deviceId", deviceId);

    setDeviceIdCopied(true)
    useShowFlashMessage('success', 'DeviceId copied successfully')
    Clipboard.setString(deviceId);
  };


  return (
    <WaveBackground
      title="login"
      loading={[AuthenticationIsLoading, updatePasswordIsLoading]}
      backgroundColor={Colors.Primary}>
      <View style={[styles.container]}>
        {/* <StatusBar backgroundColor={Colors.Primary} barStyle="light-content" /> */}
        {/* <Modal
          visible={modalVisible}
          onClose={handleModalClose}
          title={APK_VERSION_TITLE}
          message={APK_VERSION_MESSAGE}
          status={'failure'}
          buttonTitle={'Quit'}
          appVersion
        /> */}

        <DeviceModal
          visible={isDeviceModal}
          onClose={handleDeviceModalClose}
          message={deviceId}
          buttonTitle={'OK'}
          copied={copyToClipboard}
          isCopied={deviceIdCopied}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={isReEditModalVisible}
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
                Please Reset your Password?
              </Text>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <TouchableOpacity
                  onPress={() => {
                    updatePassword.mutateAsync()
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
                  onPress={() => setIsReEditModalVisible(false)}
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

        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/muthoot.png')}
            style={{
              height: 100,
              width: 100,
              backgroundColor: 'transparent',
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
          <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View
          animation="fadeInUpBig"
          style={[
            styles.footer,
            {
              backgroundColor: colors.background,
            },
          ]}>
          <View style={{ paddingBottom: 20 }} />
          <>
            <Text
              style={[
                styles.text_footer,
                {
                  color: 'black',
                },
              ]}>
              Employee Id
            </Text>
            <View style={styles.action}>
              <Image
                source={require('../../../assets/images/Avatar.png')}
                style={{
                  height: 18,
                  width: 15,
                  alignSelf: 'center',
                  position: 'relative',
                  left: 3,
                  bottom: 5,
                  tintColor: Colors.Black,
                }}
                resizeMode="contain"
              />
              <TextInput
                placeholder="Your Id"
                // keyboardType="number-pad"
                value={data.username}
                placeholderTextColor="#666666"
                style={[
                  styles.textInput,
                  {
                    color: 'black',
                  },
                ]}
                autoCapitalize="characters"
                onChangeText={val => textInputChange(val)}
              />
            </View>
            {data.isValidUser ? null : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>
                  Employee Id should only contain alphanumeric characters.
                </Text>
              </Animatable.View>
            )}

            <Text
              style={[
                styles.text_footer,
                {
                  color: 'black',
                  marginTop: 35,
                },
              ]}>
              Password
            </Text>
            <View style={styles.action}>
              <Image
                source={require('../../../assets/images/password.png')}
                style={{
                  height: 18,
                  width: 15,
                  alignSelf: 'center',
                  position: 'relative',
                  left: 3,
                  bottom: 5,
                  tintColor: Colors.Black
                }}
                resizeMode="contain"
              />
              <TextInput
                placeholder="Your Password"
                value={data.password}
                placeholderTextColor="#666666"
                secureTextEntry={data.secureTextEntry ? true : false}
                style={[
                  styles.textInput,
                  {
                    color: 'black',
                  },
                ]}
                autoCapitalize="none"
                onChangeText={val => handlePasswordChange(val)}
              />
              <TouchableOpacity onPress={updateSecureTextEntry}>
                {data.secureTextEntry ? (
                  <Icon name="hide" />
                ) : (
                  <Icon name="view" />
                )}
              </TouchableOpacity>
            </View>
            {data.isValidPassword ? null : (
              <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={styles.errorMsg}>
                  Password must be 10 characters long.
                </Text>
              </Animatable.View>
            )}
            {/* captcha */}
            <Text
              style={[
                styles.text_footer,
                {
                  color: "#666666",
                  marginVertical: 20,
                  alignSelf: 'center',
                  fontSize: 30,
                  letterSpacing: 10,
                  textDecorationLine: 'line-through',

                },
              ]}>
              {randomNumberOne}
            </Text>

            <View style={styles.action}>
              <TextInput
                placeholder="Enter Captcha"
                placeholderTextColor="#666666"
                value={textInputHolder}
                style={[
                  styles.textInput,
                  {
                    marginTop: -30,
                    color: 'black',
                  },
                ]}
                autoCapitalize='characters'
                onChangeText={(data) => setTextInputHolder(data)}
              />
              <TouchableOpacity onPress={() => {
                generateSecureCaptchaBytes()

                // generateCaptcha()
              }}>
                <Icon name="refresh" />
              </TouchableOpacity>
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => {
                  validateCaptchaCode()
                  // ActivateLoggingIn();
                  // console.log("ggggg",navigation.navigate);
                  // navigation.navigate('Dashboard')
                }}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => { navigation.navigate('ResetPassword') }}
              style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 12 }}>
              <Text style={{ color: Colors.Primary, }}>Reset Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {setIsDeviceModal(true)}}
              style={{ justifyContent: 'center', alignItems: 'center', }}>
              <Text style={{ color: Colors.Primary, }}>Get your device ID</Text>
            </TouchableOpacity>
          </>
          <View style={{
            // position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            // backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 20,
            width: '100%',
            justifyContent: 'center', alignItems: 'center'
          }}>
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent', height: 40, justifyContent: 'center', alignItems: 'center', }}>
              <Text style={{ color: Colors.LabelGrey, fontSize: FONT_SIZE.xs, top: 1 }}>Powered by </Text>
              <View style={{ width: '32%', }}>
                < Image
                  source={require('../../../assets/images/ezLending1.png')}
                  style={{ height: '100%', width: '100%', }}
                  resizeMode="contain"
                />
              </View>

            </View>
            <View style={{ flexDirection: 'row', backgroundColor: 'transparent', height: 20, justifyContent: 'center', alignItems: 'center', bottom: 13 }}>
              <Text style={{ color: Colors.LabelGrey, fontSize: FONT_SIZE.xs, top: 1 }}>A Product of </Text>
              <View style={{}}>
                <Text style={{ color: '#040c5b', fontSize: FONT_SIZE.s, fontFamily: APP_FONTS.Roboto_SemiBold }}>AnalyticsFox Softwares Pvt. Ltd.</Text>

              </View>

            </View>
          </View>

        </Animatable.View>
      </View>
    </WaveBackground>
  );
};
export default Login;
const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Primary,
  },
  header: {
    marginTop: '2%',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  imgHeader: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    // paddingVertical: 30
  },
  text_header: {
    color: '#fff',
    // fontWeight: 'bold',
    fontSize: 28,
    // alignSelf:'center',
    top: 18,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 16,
  },
  action: {
    flexDirection: 'row',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 40,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#1A97DD',
    // fontSize: 18,
    // fontWeight: 'bold'
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  TitleText: {
    alignSelf: 'center',
    fontSize: useFontNormalise(19),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
    color: Colors.Red,
    textTransform: 'capitalize',
  },
  messageText: {
    fontSize: useFontNormalise(15),
    fontFamily: APP_FONTS.Medium,
    color: 'black',
    marginVertical: 20,
    textAlign: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: '4%',
    alignItems: 'center',

    shadowColor: '#000',
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    paddingHorizontal: '6%',
    shadowOpacity: 2,
  },
  Button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30%',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: Colors.Button,
    borderColor: Colors.White,
    margin: 10
  },
  CloseText: {
    color: Colors.White,
    fontSize: useFontNormalise(13),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
  },
  SuccessText: {
    color: Colors.White,
    fontSize: useFontNormalise(13),
    fontFamily: APP_FONTS.Bold,
    fontWeight: '700',
  },

});
