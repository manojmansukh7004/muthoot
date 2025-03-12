import React, { FC, useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Icon from 'components/Icon';
import WaveBackground from 'components/WaveBackground';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import { Drawer } from 'react-native-drawer-layout';
import DrawerContent from './DrawerContent';
import { styles } from './styles';
import { BackHandler, Alert } from 'react-native';
import { useEmployeeDetails } from 'context/useEmployeeDetails';
import { useGetPlCount } from 'api/ReactQuery/PL/Lead';
import { useGetCount } from 'api/ReactQuery/TwoWheeler/Lead';

import { IconNames } from 'components/Icon'
import Colors from 'config/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DashboardNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;
type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

interface DashboardScreenProps {
  navigation: DashboardNavigationProp;
  route: DashboardRouteProp;
}
const Dashboard: FC<DashboardScreenProps> = ({ navigation, route }) => {
  const [name, setName] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const {  employeeName, employeeId } = useEmployeeDetails();

  type CircleDivTypes = {
    title: string;
    count: number | string;
    imgage: IconNames
  };

  const CircleDiv = ({ title, count, imgage }: CircleDivTypes) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.setItem('ismasterLogin', 'false')
          await AsyncStorage.setItem('isNachReactivation', 'false')

          title == 'New \nTwo-Wheeler' ? navigation.navigate('TwoWheelerStack', { screen: 'LeadManagement' }) 
            : title == 'PL' ? navigation.navigate('PlStack', { screen: 'LeadManagement' }) 
            : title == 'NACH Reactivation'? navigation.navigate('NactReactivationStack', { screen: 'NachReactivation' })
             : title == 'Master Login' && navigation.navigate('MasterLogin')
        

        }}
        style={styles.outerCircle}>
        <View style={{ height: 60, width: 60, padding: 12, borderRadius: 30, backgroundColor: Colors.LightBlue }}>
          <Icon name={imgage} />
        </View>
        <Text style={[styles.circleTitleStyle]}>{title}</Text>
        <Text style={styles.circleCountStyle}>{count}</Text>
      </TouchableOpacity>
    );
  };

  const [
    ViewCount,
    { data: ViewProspectData, isLoading: ViewProspectIsLoading },
  ] = useGetCount(`?employeeId=${employeeId}`);

  // console.log("ViewProspectData", ViewProspectData);

  const [
    ViewPlCount,
    { data: ViewPlCountData, isLoading: ViewPlCountIsLoading },
  ] = useGetPlCount(`?employeeId=${employeeId}`);

  useFocusEffect(
    React.useCallback(() => {
      ViewCount.mutateAsync()
      ViewPlCount.mutateAsync()
      const onBackPress = () => {
        // navigation.navigate('Dashboard')
        Alert.alert('Hold on!', 'Are you sure you want to quit application?', [
          {
            text: 'No',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );


  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return <DrawerContent />;
      }}>
      <WaveBackground loading={[ViewProspectIsLoading, ViewPlCountIsLoading]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginVertical: '10%',
              // flex: 1
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
                // backgroundColor: 'red',
              }}>
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  setOpen(true);
                }}>
                <Icon name="profile" />
                <View style={{ backgroundColor: 'transparent', left: 15 }}>
                  <Text style={styles.title}>{`Hello, ${employeeName}!`}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.dbOuterStyle}>
              {/* <Text style={styles.subtitle}>{`Business`}</Text> */}
              <View
                style={styles.dbStyle}>
                <CircleDiv imgage={'twoWheeler'} title={'New \nTwo-Wheeler'} count={ViewProspectData?.count || 0} />
                <CircleDiv imgage={'personalLoan'} title={'PL'} count={ViewPlCountData?.plCount || 0} />
              </View>
              {/* <Text style={styles.subtitle}>{`Operations`}</Text> */}
              <View
                style={styles.dbStyle}>
                <CircleDiv imgage={'nachReactivation'} title={'NACH Reactivation'} count={''} />
                {ViewProspectData?.masterLogin &&
                  <CircleDiv imgage={'admin'} title={'Master Login'} count={''} />}
              </View>
              {/* <View
                style={styles.dbStyle}>
                <CircleDiv imgage={'lap'} title={'Loan Against Property (LAP)'} count={ViewProspectData?.length || 0} />
                <CircleDiv imgage={'consumerProduct'} title={'Consumer Products'} count={ViewProspectData?.length || 0} />
              </View>
              <Text style={styles.subtitle}>{`Operations`}</Text>

              <View
                style={styles.dbStyle}>
                <CircleDiv imgage={'instantBuroPull'} title={'Instant Bureau Pull'} count={ViewProspectData?.length || 0} />
                <CircleDiv imgage={'nachReactivation'} title={'NACH Reactivation'} count={ViewProspectData?.length || 0} />
              </View> */}


            </View>
          </View>
        </ScrollView>
      </WaveBackground>
    </Drawer>
  );
};

export default Dashboard;
