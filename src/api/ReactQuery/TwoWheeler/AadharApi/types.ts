import { ApiResponse, BaseModule } from '..';

export type GetExistingAadharDetailsRequest = {
  aadhaarNo: string;
  appId: string;
  applicantType?: string;
};

export type GetExistingAadharDetailsResponse = {
  aadhaarNo: string;
  aadhaarName: string;
  aadhaarDob: string;
  aadhaarGender: string;
  aadhaarFilePath: string;
  aadhaarPincode: string;
  aadhaarAddressLine2: string;
  aadhaarAddressLine1: string;
  state: string;
  city: string;
  district: string;
  landmark: string;
  aadhaarOcrFrontFilePath: string;
  aadhaarOcrBackFilePath: string;
  aadhaarDataSource: string;
  verifyBy: string;
  apiStatus: string;
  aadhaarVerifiedStatus: string;
  applicantType?: string;
  isAadhaarAlreadyExists: boolean;
} | null;

export type GetAadharOTPRequest = {
  appId: string;
  aadhaarNo: string;
  applicantType?: string;

};

export type GetAadharOTPResponse = {
  requestId: string;
  aadharNo: string;
  message: string;
  applicantType?: string;
} | null;

export type GetAadharDetailsByOTPRequest = {
  appId: string;
  aadhaarNo: string;
  otp: string;
  requestId: string;
  applicantType?: string
};

export type GetAadharDetailsByOTPResponse = {
  aadhaarNo: string;
  aadhaarName: string;
  aadhaarDob: string;
  aadhaarGender: string;
  aadhaarFilePath: string;
  aadhaarPincode: string;
  aadhaarAddressLine2: string;
  aadhaarAddressLine1: string;
  state: string;
  city: string;
  district: string;
  landmark: string;
  aadhaarOcrFrontFilePath: string;
  aadhaarOcrBackFilePath: string;
  aadhaarDataSource: string;
  verifyBy: string;
  apiStatus: string;
  aadhaarVerifiedStatus: string;
  applicantType?: string;

} | null;


export type CKYCDetailsEditableRequest = {
  appId: string;
  applicantType: string;
  isEdit: boolean;
  type: string;
};

export type CKYCDetailsEditableResponse = {
  appId: string;
  applicantType: string;
  isEdit: boolean;
  type: string;
} | null;


export type GetCKYCResponse = {
  id: number;
  appId: string;
  applicantType: string;
  updtDt: string | null;
  customerType: string;
  ckycStatus: string;
  documentType: string;
  documentFilePath: string | null;
  docFilePathBack: string | null;
  panVerifiedStatus: boolean;
  documentNumber: string;
  documentName: string;
  documentDob: string;
  documentAddress: string | null;
  documentGender: string;
  documentPincode: string;
  documentVerifiedStatus: boolean;
  documentValidity: string | null;
  verifyBy: string;
  verifyDate: string | null;
  aadhaarNumber: string;
  aadhaarName: string;
  aadhaarDob: string;
  aadhaarGender: string;
  aadhaarFilePath: string;
  aadhaarAddressLine1: string;
  aadhaarAddressLine2: string;
  landmark: string | null;
  aadhaarPincode: string;
  district: string;
  city: string;
  state: string;
  aadhaarVerifiedStatus: boolean;
  currentAddressLine1: string | null;
  currentAddressLine2: string | null;
  currentLandmark: string | null;
  currentPinCode: string | null;
  currentDistrict: string | null;
  currentCity: string | null;
  currentState: string | null;
  postOffice: string | null;
  permanentPostOffice: string | null;
  aadharPostOffice: string | null;
  isCurrentSameasKYC: boolean | null;
  residingAtCurrentAddressSinceYears: number | null;
  residingAtCurrentAddressSinceMonths: number | null;
  permanentAddressLine1: string | null;
  permanentAddressLine2: string | null;
  permanentLandmark: string | null;
  permanentPinCode: string | null;
  permanentDistrict: string | null;
  permanentCity: string | null;
  permanentState: string | null;
  isPermanentSameasKYC: boolean | null;
  isKYC: boolean | null;
  residingAtPermanentAddressSinceYears: number | null;
  residingAtPermanentAddressSinceMonths: number | null;
  residenceType: string | null;
  currentResidenceType: string | null;
  permanentResidenceType: string | null;
  residingAtCurrentAddress: string | null;
  documentDataSource: string;
  aadhaarDataSource: string;
  aadhaarOcrFrontFilePath: string | null;
  aadhaarOcrBackFilePath: string | null;
  passportNumber: string | null;
  aadhaarOtpImageUrl: string | null;
  isCKYC: boolean;
  isEditablePan: boolean;
  isEditableAadhaar: boolean;
  errorFlag: boolean;
} | null;


export type AadharApiType = BaseModule & {
  GetExistingAadharDetails: (
    request: GetExistingAadharDetailsRequest,
  ) => Promise<ApiResponse<GetExistingAadharDetailsResponse>>;
  GetAadharOTP: (
    request: GetAadharOTPRequest,
  ) => Promise<ApiResponse<GetAadharOTPResponse>>;
  GetAadharDetailsByOTP: (
    request: GetAadharDetailsByOTPRequest,
  ) => Promise<ApiResponse<GetAadharDetailsByOTPResponse>>;
  GetCKYCDetails: (
    id: string,
  ) => Promise<ApiResponse<GetCKYCResponse>>;
  CKYCDetailsEditable: (
    request: CKYCDetailsEditableRequest,
  ) => Promise<ApiResponse<CKYCDetailsEditableResponse>>;
};
