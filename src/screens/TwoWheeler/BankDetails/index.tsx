import React, { FC, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useVerifyBankAccount,
  useGetBankAccountDetails,
} from 'api/ReactQuery/TwoWheeler/PennyDrop';
import {
  VerifyBankAccountRequest,
  GetBankAccountDetailsRequest,
} from 'api/ReactQuery/TwoWheeler/PennyDrop/types';
import {
  DeleteDocumentRequest,
  UploadDocumentRequest,
  docTypes,
} from 'api/ReactQuery/TwoWheeler/Document/types';
import { useDeleteDocument, useUploadDocument } from 'api/ReactQuery/TwoWheeler/Document';
import { useGetCashDetails } from 'api/ReactQuery/TwoWheeler/Repayment';
import Modal from 'components/Modal';
import WaveBackground from 'components/WaveBackground';
import Button from 'components/Button';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import { useApplicantDetails } from 'context/useApplicantDetails';
import { ErrorObject } from 'config/Types';
import LabeledTextInput from 'components/LabeledTextInput';
import useActive from 'hooks/useActive';
import LoanSummaryButton from 'components/LoanSummaryButton';
import Icon from 'components/Icon';
import { APP_FONTS } from 'config/Fonts';
import useFontNormalise from 'hooks/useFontNormalise';
import Colors from 'config/Colors';
import LabelDropdown from 'components/LabelDropdown';
import { usedViewStatus } from 'context/useViewStatus';
import LabeledUploadMultiDocument from 'components/LabeledUploadMultiDocument';
import AsyncStorage from '@react-native-async-storage/async-storage';

type BankDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BankDetails'
>;

type BankDetailsRouteProp = RouteProp<RootStackParamList, 'BankDetails'>;

interface BankDetailsScreenProps {
  navigation: BankDetailsNavigationProp;
  route: BankDetailsRouteProp;
}

const BankDetails: FC<BankDetailsScreenProps> = ({ navigation, route }) => {
  // const [AddLead, {data: AddLeadData, isLoading: AddLeadIsLoading}] =
  //   useAddLead(requestAdd);
  const { applicantId, guarantorId, } = useApplicantDetails();
  const { useViewStatus } = usedViewStatus();

  // console.log("ccccccc", useViewStatus?.isSubmitToDisbursement);
  const [isCashVisible, setIsCashVisible] = useState<boolean>(false);
  const [isError, setIsError] = useState<ErrorObject[]>([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [ifscCode, setIfscCode] = useState<string>('');
  const [accountHolderName, setAccountHolderName] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [applicantType, setApplicantType] = useState<string>('Main Applicant');
  const [applicantTypeOpen, setApplicantTypeOpen] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<string>('');
  const [accountTypeOpen, setAccountTypeOpen] = useState<boolean>(false);
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [bankPassbookBase64, setBankPassbookBase64] = useState<string>('');
  const [accStatementBase64, setAccStatementBase64] = useState<string>('');
  const [bankPassbook, setBankPassbook] = useState<string>('');
  const [accStatement, setAccStatement] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [bankPassbookDocType, setBankPassbookDocType] = useState<'pdf' | 'jpg' | null>(null);
  const [accStatementDocType, setAccStatementDocType] = useState<'pdf' | 'jpg' | null>(null);
  const [accountStatementFileName, setaccountStatementFileName] = useState<string>('');
  const [bankPassbookFileName, setbankPassbookFileName] = useState<string>('');
  const [isNachReactivation, setIsNachReactivation] = useState<boolean>(false);


  const VerifyBankAccountRequest: VerifyBankAccountRequest = {
    applicantId,
    accountNumber,
    ifsc: ifscCode,
    applicantType: applicantType == "Main Applicant" ? "mainApplicant" : "guarantor",
    accountType,
    guarantorId: guarantorId,
    isReEdit: true,
    isNachReactivation: isNachReactivation

  };

  const GetBankAccountDetailsRequest: GetBankAccountDetailsRequest = {
    appId: applicantId,
  };

  const UploadDocumentRequest: UploadDocumentRequest = {
    appId: applicantId,
    base64value: bankPassbookBase64,
    doctype: 'Bank Passbook',
    applicantType: applicantType == "Main Applicant" ? "mainApplicant" : "guarantor",
    type: bankPassbookDocType,
    isMandatory: 'Y',
    fileName: `${'Bank Passbook'}${new Date().getTime()}`,
    isMultiple: 'N',
    documentType: 'Bank Details'
  };

  const UploadAccStatementRequest: UploadDocumentRequest = {
    appId: applicantId,
    base64value: accStatementBase64,
    doctype: 'Account Statement',
    applicantType: applicantType == "Main Applicant" ? "mainApplicant" : "guarantor",
    type: accStatementDocType,
    isMandatory: 'Y',
    fileName: `${'Account Statement'}${new Date().getTime()}`,
    isMultiple: 'N',

  };

  const [
    UploadDocuments,
    { data: UploadDocumentData, isLoading: UploadDocumentsIsLoading },
  ] = useUploadDocument(UploadDocumentRequest);

  const [
    UploadAccStatement,
    { data: UploadAccStatementData, isLoading: UploadAccStatementIsLoading },
  ] = useUploadDocument(UploadAccStatementRequest);

  const DeleteDocumentRequest: DeleteDocumentRequest = {
    appId: applicantId,
    doctype: selectedDocument,
    applicantType: applicantType == "Main Applicant" ? "mainApplicant" : "guarantor",
    isMandatory: "N",
    fileName: selectedDocument == 'Bank Passbook' ? bankPassbookFileName : accountStatementFileName
  };

  const [DeleteDocument, { data: DeleteDocumentData }] = useDeleteDocument(
    DeleteDocumentRequest,
  );

  const [
    VerifyBankAccount,
    { data: VerifyBankAccountData, isLoading: VerifyBankAccountIsLoading },
  ] = useVerifyBankAccount(VerifyBankAccountRequest);

  const [
    GetBankAccount,
    {
      data: GetBankAccountDetailsData,
      isLoading: GetBankAccountDetailsIsLoading,
    },
  ] = useGetBankAccountDetails(GetBankAccountDetailsRequest);

  const [GetCashDetails, { data: GetCashDetailsData, isLoading: GetCashDetailsIsLoading }] =
    useGetCashDetails(`${applicantId}`);

  const ResetBankDetails = () => {
    setAccountHolderName('');
    setBankName('');
  };


  useEffect(() => {
    if (VerifyBankAccountData) {
      if (VerifyBankAccountData.nameMatch === 'Y') {
        setBankName(VerifyBankAccountData?.bankName);
        setAccountHolderName(VerifyBankAccountData.accountHolderName || '');
      } else {
        setIsVisibleModal(true);
      }
      setIsChanged(false);
    }
  }, [VerifyBankAccountData]);

  useEffect(() => {
    if (GetCashDetailsData) {
      console.log("GetCashDetailsData", GetCashDetailsData);
      setIsCashVisible(GetCashDetailsData.isCash)


    }
  }, [GetCashDetailsData])

  useEffect(() => {
    isChanged && ResetBankDetails();
  }, [accountNumber, ifscCode, isChanged, accountType]);

  useEffect(() => {
    if (GetBankAccountDetailsData) {
      console.log("GetBankAccountDetailsData", JSON.stringify(GetBankAccountDetailsData, null, 4));

      setIfscCode(GetBankAccountDetailsData.ifscCode || '');
      setAccountNumber(GetBankAccountDetailsData.accountNumber || '');
      setBankName(GetBankAccountDetailsData.bankName || '');
      setAccountHolderName(GetBankAccountDetailsData.accountHolderName || '');
      setApplicantType(GetBankAccountDetailsData.applicantType == 'mainApplicant' ? 'Main Applicant' : 'Guarantor');
      setAccountType(GetBankAccountDetailsData.accountType)
      setBankPassbook(GetBankAccountDetailsData.bankPassbook || '');
      setAccStatement(GetBankAccountDetailsData.accountStatement || '');
      setBankPassbookDocType(GetBankAccountDetailsData.bankPassbookType);
      setAccStatementDocType(GetBankAccountDetailsData.bankPassbookType)
      setaccountStatementFileName(GetBankAccountDetailsData.accountStatementFileName);
      setbankPassbookFileName(GetBankAccountDetailsData.bankPassbookFileName)

      setIsChanged(false);
    }
  }, [GetBankAccountDetailsData]);

  useEffect(() => {
    GetCashDetails.mutateAsync()
  }, []);

  useEffect(() => {
    if (useViewStatus) {

      setIsViewOnly(
        isNachReactivation ? false :
          useViewStatus?.isReEditbankDetails == false ? true :
            useViewStatus?.isSalesReject ? true :
              useViewStatus?.isDisbursementFreeze ? true :
                false);
    }
  }, [isNachReactivation]);

  useEffect(() => {
    const isNachReactivation = async () => {
      const isNachReactivation = await AsyncStorage.getItem('isNachReactivation')
      console.log("isNachReactivation", isNachReactivation);
      setIsNachReactivation(isNachReactivation == 'true' ? true : false)
      GetBankAccount.mutateAsync();
    }
    isNachReactivation()
  }, []);
  // console.log("jjjjjj", isNachReactivation);

  useEffect(() => {
    if (bankPassbookBase64) {
      UploadDocuments.mutateAsync();
    }
  }, [bankPassbookBase64]);

  useEffect(() => {
    if (accStatementBase64) {
      UploadAccStatement.mutateAsync();
    }
  }, [accStatementBase64]);

  // useEffect(() => {
  //   if (UploadDocumentData || UploadAccStatementData) {
  //     setSelectedDocument('')
  //   }
  // }, [UploadDocumentData, UploadAccStatementData]);




  useEffect(() => {
    if (selectedDocument) {
      DeleteDocument.mutateAsync();
    }
  }, [selectedDocument]);

  useEffect(() => {
    if (DeleteDocumentData) {
      console.log("DeleteDocumentData", DeleteDocumentData);
      selectedDocument == 'Bank Passbook' ? setBankPassbook('') : null
      selectedDocument == 'Account Statement' ? setAccStatement('') : null

      setSelectedDocument('')
      setAccStatementBase64('')
      setBankPassbookBase64('')
      GetBankAccount.mutateAsync()
    }
  }, [DeleteDocumentData]);


  const handleSubmit = () => {
    VerifyBankAccount.mutateAsync();
  };

  const ActiveArray = [accountNumber, ifscCode, accountType, bankPassbook];
  let isActive = useActive(ActiveArray);
  let hasError = isError.some(error => error.hasError === true);
  console.log("selectedDocument", selectedDocument);


  return (
    <WaveBackground
      loading={[VerifyBankAccountIsLoading, GetCashDetailsIsLoading, UploadAccStatementIsLoading, UploadDocumentsIsLoading, GetBankAccountDetailsIsLoading]}
      title={'Bank Details'}>

      <Modal
        title="Account Verification FAILED"
        status="failure"
        onClose={() => {
          // setAccountNumber('');
          // setAccountHolderName('');
          // setBankName('');
          // setIfscCode('');
          setIsVisibleModal(false);
        }}
        message={
          `The account number & IFSC Code you entered is not valid, Please review the account number and IFSC Code.`
        }
        visible={isVisibleModal}
        buttonTitle="Okay"
      />

      {isCashVisible && 
      <View style={{}}>
        <Button
          text={'Skip'}
          active
          marginVertical={10}
          flexEnd
          // marginTop={30}
          halfSize
          onPress={() => {
            navigation.navigate('RepaymentDetails');
          }}
        />
      </View>}

      <LabelDropdown
        label="Applicant Type"
        open={applicantTypeOpen}
        setDropdownOpen={setApplicantTypeOpen}
        defaultValue={applicantType}
        options={guarantorId == '' ? ['Main Applicant'] : ['Main Applicant', 'Guarantor']}
        setSelectedOption={setApplicantType}
        setSelectedItem={item => { }}
        isChange={setIsChanged}
        mandatory
        zIndex={applicantTypeOpen ? 1000 : 0}
        disabled={isViewOnly}
      />

      <LabeledTextInput
        label="Account Number"
        setErrorFlag={setIsError}
        isChange={setIsChanged}
        onChange={setAccountNumber}
        defaultValue={accountNumber}
        IsErrorArray={isError}
        maxLength={25}
        NumberPad
        mandatory
        disabled={isViewOnly}
      />
      <LabeledTextInput
        label="IFSC Code"
        onChange={setIfscCode}
        isChange={setIsChanged}
        defaultValue={ifscCode}
        setErrorFlag={setIsError}
        autoCapitalize="characters"
        maxLength={11}
        IsErrorArray={isError}
        mandatory
        disabled={isViewOnly}
      />

      <LabelDropdown
        label="Account Type"
        open={accountTypeOpen}
        setDropdownOpen={setAccountTypeOpen}
        defaultValue={accountType}
        options={['Current Account', 'Saving Account']}
        setSelectedOption={setAccountType}
        setSelectedItem={item => { }}
        isChange={setIsChanged}
        mandatory
        zIndex={accountTypeOpen ? 1000 : 0}
        disabled={isViewOnly}
      />

      <LabeledUploadMultiDocument
        label={'Bank Passbook'}
        onPress={() => { }}
        imageOnly
        mandatory
        setBase64={setBankPassbookBase64}
        setUrl={setBankPassbook}
        setDocType={setBankPassbookDocType}
        disabled={isViewOnly}
        buttonDisable={bankPassbook ? true : false}
      />

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {bankPassbookDocType == 'pdf' && bankPassbook ? (
          <View
            style={Styles.pdfContainer}>
            {(
              <TouchableOpacity
                style={Styles.pdfSubContainer}
                disabled={isViewOnly}
                onPress={() => {
                  setSelectedDocument('Bank Passbook')
                }}>
                <Icon name="close" />
              </TouchableOpacity>
            )}
            <Icon name="prePdf" />
          </View>
        ) :
          bankPassbook ? (
            <View style={{ width: '100%', marginVertical: 10 }}>
              <Image
                source={{ uri: bankPassbook }}
                style={Styles.imgContainer}
                resizeMode="stretch"
              />
              <TouchableOpacity
                style={Styles.imgSubContainer}
                disabled={isViewOnly}
                onPress={() => {
                  setSelectedDocument('Bank Passbook')
                }}>
                <Icon name="close" />
              </TouchableOpacity>
            </View>
          ) : null}
      </View>

      <LabeledUploadMultiDocument
        label={'Account Statement'}
        onPress={() => { }}
        imageOnly
        setBase64={setAccStatementBase64}
        setUrl={setAccStatement}
        setDocType={setAccStatementDocType}
        disabled={isViewOnly}
        buttonDisable={accStatement ? true : false}
      />

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {accStatementDocType == 'pdf' && accStatement ?
          (
            <View style={Styles.pdfContainer}>
              {(
                <TouchableOpacity
                  style={Styles.pdfSubContainer}
                  disabled={isViewOnly}
                  onPress={() => {
                    setSelectedDocument('Account Statement')
                  }}>
                  <Icon name="close" />
                </TouchableOpacity>
              )}
              <Icon name="prePdf" />
            </View>
          ) :
          accStatement ? (
            <View style={{ width: '100%', marginVertical: 10 }}>
              <Image
                source={{ uri: accStatement }}
                style={Styles.imgContainer}
                resizeMode="stretch"
              />
              <TouchableOpacity
                style={Styles.imgSubContainer}
                disabled={isViewOnly}
                onPress={() => {
                  setSelectedDocument('Account Statement')
                }}>
                <Icon name="close" />
              </TouchableOpacity>
            </View>
          ) : null
        }
      </View>
      {bankName && (
        <LabeledTextInput
          label="Bank Name"
          onChange={setBankName}
          isChange={setIsChanged}
          IsErrorArray={isError}
          setErrorFlag={setIsError}
          defaultValue={bankName}
          disabled
          mandatory
        />
      )}
      {accountHolderName && (
        <LabeledTextInput
          label="Account Holder Name"
          onChange={setAccountHolderName}
          isChange={setIsChanged}
          IsErrorArray={isError}
          setErrorFlag={setIsError}
          defaultValue={accountHolderName}
          disabled
          mandatory
        />
      )}
      {(VerifyBankAccountData?.nameMatch === 'Y' ||
        GetBankAccountDetailsData?.nameMatch === 'Y') && !isChanged && (
          <View
            style={{
              flexDirection: 'row',
              marginVertical: '5%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: APP_FONTS.SemiBold,
                fontSize: useFontNormalise(15),
                marginRight: 8,
                top: 3,
                fontWeight: '700',
                color: Colors.Black,
              }}>
              Account Number Verified{'\t'}
            </Text>
            <Icon name="completed" />
          </View>
        )}



      <View style={{ marginVertical: '10%' }}>
        <Button
          text={isChanged ? 'Verify' : 'Next'}
          active={isActive && !hasError}
          marginVertical={10}
          onPress={() => {
            isChanged
              ? handleSubmit()
              : navigation.navigate('RepaymentDetails');
          }}
        />
        {
          !isNachReactivation && <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />}
      </View>
    </WaveBackground>
  );
};
export default BankDetails;

const Styles = StyleSheet.create({
  pdfContainer: {
    backgroundColor: Colors.LightGrey,
    // paddingHorizontal: 25,
    paddingVertical: '5%',
    width: 250,
    height: 180,
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  pdfSubContainer: {
    position: 'absolute',
    top: -9,
    right: -5,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  imgContainer: {
    width: 250,
    height: 180,
    borderRadius: 10,
    alignSelf: 'center',
  },
  imgSubContainer: {
    position: 'absolute',
    top: -10,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    paddingHorizontal: '5%',
  }

})