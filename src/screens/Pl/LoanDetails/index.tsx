import React, { FC, useCallback, useEffect, useState } from 'react';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, BackHandler, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import WaveBackground from 'components/WaveBackground';
import { useApplicantDetails } from 'context/useApplicantDetails';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import LabelDropdown from 'components/LabelDropdown';
import Slider from '@react-native-community/slider';
import { ConvertToPrefixedAmount } from 'config/Functions/ConvertToPrefix';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import LabeledTextInput from 'components/LabeledTextInput';
import LabeledRadioButtonGroup from 'components/RadioButtonGroup';
import useActive from 'hooks/useActive';
import Button from 'components/Button';
import { ErrorObject } from 'config/Types';
import LoanSummaryButton from 'components/LoanSummaryButton';
import {
  useVehicalType,
  useGetManufacture,
  useGetModal,
  useGetSchemeDetails,
  useGetAllSchemeDetails,
  useGetRoadTax,
  useGetTenure,
  useGetEMIValue,
  useGetPLIValue,
  useGetLoanDetails,
  useSetLoanDetails,
  useInsuranceCap,

} from '../../../api/ReactQuery/PL/LoanDetails';
import {
  getSchemeDetailsRequest,
  emiRequest,
  pliRequest,
  setLoanDetailsRequest,
  getAllSchemeDetailsRequest,
} from '../../../api/ReactQuery/PL/LoanDetails/types';
import { useGetBRE2Status } from '../../../api/ReactQuery/PL/RuleEngineApi';
import { APP_FONTS, FONT_SIZE } from 'config/Fonts';
import useFontNormalise from 'hooks/useFontNormalise';
import Colors from 'config/Colors';
import { useGetCriff, useGetSherlock } from 'api/ReactQuery/PL/BureauApi';
import { GetSherlockRequest } from 'api/ReactQuery/PL/BureauApi/types';
import Modal from 'components/Modal';
import { usedViewStatus } from 'context/useViewStatus';
import LabeledDropdown from 'components/LabeledDropdown';
import Icon from 'components/Icon';
import moment from 'moment';

type LoanDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LoanDetails'
>;
type LoanDetailsRouteProp = RouteProp<RootStackParamList, 'LoanDetails'>;

interface LoanDetailsScreenProps {
  navigation: LoanDetailsNavigationProp;
  route: LoanDetailsRouteProp;
}

const LoanDetails: FC<LoanDetailsScreenProps> = ({ navigation }) => {
  const { applicantId, isMainApplicant, guarantorId } =
    useApplicantDetails();
  // var applicantId = "MU358989"
  const { useViewStatus } = usedViewStatus();
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [isConsent, setIsConsent] = useState<boolean>(false);
  const [isConsentUpdate, setIsConsentUpdate] = useState<boolean>(false);

  const [isError, setIsError] = useState<ErrorObject[]>([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isRemarkChanged, setIsRemarkChanged] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(60);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [stopBureauCalls, setStopBureauCalls] = useState<boolean>(false);
  const [vehicalType, setVehicalType] = useState<string>('');
  const [manufacturer, setManufacturer] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [scheme, setScheme] = useState<string>('');
  const [isSchemeChange, setIsSchemeChange] = useState<boolean>(false);
  const [isAmtRequestedIsFreez, setIsAmtRequestedIsFreez] = useState<boolean>(false);
  const [existingVehicleModel, setExistingVehicleModel] = useState<string>('');

  const [schemeItem, setSchemeItem] = useState<any>('');
  const [exShoroomPrice, setExShoroomPrice] = useState<string>('0');
  const [exShoroomPriceCaping, setExShoroomPriceCaping] = useState<string>('');
  const [dob, setDob] = useState<any>('');

  const [roadTax, setRoadTax] = useState<string>('0');
  const [insuranceAmount, setInsuranceAmount] = useState<string>('0');
  const [registrationCharges, setRegistrationCharges] = useState<string>('0');
  const [accessories, setAccessories] = useState<string>('0');
  const [registrationChargesCamping, setRegistrationChargesCamping] = useState<string>('');
  const [accessoriesCamping, setAccessoriesCamping] = useState<boolean>(false);
  const [maxCapAmnt, setmaxCapAmnt] = useState<string>('');

  const [onRoadPrice, setonRoadPrice] = useState<string>('0');
  const [margin, setMargin] = useState<string>('0');
  const [LTV, setLTV] = useState<string>('');
  const [LTVPercentage, setLTVPercentage] = useState<string>('0');
  const [amtRequested, setAmtRequested] = useState<string>('');
  const [approvedLoanAmount, setApprovedLoanAmount] = useState<string>('');
  const [repaymentMode, setRepaymentMode] = useState<string>('');
  const [companyProofId, setCompanyProofId] = useState<string>('');
  const [vintageProof, setVintageProof] = useState<string>('');
  const [tenure, setTenure] = useState<string>('');
  const [tenureOpen, setTenureOpen] = useState<boolean>(false);
  const [PLItenure, setPLITenure] = useState<string>('');
  const [PLItenureOpen, setPLITenureOpen] = useState<boolean>(false);
  const [ROI, setROI] = useState<any>('');
  const [maxValue, setMaxValue] = useState<string>('500000');
  const [addOnCharges, setAddOnCharges] = useState<string>('700');
  const [noOfAdvEmi, setNoOfAdvEmi] = useState<string>('0');
  const [CLI, setCLI] = useState<string>('');
  const [CLIAmount, setCLIAmount] = useState<string>('0');
  const [CLIAddInLoanAmount, setCLIAddInLoanAmount] = useState<string>('');
  const [PLI, setPLI] = useState<string>('');
  const [PLIAmount, setPLIAmount] = useState<string>('0');
  const [PLIAddInLoanAmount, setPLIAddInLoanAmount] = useState<string>('');
  const [PLIAllow, setPLIAllow] = useState<boolean>(true);

  const [finalLoanAmount, setFinalLoanAmount] = useState<string>('');
  const [EMIAmount, setEMIAmount] = useState<string>('');
  const [advEMIAmount, setAdvEMIAmount] = useState<string>('');
  const [remark, setRemark] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [downPaymentvalue, setDownPaymentValue] = useState<string>('');

  const [serviceCharge, setServiceCharge] = useState<string>('');
  const [DocumentationChargeWithWaivedValue, setDocumentationChargeWithWaivedValue] = useState<string>('');
  const [documentationWaivedValue, setdocumentationWaivedValue] = useState<string>('');

  const [documentationCharge, setDocumentationCharge] = useState<string>('');
  const [documentationChargeMin, setDocumentationChargeMin] = useState<string>('');
  const [documentationChargeMax, setDocumentationChargeMax] = useState<string>('');

  const [documentationChargesWaiver, setDocumentationChargesWaiver] = useState<string>('');

  const [saveEnable, setSaveEnable] = useState<boolean>(false);
  const [popupVisible, setPopUPVisible] = useState<boolean>(false);
  const [minMarginAmount, setMinMarginAmount] = useState<string>('');
  const [maxLoanAmount, setMaxLoanAmount] = useState<string>('');
  const [nextEnable, setNextEnable] = useState<boolean>(false);
  const [commonPopupVisible, setCommonPopUPVisible] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [irr, setIrr] = useState<number>(0);

  const [emiWithoutBpi, setEmiWithoutBpi] = useState<string>('');
  const [emiWithBpi, setEmiWithBpi] = useState<string>('');
  const [firstEmiDate, setFirstEmiDate] = useState<string>('');
  const [bpiDay, setBpiDay] = useState<string>('');
  const [bpiAmount, setBpiAmount] = useState<string>('');

  const getAge = (birthDate: string) => Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e+10);

  function getDecimalAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const decimalMonths = months + days / new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    const decimalAge = (years + decimalMonths / 12).toFixed(1);

    return decimalAge;
  }
  
  const activeArray = [
    vehicalType,
    manufacturer,
    vehicleModel,
    scheme,
    // exShoroomPrice,
    // roadTax,
    // insuranceAmount,
    // registrationCharges,
    // accessories,
    // onRoadPrice,
    margin,
    LTV,
    tenure,
    ROI,
    addOnCharges,
    noOfAdvEmi,
    CLI,
    PLI,
    finalLoanAmount,
    EMIAmount,
    remark,
    amtRequested,
    isConsent && documentationChargesWaiver,
    PLI == 'Yes' && PLItenure,
    CLI == 'Yes' ? CLIAddInLoanAmount : true,
    PLI == 'Yes' ? PLIAddInLoanAmount : true

  ];

  const activeEMIArray = [ROI, finalLoanAmount, tenure];

  let isActive: boolean = useActive(activeArray);
  let activeEMI: boolean = useActive(activeEMIArray);

  let hasError: boolean = isError.some(error => error.hasError === true);

  interface Item {
    label: string | number;
    value: string | number;
    schemeCode?: string;
    schemeName?: string;
    tenure?: string;
    roi?: number;
    pliAmount?: string;
  }

  const getSchemeDetailsRequest: getSchemeDetailsRequest = {
    schemeCode: schemeItem?.schemeCode,
    schemeName: scheme,
    appId: applicantId
    // isMainApplicant ? applicantId : guarantorId,
  };

  const emiRequest: emiRequest = {
    flatRate: ROI.roi,
    loanAmount: parseFloat(finalLoanAmount),
    tenureInMonths: parseFloat(tenure),
    appId: applicantId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    schemeCode: schemeItem?.schemeCode,
    schemeName: scheme,
    exShowRoomPrice: parseFloat('0')
  };

  const pliRequest: pliRequest = {

    applicantId: applicantId,
    loanAmount: approvedLoanAmount,
    tenure: PLItenure,
  };

  const setLoanDetailsRequest: setLoanDetailsRequest = {
    appId: applicantId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    updatedBy: isMainApplicant ? applicantId : guarantorId,
    schemeName: scheme,
    schemeId: schemeItem?.schemeCode,
    loanAmountRequested: parseFloat(amtRequested?.replaceAll(',', '')),
    tenure: parseFloat(tenure),
    roi: ROI.roi,
    ltv: parseFloat(LTVPercentage),
    maxLoanAmount: parseFloat(maxValue),
    noOfAdvanceEmi: parseFloat(noOfAdvEmi),
    emiAmount: parseFloat(EMIAmount),
    minAndMaxTenure: 0,
    margin: parseFloat(margin),
    isCli: CLI == 'Yes' ? true : false,
    isCliAddLoan: CLIAddInLoanAmount == 'Yes' ? true : false,
    cliAmount: CLI == 'Yes' ? parseFloat(CLIAmount) : null,
    isPli: PLI == 'Yes' ? true : false,
    isPliAddLoan: PLIAddInLoanAmount == 'Yes' ? true : false,
    pliAmount: PLI == 'Yes' ? parseFloat(PLIAmount) : null,
    finalLoanAmount: parseFloat(finalLoanAmount),
    unsignedSanctionLetter: '',
    signSanctionLetter: '',
    remarks: remark,
    manufacturer: manufacturer,
    vehicleType: vehicalType,
    vehicleModel: vehicleModel,
    assetCode: '',
    exShowRoomPrice: parseFloat(exShoroomPrice?.replaceAll(',', '')),
    roadTax: parseFloat(roadTax),
    insurance: parseFloat(insuranceAmount?.replaceAll(',', '')),
    registrationCharges: parseFloat(registrationCharges),
    accessories: parseFloat(accessories),
    ltvAmount: parseFloat(LTV),
    approvedLoanAmount: parseFloat(approvedLoanAmount),
    on_road_price: parseFloat(onRoadPrice),
    downPayment: parseFloat(downPayment),
    actualDownPayment: parseFloat(downPaymentvalue),
    addOnCharges: parseFloat(addOnCharges),
    companyProofId: companyProofId,
    repaymentMode: repaymentMode,
    vintageProof: vintageProof,
    serviceCharges: parseFloat(serviceCharge),
    documentationChargesWithoutWaived: parseFloat(DocumentationChargeWithWaivedValue),
    documentationCharges: parseFloat(documentationCharge),
    documentationWaived: isConsent,
    isAmtRequestedIsFreez: isAmtRequestedIsFreez,
    pliTenure: parseFloat(PLItenure),
    irr: irr,
    isReEdit: true,
    documentationChargesWaiver: documentationChargesWaiver,
    finalDocumentationCharges: (Number(documentationCharge) - Number(documentationChargesWaiver)).toString(),
    emiWithoutBpi: Number(emiWithoutBpi),
    firstEmiDate: firstEmiDate,
    bpiDay: Number(bpiDay),
    bpiAmount: Number(bpiAmount),
    emiWithBpi: Number(emiWithBpi)
  };

  const GetSherlockRequest: GetSherlockRequest = {
    applicantId: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
  };

  const [
    GetSherlockResponse,
    { data: GetSherlockResponseData, isLoading: GetSherlockResponseIsLoading },
  ] = useGetSherlock(GetSherlockRequest);


  const [
    GetBRE2Status,
    { data: GetBRE2StatusData, isLoading: GetBRE2StatusIsLoading },
  ] = useGetBRE2Status(
    isMainApplicant ? applicantId : guarantorId,
    isMainApplicant ? 'mainApplicant' : 'guarantor',
  );

  const [
    SetLoanDetails,
    { data: setLoanDetailsData, isLoading: setLoanDetailsIsLoading },
  ] = useSetLoanDetails(setLoanDetailsRequest);

  const [
    GetLoanDetails,
    { data: getLoanDetailsData, isLoading: getLoanDetailsIsLoading },
  ] = useGetLoanDetails(`/${applicantId}/mainApplicant`);

  const [
    GetManufacture,
    { data: GetManufactureData },
  ] = useGetManufacture();


  const [
    VehicalType,
    { data: vechileTypeData },
  ] = useVehicalType(`?manufacturer=${manufacturer}`);

  const [
    GetInsuranceCap,
    { data: InsuranceCapData, isLoading: GetInsuranceCapIsLoading },
  ] = useInsuranceCap(`/${vehicalType}`);

  const [GetModal, { data: modalData }] =
    useGetModal(
      `?vechileType=${vehicalType}&vechileManufacturer=${manufacturer}&appId=${applicantId}`,
    );

  const getAllSchemeDetailsRequest: getAllSchemeDetailsRequest = {
    appId: isMainApplicant ? applicantId : guarantorId,
    applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    manufacturer: manufacturer,
    vechicleModel: vehicleModel,
    vechicleType: vehicalType,
  };

  const [
    GetAllSchemeDetails,
    { data: getAllSchemeDetailsData },
  ] = useGetAllSchemeDetails(getAllSchemeDetailsRequest);

  const [GetCriff, { data: GetCriffData }] =
    useGetCriff({
      applicant_uniqueid: isMainApplicant ? applicantId : guarantorId,
      applicantType: isMainApplicant ? 'mainApplicant' : 'guarantor',
    });

  const [
    GetSchemeDetails,
    { data: schemeDetailsData },
  ] = useGetSchemeDetails(getSchemeDetailsRequest);

  const [GetRoadTax, { data: RoadTaxData }] =
    useGetRoadTax(
      `?appId=${applicantId}&price=${exShoroomPrice?.replaceAll(
        ',',
        '',
      )}&type=${vehicalType}&applicantType=${'mainApplicant'}&manufacture=${manufacturer}&model=${vehicleModel}`,
    );

  const [
    GetTenureDetails,
    { data: getTenureDetailsData },
  ] = useGetTenure(`/${schemeItem?.schemeCode}`);

  // console.log("getTenureDetailsData", getTenureDetailsData);

  const [
    GetEmiValue,
    { data: GetEmiValueData, isLoading: GetEmiValueDataIsLoading },
  ] = useGetEMIValue(emiRequest);

  const [
    GetPLIValue,
    { data: GetPLIValueData, isLoading: GetPLIValueDataIsLoading },
  ] = useGetPLIValue(pliRequest);

  useEffect(() => {
    if (PLItenure && isChanged) {
      GetPLIValue.mutateAsync()
    }
  }, [PLItenure])

  useEffect(() => {
    if (GetPLIValueData) {
      console.log("GetPLIValueData************************,", GetPLIValueData);
      setPLIAmount(
        GetPLIValueData?.premium?.toString()
      )
      setPLIAllow(
        GetPLIValueData?.premium?.toString()
          == '0' ? false : true)
      // setPLI(
      //   GetPLIValueData?.premium?.toString()
      //     == '0' ? 'No' : '')
      setPLIAddInLoanAmount(
        GetPLIValueData?.premium?.toString()
          == '0' ? 'No' : '')

      // setRegistrationChargesCamping(InsuranceCapData?.insuranceAmnt?.toString());

    }
  }, [GetPLIValueData])

  useEffect(() => {
    if (vehicalType) {
      GetInsuranceCap.mutateAsync()
    }
  }, [vehicalType])

  useEffect(() => {
    if (InsuranceCapData) {
      console.log("InsuranceCapData", InsuranceCapData);

      setRegistrationChargesCamping(InsuranceCapData?.insuranceAmnt?.toString());
      setmaxCapAmnt(InsuranceCapData?.maxCapAmnt?.toString() || '0');
      setAccessoriesCamping(InsuranceCapData?.accessories);

    }
  }, [InsuranceCapData])

  useEffect(() => {
    if (GetBRE2StatusData) {
      console.log("GetBRE2StatusData", GetBRE2StatusData);
      GetCriff.mutateAsync();

      setStopBureauCalls(true);
      // if (GetBRE2StatusData.bre2status === 'Bre2_Approved') {
      //   navigation.navigate('LoanOffer');
      // } else if (
      //   GetBRE2StatusData.bre2status === 'Bre2_Manual' &&
      //   GetCriffData
      // ) {
      //   setTimer(60);
      //   setIsProcessing(false);
      //   navigation.navigate('ManualUnderwriting1', {
      //     GetCriffResponse: GetCriffData,
      //     isNavigateLoanOffer: true,
      //   });
      // } else if (GetBRE2StatusData.bre2status === 'Bre2_Rejected') {
      //   setTimer(60);
      //   setIsProcessing(false);
      //   navigation.navigate('LoanRejected');
      // }
    }
  }, [GetBRE2StatusData]);

  useEffect(() => {
    if (GetBRE2StatusData) {

      setStopBureauCalls(true);
      if (GetBRE2StatusData.bre2status === 'Bre2_Approved') {
        //Directly go to the deviation Page
        // isMainApplicant ?
        //   navigation.navigate('DeviationDocuments', {
        //     GetCriffResponse: GetCriffData,
        //     isNavigateLoanOffer: true,
        //     breStatus: 'Bre2_Approved'
        //   }) :
        navigation.navigate('LoanOffer');

      } else if (
        GetBRE2StatusData.bre2status === 'Bre2_Manual' &&
        GetCriffData
      ) {
        setTimer(60);
        setIsProcessing(false);


        // isMainApplicant ?
        //   navigation.navigate('DeviationDocuments', {
        //     GetCriffResponse: GetCriffData,
        //     isNavigateLoanOffer: true,
        //     breStatus: 'Bre2_Manual'
        //   }) :
        navigation.navigate('ManualUnderwriting1', {
          GetCriffResponse: GetCriffData,
          isNavigateLoanOffer: true,
        });

      } else if (GetBRE2StatusData.bre2status === 'Bre2_Rejected') {
        setTimer(60);
        setIsProcessing(false);
        navigation.navigate('LoanRejected');
      }
    }
  }, [GetCriffData]);

  useEffect(() => {
    if (setLoanDetailsData) {
      // GetSherlockResponse.mutateAsync();
      // setIsProcessing(true);
      GetBRE2Status.mutateAsync();
      setNextEnable(true)
    }
  }, [setLoanDetailsData]);

  useEffect(() => {
    if (timer > 0 && isProcessing) {
      if (timer % 20 === 0 && timer != 60 && !stopBureauCalls) {
        // GetSherlockResponse.mutateAsync();
      }
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsVisibleModal(true);
      setTimer(60);
      setIsProcessing(false);

    }
  }, [timer, isProcessing]);

  useEffect(() => {
    if (GetSherlockResponseData) {
      console.log("GetSherlockResponseData", GetSherlockResponseData);

      if (
        GetSherlockResponseData?.sherlockStatus?.toUpperCase() === 'APPROVED' ||
        GetSherlockResponseData?.sherlockStatus?.toUpperCase() === 'REFER' ||
        GetSherlockResponseData?.sherlockStatus?.toUpperCase() === 'IN_PROCESS'
      ) {
        setIsProcessing(false);
        GetBRE2Status.mutateAsync();
        // GetCriff.mutateAsync();

      }
      else if (GetSherlockResponseData?.sherlockStatus?.toUpperCase() === 'REJECT') {
        setIsProcessing(false);
        navigation.navigate('LoanRejected');
      }

    }
    else if (GetSherlockResponseData) {
      // console.log("GetSherlockResponseData fail");
      setIsProcessing(false);
      GetBRE2Status.mutateAsync();
      // GetCriff.mutateAsync();

    }
    //if sherlock fails - temporary
  }, [GetSherlockResponseData]);

  // console.log("saveEnable",saveEnable, isChanged);

  useEffect(() => {
    if(getLoanDetailsData){
      console.log('getLoanDetailsData', getLoanDetailsData.dob,);
      setExistingVehicleModel(getLoanDetailsData?.assetModel);
      setDob(getLoanDetailsData?.dob?.toString())

    }
    if (getLoanDetailsData?.vehicleType) {
      setExistingVehicleModel(getLoanDetailsData?.assetModel);
      setDob(getLoanDetailsData?.dob?.toString())
      setDocumentationCharge((Math.ceil(parseFloat(getLoanDetailsData?.documentationCharges)))?.toString() || '0',);
      setDocumentationChargesWaiver(getLoanDetailsData?.documentationChargesWaiver?.toString())
      setIsAmtRequestedIsFreez(getLoanDetailsData?.isAmtRequestedIsFreez)
      setIsConsent(getLoanDetailsData?.documentationWaived)
      setDocumentationChargeWithWaivedValue(getLoanDetailsData?.documentationChargesWithoutWaived)
      setdocumentationWaivedValue(getLoanDetailsData?.documentationWaivedValue)
      setServiceCharge(getLoanDetailsData?.serviceCharges?.toString() || '0');
      setManufacturer(getLoanDetailsData?.manufacturer);
      setVehicalType(getLoanDetailsData?.vehicleType);
      setVehicleModel(getLoanDetailsData?.vehicleModel);

      setScheme(getLoanDetailsData?.schemeName);
      setSchemeItem({ schemeCode: getLoanDetailsData?.schemeId });
      setExShoroomPrice(getLoanDetailsData?.exShowRoomPrice?.toString());
      setRoadTax(getLoanDetailsData?.roadTax?.toString());
      setRegistrationCharges(getLoanDetailsData?.registrationCharges?.toString());
      setAccessories(getLoanDetailsData?.accessories?.toString());
      setInsuranceAmount(getLoanDetailsData?.insurance?.toString());
      setonRoadPrice(getLoanDetailsData?.on_road_price?.toString());
      setLTVPercentage(getLoanDetailsData?.ltv?.toString());
      setLTV(getLoanDetailsData?.ltvAmount?.toString());
      setMargin(getLoanDetailsData?.margin?.toString());
      setAmtRequested(getLoanDetailsData?.loanAmountRequested?.toString());
      setApprovedLoanAmount(getLoanDetailsData?.approvedLoanAmount?.toString() || '0');
      setTenure(getLoanDetailsData?.tenure?.toString());
      setPLITenure(getLoanDetailsData?.pliTenure?.toString())
      setROI({ roi: getLoanDetailsData?.roi?.toString() });
      setAddOnCharges(getLoanDetailsData?.addOnCharges?.toString());
      setCLI(getLoanDetailsData?.isCli ? 'Yes' : 'No');
      setCLIAddInLoanAmount(getLoanDetailsData?.isCliAddLoan ? 'Yes' : 'No');
      setCLIAmount(getLoanDetailsData?.cliAmount?.toString());
      setPLI(
        // getLoanDetailsData?.pliAmount?.toString() == '0' ? 'No' : 
        getLoanDetailsData?.isPli ? 'Yes' : 'No');
      setPLIAddInLoanAmount(
        // getLoanDetailsData?.pliAmount?.toString() == '0' ? 'No' :
        getLoanDetailsData?.isPliAddLoan ? 'Yes' : 'No');
      setPLIAmount(getLoanDetailsData?.pliAmount?.toString() || '');
      // setPLIAllow(getLoanDetailsData?.pliAmount?.toString() == '0' ? false : true)
      setFinalLoanAmount(getLoanDetailsData?.finalLoanAmount?.toString());
      setEMIAmount(getLoanDetailsData?.emiAmount?.toString());
      setNoOfAdvEmi(getLoanDetailsData?.noOfAdvanceEmi?.toString());
      setRemark(getLoanDetailsData?.remarks);
      setMaxValue(getLoanDetailsData?.maxLoanAmount?.toString());
      setMaxLoanAmount(getLoanDetailsData?.maxLoanAmount?.toString());
      setDownPayment(getLoanDetailsData?.downPayment?.toString());
      setDownPaymentValue(getLoanDetailsData?.actualDownPayment?.toString());
      setAdvEMIAmount((getLoanDetailsData?.emiAmount * getLoanDetailsData?.noOfAdvanceEmi)?.toString());
      setSaveEnable(getLoanDetailsData?.schemeName ? true : false);
      setNextEnable(getLoanDetailsData?.schemeName ? true : false)
      setIsRemarkChanged(false)

    } 
  }, [getLoanDetailsData]);



  useEffect(() => {
    if (GetEmiValueData && GetEmiValueData.appId) {
      console.log('addd', GetEmiValueData, Math.ceil(parseFloat(GetEmiValueData?.documentationCharges) - Number(GetEmiValueData?.documentationWaivedValue))?.toString());

      setIsConsent(false)
      setSaveEnable(true);
      setNextEnable(false)
      setIsChanged(false)
      setEmiWithoutBpi(GetEmiValueData?.emiWithoutBpi?.toString());
      setEmiWithBpi(GetEmiValueData?.emiWithBpi?.toString());
      setFirstEmiDate(GetEmiValueData?.firstEmiDate?.toString());
      setBpiDay(GetEmiValueData?.bpiDay?.toString());
      setBpiAmount(GetEmiValueData?.bpiAmount?.toString());

      setEMIAmount(GetEmiValueData?.emiWithBpi?.toString());
      setAdvEMIAmount((GetEmiValueData?.emiWithBpi * parseFloat(noOfAdvEmi)).toString() || '0');
      setdocumentationWaivedValue(GetEmiValueData?.documentationWaivedValue?.toString() || '0');
      setDocumentationCharge(Math.ceil(Number(GetEmiValueData?.documentationCharges))?.toString());
      setDocumentationChargeMin(Math.ceil(Number(GetEmiValueData?.documentationWaivedValueMin))?.toString());
      setDocumentationChargeMax(Math.ceil(Number(GetEmiValueData?.documentationWaivedValue))?.toString());

      setDocumentationChargesWaiver('')

      setDocumentationChargeWithWaivedValue(Math.ceil(parseFloat(GetEmiValueData?.documentationCharges))?.toString() || '0');
      setServiceCharge(Math.ceil(parseFloat(GetEmiValueData?.serviceCharges))?.toString() || '0');
      setRepaymentMode(GetEmiValueData?.repaymentMode);
      setCompanyProofId(GetEmiValueData?.companyProofId);
      setVintageProof(GetEmiValueData?.vintageProof);
      setIrr(GetEmiValueData?.irr)
      var temp = !isConsent ? Math.ceil(Number(GetEmiValueData?.documentationCharges))?.toString() : Math.ceil(Number(GetEmiValueData?.documentationCharges) - Number(GetEmiValueData?.documentationWaivedValue))?.toString()

      setDownPayment(
        Math.ceil(
          GetEmiValueData?.emiWithBpi * parseFloat(noOfAdvEmi) +
          Math.ceil(parseFloat(GetEmiValueData?.serviceCharges)) +
          parseFloat(margin) +
          parseFloat(CLI == 'No' ? '0' : CLIAddInLoanAmount == 'Yes' ? '0' : CLIAmount) +
          parseFloat(PLI == 'No' ? '0' : PLIAddInLoanAmount == 'Yes' ? '0' : PLIAmount) +
          parseFloat(temp)
        ).toString() || '0',
      );
      setDownPaymentValue(
        Math.ceil(
          GetEmiValueData?.emiWithBpi * parseFloat(noOfAdvEmi) +
          Math.ceil(parseFloat(GetEmiValueData?.serviceCharges)) +
          parseFloat(margin) +
          parseFloat(CLI == 'No' ? '0' : CLIAddInLoanAmount == 'Yes' ? '0' : CLIAmount) +
          parseFloat(PLI == 'No' ? '0' : PLIAddInLoanAmount == 'Yes' ? '0' : PLIAmount) +
          parseFloat(GetEmiValueData?.documentationCharges),
        ).toString() || '0',
      );

    }
    else if (GetEmiValueData) {
      setPopUPVisible(true),
        setIsChanged(true)
      setSaveEnable(false)
    }
  }, [GetEmiValueData]);

  useEffect(() => {
    if (exShoroomPrice && isChanged) {

      parseFloat(exShoroomPrice?.replaceAll(',', '')) > parseFloat(exShoroomPriceCaping) ?
        (setExShoroomPrice(exShoroomPriceCaping),
          useShowFlashMessage(
            'warning',
            `Please decrease the ex-showroom price as it exceeding the limit ₹ ${ConvertToPrefixedAmount(
              exShoroomPriceCaping,
            )}`,
          )
        )
        : null
    }
  }, [exShoroomPrice]);



  useEffect(() => {
    if (registrationCharges && isChanged) {

      setAccessories('')
      parseFloat(registrationCharges?.replaceAll(',', '')) > parseFloat(registrationChargesCamping) ?
        (setRegistrationCharges(registrationChargesCamping),
          useShowFlashMessage(
            'warning',
            `Please decrease the Registration Charges as it exceeding the limit ₹ ${ConvertToPrefixedAmount(
              registrationChargesCamping,
            )}`,
          )
        )
        : null
    }
  }, [registrationCharges]);

  useEffect(() => {
    if (accessories && isChanged) {

      var accessoriesCampingAmt: number = accessoriesCamping ? (parseFloat(maxCapAmnt) - parseFloat(registrationCharges ? (registrationCharges?.replaceAll(',', '')) : '0')) : 0
      console.log("ffffff", accessoriesCamping, accessoriesCampingAmt);

      parseFloat(accessories?.replaceAll(',', '')) > (accessoriesCampingAmt) ?
        (setAccessories(accessoriesCampingAmt?.toString()),
          useShowFlashMessage(
            'warning',
            `Please decrease the Accessories price as it exceeding the limit ₹ ${ConvertToPrefixedAmount(
              accessoriesCampingAmt?.toString(),
            )}`,
          )
        )
        : null
    }
  }, [accessories]);

  const handleTenure = (item) => {

    // setPLIAmount(Math.ceil(parseFloat(item.pliAmount)).toString())
    console.log("dob",dob);
    

    // var datearray =   moment(dob).format('YYYY-MM-DD');
    const datearray: string = moment(dob, 'DD-MM-YYYY').format('YYYY-MM-DD');
    console.log("datearray",datearray);

    // var newdate = datearray[2] + '-' + datearray[1] + '-' + datearray[0];
    // let age: string = getAge(newdate) + (parseFloat(item.tenure) / 12)
    const age: string = (parseFloat(getDecimalAge(datearray)) + (parseFloat(item.tenure) / 12)).toFixed(1);

    console.log("getDecimalAge",getDecimalAge(datearray));

    console.log("age",age);
    

    // parseFloat(age) >= 65 ? setTenure('') : null;
    // parseFloat(age) >= 65 ? setROI('') : setROI(item);
    // parseFloat(age) >= 65 ?
    //   useShowFlashMessage(
    //     'warning',
    //     `Please decrease the Tenure as it exceeding the limit`,
    //   ) : null
  };


  useEffect(() => {
    console.log('exShowRoomPrice', RoadTaxData);

    if (RoadTaxData && exShoroomPrice && isChanged) {
      // setRegistrationChargesCamping(RoadTaxData?.registration?.toString() || '0');
      // setAccessoriesCamping(RoadTaxData?.accessories?.toString() || '0');
      setRoadTax(RoadTaxData?.roadTaxCalculated?.toString() || '0');
      setExShoroomPriceCaping(RoadTaxData?.exShowRoomPrice?.toString() || '0');
      setDob(RoadTaxData.dob?.toString())

    }
  }, [RoadTaxData]);

  const manufactureList: Item[] = GetManufactureData
    ? GetManufactureData.map(item => ({
      label: item.manufacture,
      value: item.manufacture,
    }))
    : [];

  const vehicalTypeList: Item[] = vechileTypeData
    ? vechileTypeData.map(item => ({
      label: item.category,
      value: item.category,
    }))
    : [];

  const modalList: Item[] = modalData
    ? modalData.map(item => ({
      label: item.model,
      value: item.model,
    }))
    : [];

  const getAllSchemeDetails: Item[] = getAllSchemeDetailsData
    ? getAllSchemeDetailsData.map(item => ({
      label: item.schemeName,
      value: item.schemeName,
      schemeCode: item.schemeCode,
      schemeName: item.schemeName,
    }))
    : [];

  const getTenureDetails: Item[] = getTenureDetailsData
    ? getTenureDetailsData.map(item => ({
      label: item.tenure?.toString(),
      value: item.tenure?.toString(),
      roi: item.roi,
      tenure: item.tenure?.toString(),
      pliAmount: item?.pliAmount?.toString()
    }))
    : [];


  useEffect(() => {
    if (manufacturer && isChanged) {
      setVehicalType('')
      setVehicleModel('')
      setScheme('')
      setExShoroomPrice('')
      setRoadTax('')
      setAmtRequested('')
      setTenure('')
      setROI('')
      setRegistrationCharges('')
      setAccessories('')
      setInsuranceAmount('')
      setonRoadPrice('')
    }
  }, [manufacturer])

  useEffect(() => {
    if (vehicalType && isChanged) {
      setVehicleModel('')
      setScheme('')
      setExShoroomPrice('')
      setRoadTax('')
      setAmtRequested('')
      setTenure('')
      setROI('')
      setRegistrationCharges('')
      setAccessories('')
      setInsuranceAmount('')
      setonRoadPrice('')
    }
  }, [vehicalType])

  useEffect(() => {
    if (vehicleModel && isChanged) {
      setScheme('')
      setExShoroomPrice('')
      setRoadTax('')
      setAmtRequested('')
      setTenure('')
      setROI('')
      setRegistrationCharges('')
      setAccessories('')
      setInsuranceAmount('')
      setonRoadPrice('')
    }
  }, [vehicleModel])




  useEffect(() => {
    // console.log('eeeeeee', amtRequested, LTV, isChanged);

    if (amtRequested && LTV && isChanged) {


      parseFloat(amtRequested?.replaceAll(',', '')) > parseFloat(maxValue) ?
        (
          setAmtRequested(maxValue.toString()),
          useShowFlashMessage(
            'warning',
            `Please decrease the requested amount as it exceeding the limit ₹ ${ConvertToPrefixedAmount(
              maxValue.toString(),
            )}`,
          )
        )
        : null
      setApprovedLoanAmount(
        `${parseFloat(amtRequested?.replaceAll(',', '')) > parseFloat(maxValue)
          ? Math.ceil(parseFloat(maxValue)).toString()
          : Math.ceil(parseFloat(amtRequested?.replaceAll(',', ''))).toString()
        }`,
      );
    }
  }, [amtRequested, scheme, LTV, LTVPercentage, maxValue]);

  useEffect(() => {
    if (approvedLoanAmount && isChanged) {

      var loanAmount = `${parseFloat(approvedLoanAmount?.replaceAll(',', '')) +
        (CLIAddInLoanAmount == 'Yes'
          ? parseFloat(CLIAmount?.replaceAll(',', ''))
          : 0) +
        (PLIAddInLoanAmount == 'Yes'
          ? parseFloat(PLIAmount?.replaceAll(',', ''))
          : 0)
        // + parseFloat(addOnCharges?.replaceAll(',', ''))
        }`
      console.log("loanAmountloanAmount", loanAmount);

      // parseFloat(loanAmount) > parseFloat(maxValue) ?
      //   (
      //     setFinalLoanAmount(''),
      //     setCommonPopUPVisible(true),
      //     setErrorMsg(`Please decrease the requested amount as it exceeding the limit ₹ ${ConvertToPrefixedAmount(
      //       maxValue.toString()
      //     )}`),
      //     useShowFlashMessage(
      //       'warning',
      //       `Please decrease the requested amount as it exceeding the limit ₹ ${ConvertToPrefixedAmount(
      //         maxValue.toString()
      //       )}`,
      //     )
      //   )
      //   :
      setFinalLoanAmount(Math.ceil(parseFloat(loanAmount)).toString());
    }
  }, [approvedLoanAmount,
    CLIAddInLoanAmount, PLIAddInLoanAmount,
    scheme, LTVPercentage, tenure, PLIAmount]);

  useEffect(() => {
    if (CLI && isChanged) {
      setCLIAddInLoanAmount('');
    }
  }, [CLI]);
  useEffect(() => {
    if (PLI && isChanged) {
      setPLITenure('')
      setPLIAddInLoanAmount('');
      setPLIAmount('0')
    }
  }, [PLI]);

  useEffect(() => {
    if (onRoadPrice && amtRequested && isChanged) {
      const marginValue: any = parseFloat(onRoadPrice) - parseFloat(approvedLoanAmount);
      console.log('ltvValue', minMarginAmount, maxLoanAmount, marginValue, LTV);
      setMargin(
        parseFloat(minMarginAmount) > 0 &&
          parseFloat(maxLoanAmount) >= parseFloat(onRoadPrice) ?
          Math.ceil(parseFloat(minMarginAmount)).toString() :
          parseFloat(minMarginAmount) > parseFloat(marginValue)
            ? Math.ceil(parseFloat(minMarginAmount)).toString()
            : Math.ceil(parseFloat(marginValue)).toString(),
      );
    }
  }, [onRoadPrice, amtRequested, scheme, LTVPercentage, approvedLoanAmount]);



  useEffect(() => {
    if (
      // ( exShoroomPrice || roadTax || insuranceAmount || registrationCharges || accessories)
      maxLoanAmount && isChanged) {

      const ltvValue: any =
        parseFloat(exShoroomPrice?.replaceAll(',', '')) +
        parseFloat(insuranceAmount?.replaceAll(',', '')) +
        parseFloat(registrationCharges) +
        parseFloat(roadTax) +
        parseFloat(accessories);

      const maxValue = ((parseFloat(LTVPercentage) / 100) * ltvValue)?.toString() || '0';


      // setonRoadPrice(ltvValue);
      setLTV(
        maxValue == '0'
          ? Math.ceil(parseFloat(maxLoanAmount)).toString()
          : ((parseFloat(LTVPercentage) / 100) * ltvValue)?.toString() || '0',
      );

      setAmtRequested(maxLoanAmount?.toString())
      setMaxValue(
        // (
        // maxValue == '0'
        // ? 
        maxLoanAmount
        // : parseFloat(maxValue) < parseFloat(maxLoanAmount)
        //   ? Math.ceil(parseFloat(maxLoanAmount) >= parseFloat(onRoadPrice) ? (parseFloat(maxValue) - parseFloat(minMarginAmount)) : parseFloat(maxValue)).toString() || '0'
        //   : Math.ceil(parseFloat(maxLoanAmount) >= parseFloat(onRoadPrice) ? (parseFloat(maxLoanAmount) - parseFloat(minMarginAmount)) : parseFloat(maxLoanAmount)).toString()) || '0',
      );

      // (parseFloat(minMarginAmount) > 0 && parseFloat(maxLoanAmount) >= parseFloat(onRoadPrice)) ?
      //   setAmtRequested((parseFloat(maxValue) - parseFloat(minMarginAmount)).toString()) : null

      // parseFloat(minMarginAmount) > 0 && parseFloat(maxLoanAmount) >= parseFloat(onRoadPrice) ?
      //   setIsAmtRequestedIsFreez(true) : null
    }
  }, [
    // exShoroomPrice,
    // roadTax,
    // insuranceAmount,
    // registrationCharges,
    // accessories,
    scheme,
    maxLoanAmount,
    minMarginAmount,
    LTVPercentage,
  ]);
  // console.log("addddddddss",amtRequested,isAmtRequestedIsFreez,isSchemeChange);

  useEffect(() => {
    if (exShoroomPrice && isChanged) {

      GetRoadTax.mutateAsync();
    }
    // else {
    //   // console.log("exxxxxxx", exShoroomPrice);
    //   setRoadTax('')
    // }
  }, [exShoroomPrice, vehicalType]);

  useEffect(() => {
    if (schemeDetailsData && isChanged) {
      console.log("schemeDetailsData", schemeDetailsData);
      setCLIAmount(schemeDetailsData?.cliAmount?.toString() || '0');
      setLTVPercentage(schemeDetailsData?.ltv?.toString() || '0');
      setNoOfAdvEmi(schemeDetailsData?.advanceEmi?.toString() || '0');
      setMinMarginAmount(schemeDetailsData.minMarginAmount?.toString() || '0');
      setMaxLoanAmount(schemeDetailsData?.maxLoanAmount?.toString() || '0');
    }
  }, [schemeDetailsData]);

  useEffect(() => {
    if (scheme) {
      GetSchemeDetails.mutateAsync();
      GetTenureDetails.mutateAsync();
    }
  }, [scheme]);

  useEffect(() => {
    if (vehicalType) {
      GetModal.mutateAsync();
    }
  }, [vehicalType]);

  useEffect(() => {
    if (manufacturer) {
      VehicalType.mutateAsync();
    }
  }, [manufacturer]);

  useEffect(() => {
    if (manufacturer && vehicalType && vehicleModel) {
      GetAllSchemeDetails.mutateAsync();
    }
  }, [manufacturer && vehicalType && vehicleModel]);

  useFocusEffect(
    useCallback(() => {
      if (applicantId) {
        GetManufacture.mutateAsync();
        GetLoanDetails.mutateAsync();
        setIsChanged(false);
      }
      // const onBackPress = () => {
      //   navigation.navigate('DelarshipDetails');
      //   return true;
      // };
      // BackHandler.addEventListener('hardwareBackPress', onBackPress);
      // return () =>
      //   BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    if (isChanged) {
      setSaveEnable(false);
    }
  }, [isChanged]);

  useEffect(() => {
    if (saveEnable && isChanged) {
      setNextEnable(false);
    }
  }, [remark]);

  useEffect(() => {

    if (isConsent) {
      console.log("***********iffff************", isConsent, downPaymentvalue, documentationChargesWaiver);

      // setDocumentationCharge(
      //   parseFloat(DocumentationChargeWithWaivedValue) >= Number(documentationWaivedValue) ?
      //     Math.ceil(parseFloat(documentationCharge) - Number(documentationWaivedValue))?.toString()
      //     : '0'
      // )

      setDownPayment(
        Math.ceil(Number(downPaymentvalue) - Number(documentationChargesWaiver)
        ).toString() || '0',
      );
      // `setNextEnable(false)
      // setSaveEnable(true);
      // setI`sChanged(false)
    }
    if (!isConsent) {
      console.log("**********eeeeee*************", isConsent, downPaymentvalue,);

      // setDocumentationCharge(
      //   Number(DocumentationChargeWithWaivedValue)?.toString()
      // );
      setDownPayment(
        Math.ceil(Number(downPaymentvalue)
        ).toString() || '0',
      );
      // setNextEnable(false)
      // setSaveEnable(true);
      // setIsChanged(false)

    }

  }, [isConsent, documentationChargesWaiver]);

  // useEffect(() => {
  //   setDownPayment(
  //     Math.ceil(Number(downPaymentvalue) + Number(documentationChargesWaiver)
  //     ).toString() || '0',
  //   );
  // }, [documentationChargesWaiver])


  useEffect(() => {
    if (useViewStatus) {
      setIsViewOnly(
        useViewStatus.isReEdit ? false :
          useViewStatus?.isSalesReject ? true :
            useViewStatus?.isSubmitToCreditFreeze ? true : false);
    }
  }, []);

  const handleSubmit = () => {
    if (saveEnable || useViewStatus?.isReEdit) {
      SetLoanDetails.mutateAsync();
    } else {
      // setIsProcessing(true);
      // GetSherlockResponse.mutateAsync();
      navigation.navigate('LoanOffer');
    }
  };


  return (
    <WaveBackground
      loading={[
        GetEmiValueDataIsLoading,
        setLoanDetailsIsLoading,
        getLoanDetailsIsLoading,
        GetBRE2StatusIsLoading,
        GetSherlockResponseIsLoading,
        isProcessing,
        GetInsuranceCapIsLoading,
        GetPLIValueDataIsLoading
      ]}
      title={'Loan Details'}
      isProcessingScreen={isProcessing}
      timer={timer}>
      <Modal
        title="Sherlock Service Error"
        status="failure"
        onClose={() => {
          setIsVisibleModal(false);
          GetBRE2Status.mutateAsync();
          // GetCriff.mutateAsync();
        }}
        message={
          'Sherlock Services is facing an error disrupting its operations. Our team is swiftly resolving it for full functionality. Thank you for your patience'
        }
        visible={isVisibleModal}
        buttonTitle="Okay"
      />

      <Modal
        buttonTitle="Okay"
        title=""
        status="normal"
        message="Please decrease your loan amount beacuse it is exceeding as per our Policy restriction."
        visible={popupVisible}
        onClose={() => {
          setPopUPVisible(false);

        }}
      />

      <Modal
        buttonTitle="Okay"
        title=""
        status="normal"
        message={errorMsg}
        visible={commonPopupVisible}
        onClose={() => {
          setCommonPopUPVisible(false);

        }}
      />

      <LabeledDropdown
        label="Manufacturer"
        defaultValue={manufacturer}
        options={manufactureList}
        setSelectedOption={setManufacturer}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />

      <LabeledDropdown
        label="Vehicle Type"
        defaultValue={vehicalType}
        options={vehicalTypeList}
        setSelectedOption={setVehicalType}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />

      <LabeledTextInput
        label="Existing Vehicle Model"
        onChange={setExistingVehicleModel}
        autoCapitalize="characters"
        defaultValue={existingVehicleModel}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        NumberPad
        disabled
      />

      <LabeledDropdown
        label="Vehicle Model"
        defaultValue={vehicleModel}
        options={modalList}
        setSelectedOption={setVehicleModel}
        bottom
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />


      <LabeledDropdown
        label="Scheme"
        defaultValue={scheme}
        options={getAllSchemeDetails}
        setSelectedOption={setScheme}
        bottom
        setSelectedItem={item => {
          setSchemeItem(item);
          setIsAmtRequestedIsFreez(false)
          setIsSchemeChange(true)
          setTenure('');
          setPLITenure('')
          setROI('');
        }}
        isChange={setIsChanged}
        mandatory
        disabled={isViewOnly}
      />
      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <LabeledTextInput
          label="Ex-Showroom Price"
          onChange={setExShoroomPrice}
          autoCapitalize="characters"
          defaultValue={exShoroomPrice}
          // disabled={GetPANDetailsData?.documentVerifiedStatus}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          halfSize
          NumberPad
          disabled={isViewOnly ? isViewOnly : !isSchemeChange}
        />

        <LabeledTextInput
          label="Road Tax"
          onChange={setRoadTax}
          autoCapitalize="characters"
          defaultValue={roadTax}
          disabled
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          halfSize

        />
      </View> */}

      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <LabeledTextInput
          label="Registration Charge"
          onChange={setRegistrationCharges}
          autoCapitalize="characters"
          defaultValue={registrationCharges}
          disabled={isViewOnly ? isViewOnly : !isSchemeChange}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          halfSize
          NumberPad
        />

        <LabeledTextInput
          label="Accessories"
          onChange={setAccessories}
          autoCapitalize="characters"
          defaultValue={accessories}
          disabled={isViewOnly ? isViewOnly : !isSchemeChange}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          halfSize
          NumberPad
        />
      </View> */}

      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <LabeledTextInput
          label="Insurance Amount"
          onChange={setInsuranceAmount}
          autoCapitalize="characters"
          defaultValue={insuranceAmount}
          // disabled={GetPANDetailsData?.documentVerifiedStatus}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          halfSize
          NumberPad
          disabled={isViewOnly ? isViewOnly : !isSchemeChange}

        />

        <LabeledTextInput
          label="On Road Price"
          onChange={setonRoadPrice}
          autoCapitalize="characters"
          defaultValue={onRoadPrice}
          disabled
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          halfSize
        />
      </View> */}

      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <LabeledTextInput
          label="LTV (%)"
          onChange={setLTVPercentage}
          autoCapitalize="characters"
          defaultValue={LTVPercentage}
          disabled
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          halfSize
        />
        <LabeledTextInput
          label="LTV"
          onChange={setLTV}
          autoCapitalize="characters"
          defaultValue={LTV}
          disabled
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          halfSize
        />
      </View> */}

      {/* <LabeledTextInput
        label="Loan Amount Requested"
        onChange={setAmtRequested}
        autoCapitalize="characters"
        defaultValue={amtRequested}
        disabled
        // ={GetPANDetailsData?.documentVerifiedStatus}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsChanged}
        mandatory
        NumberPad
        // disabled={isViewOnly ? isViewOnly : isAmtRequestedIsFreez ? isAmtRequestedIsFreez : !isSchemeChange}

      /> */}

      {/* <Slider
        style={{ width: '100%', height: 40 }}
        disabled={isViewOnly ? isViewOnly : isAmtRequestedIsFreez ? isAmtRequestedIsFreez : !isSchemeChange}
        value={parseFloat(amtRequested?.replaceAll(',', '')) || 0}
        onValueChange={amount => {
          // console.log('kkkkk', amtRequested, amount);
          setIsChanged(true);
          setAmtRequested(amount.toString());
        }}
        minimumValue={10000}
        maximumValue={parseInt(maxValue) || 0}
        minimumTrackTintColor={Colors.Primary}
        maximumTrackTintColor="#4a4a4a"
        thumbTintColor={Colors.Primary}
        step={300}
      /> */}

      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: -10,
          paddingHorizontal: 15,
        }}>
        <Text style={{ color: Colors.Black }}>{'20K'}</Text>
        <Text style={{ color: Colors.Black }}>{`${ConvertToPrefixedAmount(
          maxValue,
        ).toString()}`}</Text>
      </View> */}

      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // marginTop: -10,
          paddingHorizontal: 15,
        }}>
        <Text style={{ color: Colors.Black }}>{'Min'}</Text>
        <Text style={{ color: Colors.Black }}>{`Max`}</Text>
      </View> */}

      {/* <View style={[style.FinalLabel, { marginTop: 30 }]}>
        <Text style={style.Label}>{`Loan Amount Requested : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          amtRequested,
        )}`}</Text>
      </View> */}

      <View style={[style.FinalLabel, { marginVertical: 30 }]}>
        <Text style={style.Label}>{`Loan Amount : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          approvedLoanAmount,
        )}`}</Text>
      </View>

      {/* <View style={[style.FinalLabel, { marginBottom: 20 }]}>
        <Text style={style.Label}>{`Margin : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          margin,
        )}`}</Text>
      </View> */}

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <LabelDropdown
          label="Tenure"
          open={tenureOpen}
          setDropdownOpen={setTenureOpen}
          defaultValue={tenure}
          options={getTenureDetails}
          setSelectedOption={setTenure}
          setSelectedItem={item => {
            // handleTenure(item)
            setROI(item)
          }}
          isChange={setIsChanged}
          mandatory
          zIndex={tenureOpen ? 1000 : 0}
          halfSize
          disabled={isViewOnly}
        />

        <LabeledTextInput
          label="ROI"
          onChange={setROI}
          autoCapitalize="characters"
          defaultValue={ROI.roi}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsChanged}
          mandatory
          halfSize
          disabled
        />
      </View>

      <LabeledRadioButtonGroup
        heading="Do you want CLI?"
        options={['Yes', 'No']}
        onChange={setCLI}
        value={CLI}
        isChange={setIsChanged}
        inLine
        disabled={isViewOnly ? isViewOnly : !isSchemeChange}
      />

      {CLI == 'Yes' && (
        <LabeledRadioButtonGroup
          heading="Do you want to add CLI amount in loan?"
          options={['Yes', 'No']}
          onChange={setCLIAddInLoanAmount}
          value={CLIAddInLoanAmount}
          isChange={setIsChanged}
          inLine
          disabled={isViewOnly ? isViewOnly : !isSchemeChange}
        />
      )}

      <LabeledRadioButtonGroup
        heading={"Do you want PLI?"}
        subHeading={!PLIAllow ? "(Can't allow PLI)" : ''}
        options={['Yes', 'No']}
        onChange={setPLI}
        value={PLI}
        isChange={setIsChanged}
        inLine
        disabled={isViewOnly ? isViewOnly : !PLIAllow}
      />


      {PLI == 'Yes' && (
        <LabelDropdown
          label="PLI Tenure"
          open={PLItenureOpen}
          setDropdownOpen={setPLITenureOpen}
          defaultValue={PLItenure}
          options={getTenureDetails}
          setSelectedOption={setPLITenure}
          setSelectedItem={item => { }}
          isChange={setIsChanged}
          mandatory
          zIndex={PLItenureOpen ? 1000 : 0}
          disabled={isViewOnly}
        />
      )}

      {PLI == 'Yes' && (
        <LabeledRadioButtonGroup
          heading="Do you want to add PLI amount in loan?"
          options={['Yes', 'No']}
          onChange={setPLIAddInLoanAmount}
          value={PLIAddInLoanAmount}
          isChange={setIsChanged}
          inLine
          disabled={isViewOnly}
        />
      )}

      {CLIAddInLoanAmount == 'Yes' && (
        <View style={style.FinalLabel}>
          <Text style={style.Label}>{`CLI Amount : `}</Text>
          <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
            CLIAmount,
          )}`}</Text>
        </View>
      )}

      {PLIAddInLoanAmount == 'Yes' && (
        <View style={style.FinalLabel}>
          <Text style={style.Label}>{`PLI Amount : `}</Text>
          <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
            PLIAmount,
          )}`}</Text>
        </View>
      )}
      {/* <View style={style.FinalLabel}>
        <Text style={style.Label}>{`Add On Charges : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          addOnCharges
        )}`}</Text>
      </View> */}
      <View style={style.FinalLabel}>
        <Text style={style.Label}>{`Final Loan Amount : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          finalLoanAmount,
        )}`}</Text>
      </View>

      <Button
        text={'Calculate EMI'}
        active={activeEMI}
        marginVertical={10}
        marginTop={30}
        onPress={() => {


          // isViewOnly ? null :
            // parseFloat(minMarginAmount) > 0 &&
            //   parseFloat(onRoadPrice) > parseFloat(maxLoanAmount) ?
            //   useShowFlashMessage('warning', `Please change the scheme for this vehicle model`)
            //   :
            GetEmiValue.mutateAsync();
        }}
      />

      <View style={[style.FinalLabel, { marginTop: 10 }]}>
        <Text style={style.Label}>{`EMI Amount : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          EMIAmount,
        )}`}</Text>
      </View>
      <View style={style.FinalLabel}>
        <Text style={style.Label}>{`Advance EMI : `}</Text>
        <Text style={[style.StaticLabel]}>{`${ConvertToPrefixedAmount(
          noOfAdvEmi,
        )}`}</Text>
      </View>
      <View style={style.FinalLabel}>
        <Text style={style.Label}>{`Advance Emi Amount : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          advEMIAmount,
        )}`}</Text>
      </View>
      <View style={style.FinalLabel}>
        <Text style={style.Label}>{`Service Charge : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          serviceCharge,
        )}`}</Text>
      </View>

      <View style={style.FinalLabel}>
        <Text style={style.Label}>{`Documentation Charges : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          documentationCharge
        )}`}</Text>
      </View>

      {documentationWaivedValue !== '0' &&
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 15,
            marginVertical: 20,
            // marginBottom: 25,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'red',
            width: '100%'
          }}>
          <TouchableOpacity
            disabled={isViewOnly}
            style={{ width: '10%' }} onPress={() => { setIsConsent(!isConsent), setIsRemarkChanged(true) }}>
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
          <Text style={{
            color: Colors.SubHeadingGrey,
            fontSize: FONT_SIZE.l,
            width: '90%',
            marginLeft: 5,
            fontFamily: APP_FONTS.Roboto_Regular,
          }}>
            {`Waived Documentation Charges`}
          </Text>
        </View>}

      {isConsent &&
        <LabeledTextInput
          label="Waived Documentation Charges"
          onChange={setDocumentationChargesWaiver}
          defaultValue={documentationChargesWaiver}
          setErrorFlag={setIsError}
          IsErrorArray={isError}
          isChange={setIsRemarkChanged}
          // mandatory
          disabled={isViewOnly}
          NumberPad
          min={(documentationChargeMin || '0')}
          max={(documentationChargeMax || '0')}
        />}

      {isConsent &&
        <View style={style.FinalLabel}>
          <Text style={style.Label}>{`Final Doc. Charges : `}</Text>
          <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
            (Number(documentationCharge) - Number(documentationChargesWaiver)).toString(),
          )}`}</Text>
        </View>
      }


      {CLI == 'Yes' && CLIAddInLoanAmount == 'No' && (
        <View style={style.FinalLabel}>
          <Text style={style.Label}>{`CLI Amount : `}</Text>
          <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
            CLIAmount,
          )}`}</Text>
        </View>
      )}
      {PLI == 'Yes' && PLIAddInLoanAmount == 'No' && (
        <View style={style.FinalLabel}>
          <Text style={style.Label}>{`PLI Amount : `}</Text>
          <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
            PLIAmount,
          )}`}</Text>
        </View>
      )}

      <View style={style.FinalLabel}>
        <Text style={style.Label}>{`Downpayment : `}</Text>
        <Text style={[style.StaticLabel]}>{`₹${ConvertToPrefixedAmount(
          downPayment,
        )}`}</Text>
      </View>

      <LabeledTextInput
        label="Remark"
        onChange={setRemark}
        defaultValue={remark}
        setErrorFlag={setIsError}
        IsErrorArray={isError}
        isChange={setIsRemarkChanged}
        mandatory
        disabled={isViewOnly}
      />

      {/* <Button
        text={'Calculate EMI'}
        active={activeEMI}
        marginVertical={10}
        marginTop={30}
        onPress={() => {

          isViewOnly ? null :
            GetEmiValue.mutateAsync();
        }}
      /> */}

      <Button
        text={(useViewStatus?.isReEdit || isRemarkChanged) ? 'Save' : nextEnable ? 'Next' : 'Save'}
        active={(isChanged || isRemarkChanged || useViewStatus?.isReEdit) ? (saveEnable && isActive && !hasError) : (isActive && !hasError)}
        marginVertical={10}
        marginTop={30}
        onPress={() => { isViewOnly ? navigation.navigate('LoanOffer') : handleSubmit() }}
      />
      <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />
    </WaveBackground>
  );

};
export default LoanDetails;
const style = StyleSheet.create({
  Label: {
    color: Colors.SubHeadingGrey,
    fontFamily: APP_FONTS.Roboto_Regular,
    fontSize: useFontNormalise(16),
  },
  StaticLabel: {
    fontSize: useFontNormalise(18),
    fontFamily: APP_FONTS.Roboto_SemiBold,
    color: Colors.Black,
  },
  FinalLabel: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
});