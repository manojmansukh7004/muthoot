import React, { FC, useEffect, useMemo, useState } from 'react';
import { Text, View, TouchableOpacity, Modal } from 'react-native';
import { Divider } from 'react-native-paper';
import Icon from 'components/Icon';
import { useApplicantDetails } from 'context/useApplicantDetails';
import Button from 'components/Button';
import { GetCKYCStatusResponse } from 'api/ReactQuery/TwoWheeler/CKYC/types';
import { LoanSummaryNavigationProp } from 'screens/TwoWheeler/LoanSummary';
import { GetCriffResponse } from 'api/ReactQuery/TwoWheeler/BureauApi/types';
import styles from './styles';
import { ScreenNames } from 'config/Types';
import { salesRejectedRequest, salesReEditRequest } from 'api/ReactQuery/TwoWheeler/Lead/types';
import { useSalesReject, useSalesReEdit, useViewStatus } from 'api/ReactQuery/TwoWheeler/Lead';
import { FONT_SIZE } from 'config/Fonts';
import { usedViewStatus } from 'context/useViewStatus';

export type qdeSectionsType = {
  screenName: string;
  navigation: ScreenNames;
  isActive: boolean | undefined;
};

interface SummaryCardType {
  section: qdeSectionsType[];
  CKYCData: GetCKYCStatusResponse;
  title: string;
  criffReportPath: string;
  navigation: LoanSummaryNavigationProp;
  docNumber: string;
  applicantType: string;
  applicantName: string;
  appId: string;
  continueDisable: boolean;
  bureauScore: string;
  isNextEnableBureau: boolean;
  isPopUpVisibleBureau: boolean;
  popUpMessageBureau: string;
  isGuarantorMandatory: boolean;
  loanOffer?: boolean
  creditNextEnable?: boolean
  SactionNextEnable?: boolean
  empStatus?: boolean
  isSubmitToDisbursementFreeze?: boolean | null
  loanPopup?: boolean,
  rejectMessage?: string,
  isRejectButtonVisible: boolean,
  isSalesReject: boolean,
  isEditButtonVisible?: boolean,
  isReEdit?: boolean;
  isReAppeal?: boolean;
}

const SummaryCard: FC<SummaryCardType> = ({
  section,
  title,
  CKYCData,
  navigation,
  criffReportPath,
  docNumber,
  applicantType,
  applicantName,
  appId,
  continueDisable,
  bureauScore,
  isNextEnableBureau,
  isPopUpVisibleBureau,
  popUpMessageBureau,
  isGuarantorMandatory,
  loanOffer,
  creditNextEnable,
  SactionNextEnable,
  empStatus,
  isSubmitToDisbursementFreeze,
  loanPopup,
  rejectMessage,
  isRejectButtonVisible,
  isSalesReject,
  isEditButtonVisible,
  isReEdit,
  isReAppeal
}) => {
  const { applicantId, isMainApplicant, guarantorId } = useApplicantDetails();
  const { SaveViewStatus } = usedViewStatus();

  const CriffResponse: GetCriffResponse = {
    applicantName,
    applicantId,
    criffReportPath,
    applicantType,
    docNumber,
    criffCreatedDate: '',
    bureauScore,
    isNextEnableBureau,
    isPopUpVisibleBureau,
    popUpMessageBureau,
    bureauPull: true,
  };
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [isReEditModalVisible, setIsReEditModalVisible] = useState<boolean>(false);

  const salesRejectedRequest: salesRejectedRequest = {
    appId: applicantType === 'mainApplicant' ? applicantId : guarantorId,
  };

  const salesReEditRequest: salesReEditRequest = {
    appId: applicantType === 'mainApplicant' ? applicantId : guarantorId,
    isReEdit: true
  };

  const [SalesRejected, { data: salesRejectedData }] =
    useSalesReject(salesRejectedRequest);


  const [ViewStatus, { data: ViewStatusData, }] =
    useViewStatus(applicantId);

  const [SalesReEdit, { data: salesReEditData }] =
    useSalesReEdit(salesReEditRequest);

  const memoizedViewStatusData = useMemo(
    () => ViewStatusData,
    [ViewStatusData],
  );

  useEffect(() => {
    if (memoizedViewStatusData) {
      console.log("memoizedViewStatusData", JSON.stringify(memoizedViewStatusData, null, 4));

      SaveViewStatus({
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
      navigation.navigate('ProductDetails')

    }
  }, [memoizedViewStatusData, applicantType,]);

  useEffect(() => {
    if (salesReEditData) {
      ViewStatus.mutateAsync()
    }
  }, [salesReEditData])

  useEffect(() => {
    if (salesRejectedData) {
      navigation.navigate('LeadManagement')
    }
  }, [salesRejectedData])

  const handleNavigation = (screen: ScreenNames) => {
    console.log("cccccccccc", CriffResponse);
    if (screen === 'BureauSuccess') {
      navigation.navigate(screen, { GetCriffResponse: CriffResponse });
    } else if (
      screen === 'BREApproved' ||
      screen === 'ManualUnderwriting'
    ) {
      navigation.navigate(screen, {
        GetCriffResponse: CriffResponse,
        isGuarantorMandatory,
      });
    } else if (
      screen === 'LoanRejected'
    ) {
      navigation.navigate(screen, {
        GetCriffResponse: CriffResponse,
        isGuarantorMandatory,
        popup: loanPopup,
        message: rejectMessage
      });
    }
    else {
      // console.log("fffffff", screen);

      navigation.navigate(screen);
    }
    return;
  };

  let filteredSections = CKYCData?.isPanAvailable
    ? section.filter(item => item.screenName !== 'OVD Verification')
    : section.filter(item => item.screenName !== 'PAN Verification');

  let filteredOVDSections = section.filter(item => item.screenName !== 'OVD Verification')
  // console.log("mjjjjjjjrrr==js", loanOffer);

  return (
    <View style={[styles.container]}>

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
              Do you want to reject the case?
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity
                onPress={() => {
                  SalesRejected.mutateAsync()
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
              Do you want to Re-Edit the case?
            </Text>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity
                onPress={() => {
                  SalesReEdit.mutateAsync()
                  setIsReEditModalVisible(false)
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

      <View style={styles.cardContainer}>
        <Text style={styles.activeCardHeaderStyle}>{title}</Text>
        <View
          style={[
            styles.flexRowStyle,
            { justifyContent: 'space-between', marginTop: 15 },
          ]}>
          <Text style={styles.cifIDText}>{`App ID : ${isMainApplicant ? appId : guarantorId}`}</Text>
          <TouchableOpacity
            style={styles.flexRowStyle}
            onPress={() => {
              handleNavigation(
                CKYCData?.isPanAvailable
                  ? ScreenNames.PANVerification
                  : ScreenNames.OVDVerification,
              );
            }}>
            <Text style={styles.cifIDText}>{`Edit `}</Text>
            <Icon name="edit" />
          </TouchableOpacity>
        </View>
        {isSalesReject && <Text style={{ alignSelf: 'flex-start', paddingVertical: 5 }}>{`Case Status : `}
          <Text style={{ alignSelf: 'flex-start', paddingVertical: 5, color: 'red', fontSize: FONT_SIZE.xl }}>{`${'Rejected'}`}</Text></Text>}

        <Divider style={{ marginVertical: 10 }} />
        {section
          .filter(item => item.screenName !== '')
          .map(item => (

            <View key={item.screenName}>
              {
                // !CKYCData?.isPanAvailable && item.screenName =='PAN Verification' ? null : 
                //   CKYCData?.isPanAvailable && item.screenName == 'OVD Verification' ? null : 
                (
                  <>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        item.isActive ? handleNavigation(item.navigation) : null;
                      }}>
                      <Text style={styles.pendingTextLabels}>
                        {item.screenName}
                      </Text>
                      {item.isActive && <Icon name="completed" />}
                    </TouchableOpacity>
                  </>
                )}
            </View>
          ))}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
            // backgroundColor: 'red'
          }}>

          {isRejectButtonVisible && (
            <Button
              halfSize
              text={'Reject'}
              active={!isSalesReject}
              position
              marginTop={30}
              onPress={() => {
                setIsVisibleModal(true)
                // isSalesReject? null:
                //SalesRejected.mutateAsync()

              }}
            />
          )}

          {!continueDisable && (
            <Button
              text={'Continue'}
              active={filteredSections.some(section => !section.isActive)}
              position
              marginTop={30}
              halfSize
              onPress={() => {
                const navigationArray = section.filter(item =>
                  !(loanOffer || loanOffer == undefined)?
                    navigation.navigate('LoanOffer') :
                    // !isSubmitToDisbursementFreeze || 
                    (isSubmitToDisbursementFreeze == null ?
                      isSubmitToDisbursementFreeze != null :
                      !isSubmitToDisbursementFreeze && !isReEdit) ?
                      navigation.navigate('DeferralDocuments') :
                      empStatus && !SactionNextEnable ?
                        navigation.navigate('EmploymentDetails') :
                        CKYCData?.isPanAvailable
                          ? item?.screenName !== 'OVD Verification'
                          : item.screenName !== 'PAN Verification',
                );
                var item;
                for (item of navigationArray) {

                  if (item.navigation == 'LoanRejected' && !isReAppeal) {
                    navigation.navigate('LoanRejected')
                    break;
                  }
                  else if (item.screenName === 'OVD Verification' && (item.isActive == null || item.isActive == false)) {
                    for (item of filteredOVDSections) {

                      if (item.screenName === 'KYC Verification' && (item.isActive == null || item.isActive == false)) {
                        for (item of navigationArray) {
                          if (!item.isActive) {
                            handleNavigation(item.navigation);
                            break;
                          }
                        }
                        break;
                      }
                      else if (!item.isActive) {
                        handleNavigation(item.navigation);
                        break;
                      }
                    }
                    break;
                  }
                  else if (!item.isActive) {
                    handleNavigation(item.navigation);
                    break;
                  }

                }
              }}
            />
          )}



        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
            // backgroundColor: 'red'
          }}>

          {isEditButtonVisible && (
            <Button
              // halfSize
              text={'Re-Edit'}
              active={!isSalesReject}
              position
              marginTop={30}
              onPress={() => {
                // SalesReEdit.mutateAsync()
                setIsReEditModalVisible(true)

              }}
            />
          )}

        </View>

      </View>
    </View>
  );
};
export default SummaryCard;
