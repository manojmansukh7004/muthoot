import React, { FC, useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import { ErrorObject } from 'config/Types';
import { useApplicantDetails } from 'context/useApplicantDetails';
import { DashboardStackParamList } from 'navigation/HomeStack/DashboardStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from 'components/Button';
import useActive from 'hooks/useActive';
import LabelDropdown from 'components/LabelDropdown';
import LabeledTextInput from 'components/LabeledTextInput';
import { useMasterLogin } from 'api/ReactQuery/TwoWheeler/Auth';
import { MasterLoginRequest } from 'api/ReactQuery/TwoWheeler/Auth/types';

type MasterLoginNavigationProp = StackNavigationProp<
    DashboardStackParamList,
    'MasterLogin'
>;
type MasterLoginRouteProp = RouteProp<DashboardStackParamList, 'MasterLogin'>;

interface MasterLoginScreenProps {
    navigation: MasterLoginNavigationProp;
    route: MasterLoginRouteProp;
}

const MasterLogin: FC<MasterLoginScreenProps> = ({ navigation, route }) => {
    const [isError, setIsError] = useState<ErrorObject[]>([]);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [productType, setProductType] = useState<string>('');
    const [productTypeOpen, setProductTypeOpen] = useState<boolean>(false);
    const [appId, setAppId] = useState<string>('');
    const { SaveApplicantId, ResetApplcantDetails } = useApplicantDetails();

    const activeArray = [productType];
    let isActive: boolean = useActive(activeArray);
    let hasError: boolean = isError.some(error => error.hasError === true);

    const handleBackPress = useCallback(() => {
        navigation.navigate('Dashboard'); // Replace 'SpecificScreen' with your desired screen name
        return true;
    }, [navigation]);

    const MasterLoginRequest: MasterLoginRequest = {
        appId: appId,
        productType: productType
    };

    const [
        MasterLogin,
        { data: MasterLoginData, isLoading: MasterLoginIsLoading },
    ] = useMasterLogin(MasterLoginRequest);

    const handleProceed = async () => {
        if (productType === 'New Two-Wheeler') {
            if (appId.startsWith("MU")) {
                await AsyncStorage.setItem('ismasterLogin', 'true')
                navigation.navigate('TwoWheelerStack', { screen: 'LoanSummary', params: { ismasterLogin: true } })
            } else {
                console.log("propr id");

            }
        } else if (productType === 'PL') {
            if (appId.startsWith("PL")) {
                await AsyncStorage.setItem('ismasterLogin', 'true')
                navigation.navigate('PlStack', { screen: 'LoanSummary', params: { ismasterLogin: true } })
            } else {
                console.log("pl propr id");

            }
        }

    }


    useEffect(() => {
        if (MasterLoginData) {
            console.log("MasterLoginData", MasterLoginData);
            MasterLoginData?.isNextEnable? 
            handleProceed() : null
        }
    }, [MasterLoginData])

    useEffect(() => {
        if (appId) {
            SaveApplicantId(appId);
        }
    }, [appId])


    useFocusEffect(
        useCallback(() => {
            const resetDataAndSetLogin = async () => {
                ResetApplcantDetails();
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
        <WaveBackground loading={[MasterLoginIsLoading]} title={'Master Login'}>
            <LabelDropdown
                label="Product type"
                open={productTypeOpen}
                setDropdownOpen={setProductTypeOpen}
                defaultValue={productType}
                options={['New Two-Wheeler', 'PL']}
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
                text={isChanged ? 'Proceed' : 'Next'}
                active={isActive && !hasError}
                marginVertical={10}
                marginTop={100}
                onPress={() => {
                    MasterLogin.mutateAsync()
                }}
            />
        </WaveBackground>
    );
};
export default MasterLogin;


