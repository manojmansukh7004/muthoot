import React, { FC, useEffect, useState } from 'react';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { DeviationDto } from 'api/ReactQuery/TwoWheeler/DeviationDocuments/types';
import {UploadDocumentRequest,docTypes} from 'api/ReactQuery/TwoWheeler/DeviationDocuments/types';
import { useUploadDocument, useGetDeviationDocumentsDetail } from 'api/ReactQuery/TwoWheeler/DeviationDocuments';
import WaveBackground from 'components/WaveBackground';
import Button from 'components/Button';
import { RootStackParamList } from 'navigation/HomeStack/TwoWheelerStack';
import LoanSummaryButton from 'components/LoanSummaryButton';
import { useApplicantDetails } from 'context/useApplicantDetails';
import Colors from 'config/Colors';
import Icon from 'components/Icon';
import { APP_FONTS, FONT_SIZE } from 'config/Fonts';
import useFontNormalise from 'hooks/useFontNormalise';
import styles from './styles';
import { applicantType } from 'api/ReactQuery/TwoWheeler';
import { applicantTypeObect } from 'config/Types';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import convertImageFileToBase64 from 'config/Functions/ConvertImageToBase64';
import useSelectImage from 'hooks/useSelectImage';
import { useEmployeeDetails } from 'context/useEmployeeDetails';

type DeviationDocumentsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DeviationDocuments'
>;

type DeviationDocumentsRouteProp = RouteProp<
  RootStackParamList,
  'DeviationDocuments'
>;

interface DeviationDocumentsScreenProps {
  navigation: DeviationDocumentsNavigationProp;
  route: DeviationDocumentsRouteProp;
}

const DeviationDocuments: FC<DeviationDocumentsScreenProps> = ({
  navigation,
  route,
}) => {
  const GetCriffResponse = route?.params?.GetCriffResponse;
  //const isNavigateLoanOffer = route?.params?.isNavigateLoanOffer;
  const breStatus = route?.params?.breStatus;
  const { applicantId, guarantorId } = useApplicantDetails();
  const { employeeId } = useEmployeeDetails();
  //const { useViewStatus } = usedViewStatus();
  // var applicantId = 'MU557020'

  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [documentType, setDocumentType] = useState<string>('');
  const [imageType, setImageType] = useState<string>('');
  const [isViewOnly, setIsViewOnly] = useState<boolean>(false);
  const [preDocumentsDetails, setPreDocumentsDetails] = useState<DeviationDto[]>(
    []
  );
  const [selectedApplicantId, setSelectedApplicantId] =
    useState<string>(applicantId);
  const [selectedApplicantType, setSelectedApplicantType] =
    useState<applicantType>('mainApplicant');
  const [applicantTypes, setApplicantTypes] = useState<applicantTypeObect[]>([
    { applicantId, applicantType: 'mainApplicant' },
  ]);
  const [guarantorDeviation, setGuarantorDeviation] = useState<boolean>(false);
  const [salesDeviation, setSalesDeviation] = useState<boolean>(false);
  const [selectNull, setSelectedNull] = useState<'upload' | 'capture' | null>(null);
  const [uploadingDocumentType, setUploadingDocumentType] =
    useState<docTypes | null>(null);
  const [base64value, setBase64Value] = useState<string>('');

  const UploadDocumentRequest: UploadDocumentRequest = {
    appId: applicantId,
    applicantType: selectedApplicantType,
    base64value: imageBase64,
    doctype: documentType === "Sales Deviation" ? 'Sales_Deviation': 'Guarantor_Deviation',
    fileName: fileName,
    type: imageType,
    empId : employeeId,
    ownedBy: "Sales"
  };
  //console.log("UploadDocumentRequest", UploadDocumentRequest);

  const [
    UploadDocuments,
    { data: UploadDocumentData, isLoading: UploadDocumentsIsLoading },
  ] = useUploadDocument(UploadDocumentRequest);

  // useEffect(() => {
  //   if (useViewStatus) {
  //     setIsViewOnly(useViewStatus?.isSubmitToDisbursement ? true : false);
  //   }
  // }, []);

  useEffect(() => {
    if (UploadDocumentData) {
      // console.log("mjjjjjjjj", JSON.stringify(UploadDocumentData, null, 4));
      if (UploadDocumentData?.detailsCheck == false) {
        useShowFlashMessage('warning', UploadDocumentData?.detailsCheckMessage || '');
      }
      GetDeviationDocumentsDetail.mutateAsync()
      setBase64Value('');
      setUploadingDocumentType(null);
    }
  }, [UploadDocumentData]);

  const [
    GetDeviationDocumentsDetail,
    {
      data: GetDeviationDocumentsDetailData,
      isLoading: GetDeviationDocumentsDetailDataIsLoading,
    },
  ] = useGetDeviationDocumentsDetail(applicantId, 'mainApplicant');

  useEffect(() => {
    GetDeviationDocumentsDetail.mutateAsync();
  }, []);

  useEffect(() => {
    console.log('**************************************', JSON.stringify(GetDeviationDocumentsDetailData, null, 4));
    setPreDocumentsDetails(GetDeviationDocumentsDetailData?.deviationDtoList || [])
    setGuarantorDeviation(GetDeviationDocumentsDetailData?.isGurantorDeviation || false)
    setSalesDeviation(GetDeviationDocumentsDetailData?.isSalesDeviation || false)

  }, [GetDeviationDocumentsDetailData]);

  useEffect(() => {
    if (documentType && imageBase64) {
      console.log("UploadDocumentRequest", UploadDocumentRequest);
      UploadDocuments.mutateAsync();
    }
  }, [imageBase64]);


 
  const handleOnPress = (documentType, fileName) => {
    const callback = (response: any, path: any, name: string) => {
      console.log("response", response)
      if (response) {
        setDocumentType(documentType)
        setFileName(fileName)
        setImageUrl(response[0]?.fileCopyUri);
        setImageType(response[0]?.type === 'image/jpeg' ? 'jpg' : 'pdf')
        convertImageFileToBase64(response[0]?.fileCopyUri)
          .then(base64Data => {
            if (base64Data) {
              setImageBase64(base64Data);
            }
          })
          .catch(error => {
            console.error('Error converting image file to base64:', error);
          });
      }
    };
    useSelectImage(callback, 'allDocument', setSelectedNull);
  };

  const handleLaunchCamera = (documentType, fileName) => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      freeStyleCropEnabled: true,
      cropperStatusBarColor: Colors.Primary,
      cropperToolbarColor: Colors.Primary,
      cropperToolbarWidgetColor: Colors.White,
      cropperActiveWidgetColor: Colors.Primary,
      hideBottomControls: true
    }).then(image => {
      console.log("Camera Response", image);
      if (image) {
        setDocumentType(documentType)
        setFileName(fileName)
        setImageUrl(image.path);
        setImageType(image.mime === 'image/jpeg' ? 'jpg' : 'pdf')
        convertImageFileToBase64(image.path)
          .then(base64Data => {
            if (base64Data) {
              setImageBase64(base64Data);
            }
          })
          .catch(error => {
            console.error('Error converting image file to base64:', error);
          });
      }
    }).catch(e => {
      console.log(e);
    })

  };

  const handleItem = (documentType, imagePath, type, fileName) => {

    return (

      <View style={{ paddingBottom: 5, marginTop: 5 }}>
        {<Text style={{ color: Colors.LabelGrey, fontSize: FONT_SIZE.l, fontFamily: APP_FONTS.Roboto_Regular, alignSelf: 'flex-start', marginVertical: 10 }} >{fileName}</Text>}
        <View style={{ marginBottom: 5 }}>
          {documentType !== 'Credit Deviation' && (!imagePath || imagePath == 'NA')? <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.Upload,
                paddingVertical: 10,
                paddingHorizontal: 50,
                borderRadius: 10,
              }}
              disabled={documentType == 'Guarantor Deviation' && !guarantorDeviation }
              onPress={() => { handleOnPress(documentType, fileName) }}>
              <Icon name="upload" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.Capture,
                paddingVertical: 10,
                paddingHorizontal: 50,
                borderRadius: 10,
              }}
              disabled={documentType == 'Guarantor Deviation' && !guarantorDeviation }
              onPress={() => { handleLaunchCamera(documentType, fileName) }}>
              <Icon name="capture" />
            </TouchableOpacity>
          </View>
            : imagePath != 'NA'?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 15, width: '100%', height: 'auto', }}>
              {type == 'jpg' ?
                <Image
                  source={{
                    uri: imagePath,
                  }}
                  style={{
                    width: useFontNormalise(220),
                    height: useFontNormalise(150),
                    borderRadius: 10,
                  }}
                /> :
                <View
                  style={{
                    backgroundColor: Colors.LightGrey,
                    paddingHorizontal: 25,
                    paddingVertical: '5%',
                    height: useFontNormalise(120),
                    justifyContent: 'center',
                    borderRadius: 10,
                    width: useFontNormalise(120),
                    // margin: 15,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      top: -9,
                      right: -5,
                      backgroundColor: 'transparent',
                      alignSelf: 'flex-end',
                    }}
                  >
                  </View>
                  <Icon name="prePdf" />
                </View>
              }
            </View> : null}
        </View>
      </View>
    );
  }

  const handleRenderItem = (values) => {

    return (
      <View style={{ borderBottomWidth: .2, paddingBottom: 15, marginVertical: 15 }}>
        <Text style={{ color: Colors.Primary, fontSize: FONT_SIZE.xl, fontFamily: APP_FONTS.Roboto_Regular, alignSelf: 'flex-start', marginBottom: 10 }} >
          {values.deferalDocumentType}{guarantorDeviation && values.deferalDocumentType == 'Guarantor Deviation'?  <Icon name="pointed-star" />:null }</Text>
        {handleItem(values.deferalDocumentType, values.image1, values.image1Type, "image1")}
        {handleItem(values.deferalDocumentType, values.image2, values.image2Type, "image2")}
        {handleItem(values.deferalDocumentType, values.image3, values.image3Type, "image3")}
        {handleItem(values.deferalDocumentType, values.image4, values.image4Type, "image4")}
        {handleItem(values.deferalDocumentType, values.image5, values.image5Type, "image5")}

      </View>
    );
  }

  const handleSubmit = () => {
    if (breStatus === 'Bre2_Approved') {
      navigation.navigate('LoanOffer');
    } else if (breStatus === 'Bre2_Manual') {
      navigation.navigate('ManualUnderwriting1', {
        GetCriffResponse: GetCriffResponse ,
        isNavigateLoanOffer: true,
      });
    }
  }

  return (
    <WaveBackground
      loading={[
        UploadDocumentsIsLoading,
        GetDeviationDocumentsDetailDataIsLoading,
      ]}
      title={'Deviation Documents'}>
      {applicantTypes.length > 1 && <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        <View style={[styles.container]}>
          {applicantTypes.length > 1 &&
            applicantTypes.map((item, index: number) => (

              <TouchableOpacity
                onPress={() => {
                  setSelectedApplicantType(item.applicantType);
                  setSelectedApplicantId(item.applicantId);
                }}
                key={index}
                style={[
                  styles.cardContainer,
                  [
                    selectedApplicantId === item?.applicantId &&
                    styles.selected,
                  ],
                ]}
                disabled={selectedApplicantId === item.applicantId}>
                <Text style={styles.applicantText}>
                  {item.applicantType === 'mainApplicant'
                    ? 'Main-Applicant'
                    : 'Guarantor'}
                </Text>
                <Text style={styles.appIdText}>{item.applicantId}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>}

      <FlatList
        data={preDocumentsDetails}
        extraData={preDocumentsDetails}
        style={{}}
        renderItem={({ item, index }) =>
          // <Text>{item.documentType}</Text>
          handleRenderItem(item)
        }
      />


      <View style={{ marginTop: 20 }}>
        <Button
          text="Next"
          onPress={() => {
            handleSubmit()
            //navigation.navigate('PSDDocument');
          }}
          marginVertical={10}
          active={ true}
        />
        <LoanSummaryButton onPress={() => navigation.replace('LoanSummary')} />
      </View>
    </WaveBackground>
  );
};
export default DeviationDocuments;
