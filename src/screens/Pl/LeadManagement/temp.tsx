import React, { FC, useState, useCallback, useRef, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
  Dimensions,
  BackHandler,
  Image,
} from 'react-native';
import { ConvertToPrefixedAmount } from 'config/Functions/ConvertToPrefix';

import Colors from 'config/Colors';
import { styles } from './tempStyle';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import WaveBackground from 'components/WaveBackground';
import Icon from 'components/Icon';
import { APP_FONTS, FONT_SIZE } from 'config/Fonts';
import { useViewLeads, useViewProspects } from 'api/ReactQuery/PL/Lead';
import { useApplicantDetails } from 'context/useApplicantDetails';
import moment from 'moment';
import useFontNormalise from 'hooks/useFontNormalise';
import { useCKYCData } from 'context/useCKYCData';
import DownloadFile from 'config/Functions/DownloadFile';
import { useEmployeeDetails } from 'context/useEmployeeDetails';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import Modal from 'components/Modal';

type LeadManagementNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LeadManagement'
>;
type LeadManagementRouteProp = RouteProp<RootStackParamList, 'LeadManagement'>;

interface LeadManagementScreenProps {
  navigation: LeadManagementNavigationProp;
  route: LeadManagementRouteProp;
}

const screenWidth = Dimensions.get('window').width;
const LeadManagement: FC<LeadManagementScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState<string>('');
  const { SaveApplicantId, ResetApplcantDetails } = useApplicantDetails();
  const { employeeId } = useEmployeeDetails();
  const { ResetCKYCData } = useCKYCData();
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [expandedIndex, setExpandedIndex] = useState<number>(-1);
  const [expanded, setExpanded] = useState<boolean>(false);
  const animationValue = useRef(new Animated.Value(0)).current;
  const [commonPopupVisible, setCommonPopUPVisible] = useState<boolean>(false);

  const movementRangePercentage = useFontNormalise(38);
  const movementRange = (screenWidth * movementRangePercentage) / 100;
  var viewOpen = false;
  var viewIndex = -1;
  const animatedStyle = {
    transform: [
      {
        translateX: animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, movementRange],
        }),
      },
    ],
  };

  const handleTextPress = (index: number) => {
    setSelectedIndex(index);

    Animated.spring(animationValue, {
      toValue: index,
      useNativeDriver: true,
    }).start();
  };

  const [ViewLeads, { data: ViewLeadsData, isLoading: ViewLeadsIsLoading }] =
    useViewLeads(employeeId, searchText);

  const [
    ViewProspect,
    { data: ViewProspectData, isLoading: ViewProspectIsLoading },
  ] = useViewProspects(employeeId, searchText);

  useEffect(() => {
    if (searchText.length > 1 || searchText == '') {
      selectedIndex === 1
        ? ViewProspect.mutateAsync()
        : ViewLeads.mutateAsync();
    }
  }, [searchText]);

  useFocusEffect(
    useCallback(() => {
      ResetApplcantDetails();
      ResetCKYCData();
      setExpandedIndex(-1);
      ViewLeads.reset();
      ViewProspect.reset();
      ViewLeads.mutateAsync();
      ViewProspect.mutateAsync();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.replace('Dashboard');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  // const inputDateString = "2023-12-15T05:47:29.000+0000";
  // const inputMoment = moment.utc(inputDateString).format('DD-MM-YYYY h:mm A');
  // const formattedDate = inputMoment.format('DD-MM-YYYY h:mm A');
  // console.log("formattedDate",inputMoment);

  const renderRow = (item, index) => {

    return (
      <View style={styles.listBoxStyle}>
        <TouchableOpacity
          onPress={() => {
            setExpandedIndex(expandedIndex === index ? -1 : index),
              setExpanded(expandedIndex === index ? false : true);
          }}
          style={[styles.dataContainer1]}>
          <View style={[styles.tabularLayout, { width: '40%' }]}>
            <Text style={styles.lableStyle}>{'App ID'}</Text>
            <Text style={styles.dataStyle}>{item.appId}</Text>
          </View>
          <View style={[styles.tabularLayout, { width: '50%' }]}>
            <Text style={styles.lableStyle}>{'Lead Name'}</Text>
            <Text ellipsizeMode={'tail'} style={styles.dataStyle}>
              {item.name}
            </Text>
          </View>

          <View style={[styles.tabularLayout, { width: '10%' }]}>
            <Image
              source={
                expanded && expandedIndex == index
                  ? require('../../../assets/images/upArrow.png')
                  : require('../../../assets/images/downArrow.png')
              }
              style={{ tintColor: Colors.Primary, marginTop: 10 }}
            />
          </View>
        </TouchableOpacity>

        {expanded && expandedIndex == index &&
          <View style={[styles.dataContainer, { height: expanded && expandedIndex == index ? 'auto' : 0 }]}>

            <View style={[styles.dataContainer1, {}]}>
              <>
                {selectedIndex == 1 &&
                  <View style={[styles.tabularLayout1]}>
                    <Text style={styles.lableStyle}>{'Mobi No.'}</Text>
                    <Text style={styles.dataStyle}>{item.mobileNumber}</Text>
                  </View>}

                <View style={styles.tabularLayout1}>
                  <Text style={styles.lableStyle}>{'Application ID'}</Text>
                  <Text style={styles.dataStyle}>{item.applicationId}</Text>
                </View>
                <View style={styles.tabularLayout1}>
                  <Text style={styles.lableStyle}>{'Login \nDate/Time'}</Text>

                  <Text style={[styles.dataStyle]}>{moment.utc(item.createdDate).format('DD-MM-YYYY')}</Text>
                  <Text style={[styles.dataStyle, {}]}>{moment.utc(item.createdDate).format('\nh:mm A')}</Text>
                </View>

                {selectedIndex !== 1 && (
                  <TouchableOpacity
                    onPress={() => {
                      SaveApplicantId(item.appId),
                        navigation.navigate('LeadRegistration');
                    }}
                    style={styles.tabularLayout1}>
                    <Text style={styles.lableStyle}>{'Action'}</Text>
                    <Text style={[styles.dataStyle, { color: Colors.Primary }]}>
                      {'Edit'}
                    </Text>
                  </TouchableOpacity>
                )}
                {selectedIndex == 1 &&
                  <View style={styles.tabularLayout1}>
                    <Text style={styles.lableStyle}>{'Updated \nDate/Time'}</Text>
                    <Text style={styles.dataStyle}>{moment.utc(item.updatedDate).format('DD-MM-YYYY')}</Text>
                    <Text style={styles.dataStyle}>{moment.utc(item.updatedDate).format('\nh:mm A')}</Text>
                  </View>
                }

              </>
            </View>
            {selectedIndex == 1 && (
              <>

                <View style={[styles.divider, { height: expanded && expandedIndex == index ? .5 : 0 }]} />
                <View style={[styles.dataContainer1, {}]}>
                  <View style={[styles.tabularLayout, {}]}>
                    <Text style={styles.lableStyle}>{'KYC\nVerification'}</Text>
                    {item.kycStatus ? <Icon name="verify" /> : <View style={{ height: 50, width: 50, marginTop: 5 }} />}
                  </View>
                  <View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'TVR\n'}</Text>
                    <Text style={styles.dataStyle}>{item.tvr}</Text>
                  </View>
                  {/* <View style={styles.tabularLayout}>
                  <Text style={styles.lableStyle}>{'FI'}</Text>
                  {item.kycStatus ? <Icon name="verify" /> : null}
                </View> */}
                  <View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Payment\nStatus'}</Text>
                    {item.paymentStatus1 ? <Icon name="verify" /> : <View style={{ height: 50, width: 50, marginTop: 5 }} />}
                  </View>
                  <View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Final\nStatus'}</Text>
                    <Text style={styles.dataStyle}>{item.finalStatus}</Text>
                  </View>
                  <View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Credit\nStatus'}</Text>
                    {item.creditStatus1 !== null &&
                      <Image
                        source={
                          item.creditStatus1 == 'Approved' ? require('../../../assets/images/approve.png') :
                            item.creditStatus1 == 'Pending' ? require('../../../assets/images/Pending.png') :
                              item.creditStatus1 == 'Disbursed' ? require('../../../assets/images/disbursed.png') :
                                item.creditStatus1 == 'Rejected' ? require('../../../assets/images/reject.png') : ''
                        }
                        style={{ height: 50, width: 50, marginTop: 5 }}
                        resizeMode={'contain'}
                      />}
                  </View>

                  <View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Disb\nStatus'}</Text>
                    {item.disbursementStatus !== null ? <Image
                      source={
                        item.disbursementStatus == 'Approved' ? require('../../../assets/images/approve.png') :
                          item.disbursementStatus == 'Pending' ? require('../../../assets/images/Pending.png') :
                            item.disbursementStatus == 'Disbursed' ? require('../../../assets/images/disbursed.png') :
                              item.disbursementStatus == 'Rejected' ? require('../../../assets/images/reject.png') : ''

                      }
                      style={{ height: 50, width: 50, marginTop: 5 }}
                      resizeMode={'contain'}
                    /> : <View style={{ height: 50, width: 50, marginTop: 5 }} />}
                  </View>

                </View>
                <View style={[styles.divider, { height: expanded && expandedIndex == index ? .5 : 0 }]} />

                <View style={[styles.dataContainer1, {}]}>
                  <View style={[styles.tabularLayout]}>
                    <Text style={styles.lableStyle}>{'Approved \nLoan Amount'}</Text>
                    <Text style={styles.dataStyle}>{item.approvedLoanAmount ? `₹${ConvertToPrefixedAmount(item?.approvedLoanAmount?.toString())}` : ''}</Text>
                  </View>
                  <View style={[styles.tabularLayout,]}>
                    <Text style={styles.lableStyle}>{'Approved \nLTV'}</Text>
                    <Text style={styles.dataStyle}>{(item?.actualLtv) ? `${item.actualLtv}%` : null}</Text>
                  </View>

                </View>
                <View style={[styles.divider, { height: expanded && expandedIndex == index ? .5 : 0 }]} />

                <View style={[styles.dataContainer1, {}]}>
                  <View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Credit Officer Name'}</Text>
                    <Text style={styles.dataStyle}>{item.mcslNameCredit}</Text>
                  </View>
                  <View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Credit\nOfficer ID'}</Text>
                    <Text style={styles.dataStyle}>{item.mcslIdCredit}</Text>
                  </View>

                  <TouchableOpacity onPress={() => {
                    setCommonPopUPVisible(true),
                      setErrorMsg(item.creditRemark)
                  }} style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Credit\nRemark'}</Text>
                    <Text numberOfLines={2} style={styles.dataStyle}>{item.creditRemark}</Text>
                  </TouchableOpacity >

                  <TouchableOpacity onPress={() => {
                    setCommonPopUPVisible(true),
                      setErrorMsg(item.creditReasonCategory)
                  }} style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Credit\nReason'}</Text>
                    <Text numberOfLines={2} style={styles.dataStyle}>{item.creditReasonCategory}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setCommonPopUPVisible(true),
                      setErrorMsg(item.creditSubQueryReason)
                  }} style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Credit\nSubquery Reason'}</Text>
                    <Text numberOfLines={2} style={styles.dataStyle}>{item.creditSubQueryReason}</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.divider, { height: expanded && expandedIndex == index ? .5 : 0 }]} />

                <View style={[styles.dataContainer1, {}]}>
                  <View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Disb\nOfficer Name'}</Text>
                    <Text numberOfLines={2} style={styles.dataStyle}>{item.mcslNameDisbursement}</Text>
                  </View>
                  <View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Disb\nOfficer ID'}</Text>
                    <Text numberOfLines={2} style={styles.dataStyle}>{item.mcslIdDisbursement}</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setCommonPopUPVisible(true),
                      setErrorMsg(item.disbursementReasonCategory)
                  }} style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Disb Reason Category'}</Text>
                    <Text numberOfLines={2} style={styles.dataStyle}>{item.disbursementReasonCategory}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setCommonPopUPVisible(true),
                      setErrorMsg(item.disbursementRemark)
                  }} style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Disb Remark'}</Text>
                    <Text numberOfLines={2} style={styles.dataStyle}>{item.disbursementRemark}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setCommonPopUPVisible(true),
                      setErrorMsg(item.disburesmentReason)
                  }} style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Disb Reason'}</Text>
                    <Text numberOfLines={2} style={styles.dataStyle}>{item.disburesmentReason}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    setCommonPopUPVisible(true),
                      setErrorMsg(item.disbursementSubQueryReason)
                  }} style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Disb Subquery Reason'}</Text>
                    <Text numberOfLines={2} style={styles.dataStyle}>{item.disbursementSubQueryReason}</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.divider, { height: expanded && expandedIndex == index ? .5 : 0 }]} />
                <View style={[styles.dataContainer1, {}]}>
                  < View style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Case\nModule'}</Text>
                    <Text style={styles.dataStyle}>{item.caseModule || 'Sales Module'}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      item?.bureauFilPath ?
                        navigation.navigate('BureauReport', { webRedirectionUrl: item?.bureauFilPath })

                        :
                        useShowFlashMessage('warning', "CRIF Report not found");
                    }}
                    style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'CRIF\nReport'}</Text>
                    <Text style={[styles.dataStyle, { color: Colors.Primary }]}>
                      {'View\nReport'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      item?.sanctionLetter ?
                        item?.sanctionLetter &&
                        DownloadFile(
                          item?.sanctionLetter,
                          item.app_id + '_SanctionLetter',
                        )
                        :
                        useShowFlashMessage('warning', "Sanction letter not found");

                    }}
                    style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Sanction\nLetter'}</Text>
                    <Text style={[styles.dataStyle, { color: Colors.Primary }]}>
                      {'Download\nReport'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // console.log("kkkkkkkk", item,);

                      SaveApplicantId(item.appId);
                      navigation.replace('LoanSummary');
                    }}
                    style={styles.tabularLayout}>
                    <Text style={styles.lableStyle}>{'Action'}</Text>
                    <Text style={[styles.dataStyle, { color: Colors.Primary }]}>
                      {'Update Profile'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

          </View>}


        {/* <View style={[styles.divider, { height: expanded && expandedIndex == index ? .5 : 0 }]} /> */}

      </View>
    );
  };

  return (
    <>
      <WaveBackground
        title={'Lead Management'}
        loading={
          [
            // ViewLeadsIsLoading,
            ViewProspectIsLoading,
          ]
        }>
        <Modal
          buttonTitle="Okay"
          title=" "
          popMessage
          status="normal"
          message={errorMsg}
          visible={commonPopupVisible}
          onClose={() => {
            setCommonPopUPVisible(false);
            setErrorMsg('')
          }}
        />
        <View style={styles.searchBarContainer}>
          <Icon name="search-icon" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Lead"
            placeholderTextColor={Colors.LabelGrey}
            onChangeText={text => {
              setSearchText(text);
            }}
          />
        </View>

        <View
          style={{
            width: '100%',
            borderRadius: 8,

            flex: 1,
            marginTop: 20,
          }}>
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              flexDirection: 'row',
              paddingVertical: 10,
              backgroundColor: Colors.LightBlue,
              borderRadius: 8,
              flex: 2,
              marginBottom: 15,
              borderWidth: 1,
              borderColor: Colors.LightGrey,
            }}>

            <TouchableOpacity
              onPress={() => {
                handleTextPress(0);
              }}
              style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text
                  style={[
                    styles.LeadButtonText,
                    selectedIndex === 0 ? styles.Selection : styles.UnSelected,
                  ]}>
                  Lead
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleTextPress(1);
              }}
              style={{ alignItems: 'center', flex: 1 }}>
              <View>
                <Text
                  style={[
                    styles.LeadButtonText,
                    selectedIndex === 1 ? styles.Selection : styles.UnSelected,
                  ]}>
                  Prospect
                </Text>
              </View>
            </TouchableOpacity>
            <Animated.View style={[styles.selectionIndicator, animatedStyle]} />
          </View>

          <>
            {(
              selectedIndex === 0
                ? ViewLeadsData?.length !== 0
                : ViewProspectData?.length !== 0
            ) ? (
              <FlatList
                style={{ flex: 1 }}
                data={selectedIndex === 0 ? ViewLeadsData : ViewProspectData}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={({ item, index }) => renderRow(item, index)}
                extraData={
                  selectedIndex === 0 ? ViewLeadsData : ViewProspectData
                }
                initialNumToRender={15}
              />
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // height: 45,
                  paddingVertical: '30%',
                  width: '100%',
                  backgroundColor: Colors.White,
                  borderBottomLeftRadius: 9,
                  borderBottomRightRadius: 9,
                }}>
                <Icon name="no-data" />
                <Text
                  style={{
                    alignSelf: 'center',
                    color: Colors.Black,
                    fontSize: FONT_SIZE.l,
                    marginLeft: 8,
                    fontFamily: APP_FONTS.Roboto_SemiBold,
                  }}>
                  No Data
                </Text>
              </View>
            )}
          </>
        </View>
      </WaveBackground>
      <TouchableOpacity
        onPress={() => navigation.navigate('LeadRegistration')}
        style={styles.avatarContainer}>
        <Icon name="plus" />
      </TouchableOpacity>
    </>
  );
};

export default LeadManagement;
