import React, { FC, useCallback, useEffect, useState } from 'react';
import { BackHandler, View, Text } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import { ErrorObject } from 'config/Types';
import { useApplicantDetails } from 'context/useApplicantDetails';
import { NachReactivationStackParamList } from 'navigation/HomeStack/NachReactivationStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from 'components/Button';
import useActive from 'hooks/useActive';
import LabelDropdown from 'components/LabelDropdown';
import LabeledTextInput from 'components/LabeledTextInput';
import { useGetRepaymentStatus } from 'api/ReactQuery/TwoWheeler/Repayment';
import { getRepaymentStatusRequest } from 'api/ReactQuery/TwoWheeler/Repayment/types';

import { APP_FONTS, FONT_SIZE } from 'config/Fonts';
import Colors from 'config/Colors';
import useShowFlashMessage from 'hooks/useShowFlashMessage';

type NachReactivationNavigationProp = StackNavigationProp<
    NachReactivationStackParamList,
    'NachReactivation'
>;
type NachReactivationRouteProp = RouteProp<NachReactivationStackParamList, 'NachReactivation'>;

interface NachReactivationScreenProps {
    navigation: NachReactivationNavigationProp;
    route: NachReactivationRouteProp;
}

const NachReactivation: FC<NachReactivationScreenProps> = ({ navigation, route }) => {
    const [isError, setIsError] = useState<ErrorObject[]>([]);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [productType, setProductType] = useState<string>('');
    const [productTypeOpen, setProductTypeOpen] = useState<boolean>(false);
    const [appId, setAppId] = useState<string>('');
    const { SaveApplicantId, ResetApplcantDetails } = useApplicantDetails();

    const activeArray = [productType, appId];
    let isActive: boolean = useActive(activeArray);
    let hasError: boolean = isError.some(error => error.hasError === true);

    const handleBackPress = useCallback(() => {
        navigation.navigate('Dashboard'); // Replace 'SpecificScreen' with your desired screen name
        return true;
    }, [navigation]);

    const getRepaymentStatusRequest: getRepaymentStatusRequest = {
        appId: appId,
        productType: productType
    };

    const [
        RepaymentStatus,
        { data: RepaymentStatusData, isLoading: RepaymentStatusIsLoading },
    ] = useGetRepaymentStatus(getRepaymentStatusRequest);

    const getRepaymentCancelRequest: getRepaymentStatusRequest = {
        appId: appId,
        productType: productType,
        type: 'Cancel'
    };

    const [
        RepaymentCancel,
        { data: RepaymentCancelData, isLoading: RepaymentCancelIsLoading },
    ] = useGetRepaymentStatus(getRepaymentCancelRequest);

    const [
        ExistingRepaymentCancel,
        { data: ExistingRepaymentCancelData, isLoading: ExistingRepaymentCancelIsLoading },
    ] = useGetRepaymentStatus(getRepaymentCancelRequest);


    const handleBankProceed = async () => {
        if (productType === 'New Two-Wheeler') {
            await AsyncStorage.setItem('isNachReactivation', 'true')
            navigation.navigate('TwoWheelerStack', { screen: 'BankDetails' })

        } else if (productType === 'PL') {
            await AsyncStorage.setItem('isNachReactivation', 'true')
            navigation.navigate('PlStack', { screen: 'BankDetails' })
        }

    }

    const handleRepaymentProceed = async () => {
        if (productType === 'New Two-Wheeler') {
            await AsyncStorage.setItem('isNachReactivation', 'true')
            navigation.navigate('TwoWheelerStack', { screen: 'RepaymentDetails' })

        } else if (productType === 'PL') {
            await AsyncStorage.setItem('isNachReactivation', 'true')
            navigation.navigate('PlStack', { screen: 'RepaymentDetails' })
        }

    }

    useEffect(() => {
        if (RepaymentCancelData) {
            handleBankProceed()
        }
    }, [RepaymentCancelData])

    useEffect(() => {
        if (ExistingRepaymentCancelData) {
            handleRepaymentProceed()
        }
    }, [ExistingRepaymentCancelData])

    useEffect(() => {
        if (RepaymentStatusData) {
            console.log("RepaymentStatusData", RepaymentStatusData);
            setIsChanged(false)
            RepaymentStatusData?.isError ?
                useShowFlashMessage('warning', RepaymentStatusData?.statusMessage) : null
            // handleProceed()
            // MasterLoginData?.isNextEnable? 
            // handleProceed() : null
        }
    }, [RepaymentStatusData])

    useEffect(() => {
        if (appId) {
            SaveApplicantId(appId);
        }
    }, [appId])
    console.log("appId", appId);


    // useEffect(()=>{
    //     RepaymentStatus.mutateAsync() await AsyncStorage.getItem('ismasterLogin') 
    // },[])


    useFocusEffect(
        useCallback(() => {
            const resetDataAndSetLogin = async () => {
                // ResetApplcantDetails();
                await AsyncStorage.setItem('ismasterLogin', 'false');
            };

            resetDataAndSetLogin();
            BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            };
        }, [handleBackPress])
    );



    return (
        <WaveBackground loading={[RepaymentStatusIsLoading, RepaymentCancelIsLoading, ExistingRepaymentCancelIsLoading]} title={'NACH Reactivation'}>
            <LabelDropdown
                label="Product type"
                open={productTypeOpen}
                setDropdownOpen={setProductTypeOpen}
                defaultValue={productType}
                options={["New Two-Wheeler", 
                    // "PL"
                ]}
                setSelectedOption={value => setProductType(value)}
                setSelectedItem={item => { }}
                isChange={setIsChanged}
                mandatory
                zIndex={productTypeOpen ? 1000 : 0}
            />

            <LabeledTextInput
                label="App ID"
                setErrorFlag={setIsError}
                isChange={setIsChanged}
                onChange={setAppId}
                defaultValue={appId}
                IsErrorArray={isError}
                maxLength={25}
                autoCapitalize='characters'
                // NumberPad
                mandatory
                disabled={productType == ''}
            />

            <Button
                text={'View NACH Status'}
                active={isActive && !hasError}
                marginVertical={5}
                marginTop={50}
                onPress={() => {
                    RepaymentStatus.mutateAsync()
                }}
            />

            {RepaymentStatusData && !isChanged && (
                <View
                    style={{
                        marginVertical: 5,
                        // marginHorizontal: 20,
                        justifyContent: 'center',
                        marginTop: 20,
                    }}>

                    <Text style={{ color: Colors.LabelGrey, fontSize: FONT_SIZE.m, fontFamily: APP_FONTS.Roboto_Regular, marginTop: 10, marginHorizontal: 20, }}>
                        {`Repayment Mode : `}
                        <Text style={{ color: Colors.Black, fontSize: FONT_SIZE.l, fontFamily: APP_FONTS.Roboto_Regular }}>
                            {RepaymentStatusData?.paymentMode || ''}
                        </Text>
                    </Text>

                    <Text style={{ color: Colors.LabelGrey, fontSize: FONT_SIZE.m, fontFamily: APP_FONTS.Roboto_Regular, marginTop: 10, marginHorizontal: 20 }}>
                        {`Nach Status : `}
                        <Text style={{ color: Colors.Black, fontSize: FONT_SIZE.l, fontFamily: APP_FONTS.Medium }}>
                            {(RepaymentStatusData?.enachStatus)}
                        </Text>
                    </Text>

                    {
                        !RepaymentStatusData?.isError && RepaymentStatusData?.isCaseSubmittoLMS &&
                        <View>
                            <Button
                                text={'Add New Bank Details'}
                                active={isActive && !hasError}
                                marginVertical={5}
                                marginTop={30}
                                onPress={() => {
                                    RepaymentCancel.mutateAsync()
                                    // handleBankProceed() mj
                                }}
                            />

                            {RepaymentStatusData?.isNewMandateVisible &&
                                <Button
                                    text={'Mandate with Existing Bank Details'}
                                    active={isActive && !hasError}
                                    marginVertical={5}
                                    onPress={() => {
                                        ExistingRepaymentCancel.mutateAsync()
                                        // handleRepaymentProceed()
                                    }}
                                />}
                        </View>}

                </View>
            )}

        </WaveBackground>
    );
};
export default NachReactivation;


