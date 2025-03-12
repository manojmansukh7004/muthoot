import React, { FC, useEffect, useState } from 'react';
import { View, Image, Text, Linking, NativeModules } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import StatusBar from 'components/StatusBar';
import { LoginStackParamList } from 'navigation/HomeStack/LoginStack';
import { ScreenNavigationProp } from 'navigation/Types';
import { useAuthentication } from 'context/useAuthentication';
import { Card, Button } from 'react-native-paper';
import styles from './styles';
import { useVersionCheck } from 'api/ReactQuery/TwoWheeler/Auth';
import Colors from 'config/Colors';
import { APP_FONTS, FONT_SIZE } from 'config/Fonts';
import SessionExpiredPopup from 'components/SessionExpiredPopup';
import { useEmployeeDetails } from 'context/useEmployeeDetails';
const { RootCheck, FridaModule, OverlayDetection, IntegrityCheck } = NativeModules;

const expectedHash: string = 'ef45546b48e43c88870d784a51a6d02b4b424d974087b9aaccd902b55049c81a';
// shasum -a 256 /Users/manojmansukh/Documents/GitHub/muthoot/android/app/release/app-release.apk
type SplashNavigationProp = StackNavigationProp<LoginStackParamList, 'Splash'>;
type SplashRouteProp = RouteProp<LoginStackParamList, 'Splash'>;

interface SplashProps {
  navigation: SplashNavigationProp;
  route: SplashRouteProp;
}

const Splash: FC<SplashProps> = ({ route }) => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const [deviceId, setDeviceId] = useState<string>('');
  const [isDeviceRooted, setIsDeviceRooted] = useState<boolean>(false);
  const { ActivateLoggingIn ,isLoggedIn} = useAuthentication();
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);



  interface DecodedToken {
    exp: number;
  }

  const getToken = async () => {
    const token: string = (await AsyncStorage.getItem('token')) || '';
   
    const decoded: DecodedToken | string =
      token !== '' ? jwt_decode(token) : '';
    return decoded;
  };

  const appVersion = DeviceInfo.getVersion();
  // console.log("appVersion", appVersion);

  const [VersionCheck, { data: VersionCheckData }] = useVersionCheck({
    supportativeVersion: String(appVersion),
  });

  const onPressUpdate = () => {
    Linking.openURL('https://drive.google.com/drive/folders/10e-z19ZDdbJH1U8wQgGTpduFLUEm09nN');
  }

  const isRootedDevice = async () => {

    try {
      const rooted = await RootCheck.isDeviceRooted();
      // console.log("inside", await DeviceInfo.isEmulator());

      const hasOverlayPermission = await OverlayDetection.isOverlayPermissionGranted();
      const isSuspiciousOverlayRunning = await OverlayDetection.isSuspiciousOverlayRunning();
      const isEmulator = await DeviceInfo.isEmulator();
      const isIntact = await IntegrityCheck.checkIntegrity(VersionCheckData?.hashkey);
      console.log("isDeviceRooted******", rooted, hasOverlayPermission, isSuspiciousOverlayRunning, isEmulator, isIntact,);


      if (rooted || hasOverlayPermission || isSuspiciousOverlayRunning || isEmulator
        // || !isIntact
      ) {
        setIsDeviceRooted(true)
      }
      else {
        FridaModule?.detectFrida().then((isDetected: boolean) => {
          // console.log(isDetected, "FridaModule isDetected");
          if (isDetected) {
            setIsDeviceRooted(isDetected)
          } else {
            if (VersionCheckData?.appVersionflag !== false) {

              getToken().then(token => {
                setTimeout(() => {
                  console.log("token",token);

                  if (token == '') {
                    console.log("11111");
                    navigation.navigate('Login');
                  } else if (!isLoggedIn) {
                    console.log("222222");
                    navigation.replace('Login');
                  } else {
                    console.log("eeeeeeeeeee");
                    // navigation.replace('Login');
                    ActivateLoggingIn();
                  }
                }, 1500);
              });
            }
          }
        }).catch((error) => {
          console.error(error);
        });
      }
      // console.log(rooted, "isRootDevice");
    } catch (e) {
      console.error(e);
      return false;
    }
  };




  useEffect(() => {
    // VersionCheck.mutateAsync();
    navigation.navigate('Login');

  }, []);


  useEffect(() => {
    // console.log("vvvvv", VersionCheckData);
    if (VersionCheckData) {
      isRootedDevice();

    }
  }, [VersionCheckData])

  // console.log("isDeviceRooted", isDeviceRooted);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={false} />

      {
        VersionCheckData?.appVersionflag ?
          <Card style={styles.card}>
            <Image style={styles.img} source={require('../../../assets/images/Logo.png')} />
            <Text style={styles.textCard}>An important update is available.</Text>
            <Text style={styles.textCard}>Please update your app to</Text>
            <Text style={styles.textCard}>continue using it.</Text>
            <Button
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              mode="contained"
              uppercase
              // disabled={this.state.reqesting}
              // color={Colors.Primary}
              onPress={() => { onPressUpdate() }}
            >
              Update
            </Button>
          </Card>
          : isDeviceRooted ?
            <Card style={styles.card}>
              <Image style={styles.img} source={require('../../../assets/images/Logo.png')} />
              <Text style={styles.textCard}>Potential risks detected on your device, such as rooting, overlay permissions, running in an emulator, etc.</Text>
              <Text style={styles.textCard}>For your protection, certain features may be limited.</Text>
            </Card>
            :
            <>
              <SessionExpiredPopup />

              < Image
                source={require('../../../assets/images/Logo.png')}
                style={{ height: '50%', width: '50%' }}
                resizeMode="contain"
              />
            </>
      }
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
        width: '100%',
        justifyContent: 'center', alignItems: 'center'
      }}>
        <View style={{ flexDirection: 'row', backgroundColor: 'transparent', height: 30, justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ color: Colors.LabelGrey, fontSize: FONT_SIZE.xs, top: 1 }}>Powered by </Text>
          <View style={{ width: '32%', }}>
            < Image
              source={require('../../../assets/images/ezLending1.png')}
              style={{ height: '100%', width: '100%', }}
              resizeMode="contain"
            />
          </View>

        </View>
        <View style={{ flexDirection: 'row', backgroundColor: 'transparent', height: 20, justifyContent: 'center', alignItems: 'center', bottom: 5 }}>
          <Text style={{ color: Colors.LabelGrey, fontSize: FONT_SIZE.xs, top: 1 }}>A Product of </Text>
          <View style={{}}>
            <Text style={{ color: '#040c5b', fontSize: FONT_SIZE.s, fontFamily: APP_FONTS.Roboto_SemiBold }}>AnalyticsFox Softwares Pvt. Ltd.</Text>
          </View>
        </View>
      </View>

    </View>
  );
};
export default Splash;
