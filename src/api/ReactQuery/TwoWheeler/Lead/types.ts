import { ApiResponse, BaseModule, applicantType } from '..';

export type SaveImageRequest = {
  base64value: string;
  appId: string;
  applicantType?: string;

};

export type SaveImageResponse = {
  userImagePath: string;
  applicantId: string
} | null;

export type SaveorUpdateLeadRequest = {
  firstName: string;
  middleName: string;
  lastName: string;
  name: string;
  mobileNumber: string;
  customerProfile: string;
  customerType: string;
  isPanAvailable: boolean;
  panNumber: string;
  aadharNo: string;
  constitutionType: string;
  income: string;
  emailId: string;
  maritalStatus: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  alternateContact: string;
  employeerName: string;
  applicationCoApplicantId: string;
  appId: string;
  applicantType: string;
  dob: string;
  gender: string;
  branch?: string;
  existingCustomer?: string;
  relationship?: string;
  isEarning?: string;
  jobStability: string;
  jobStabilityYear: string;
  createdBy: string;
  isSulbThird?: boolean;
  selectedOffer?: string;
  referredBy: string,
  referredEmployeeCode: string,
  referredEmployeePhoneNumber: string
} | null;

export type SaveorUpdateLeadResponse = {
  id: number;
  name: string;
  mobileNumber: string;
  customerProfile: string;
  customerType: string;
  isPanAvailable: string;
  panNumber: string;
  aadharNo: string;
  income: string;
  maritalStatus: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  alternateContact: string;
  employeerName: string;
  status: string;
  finalStatus: string;
  appId: string;
  userImagePath: string;
  applicantType: string;
  applicantId: null | any;
  dob: string;
  applicationCoApplicantId: string;
  isDelete: string;
  updatedDate: string;
  gender: string;
  isEarning?: string;
  jobStability: string;
  createdBy: string;
} | null;

export type GetLeadResponse = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  mobileNumber: string;
  customerProfile: string;
  customerType: string;
  isPanAvailable: boolean;
  panNumber: string;
  aadharNo: string;
  constitutionType: string;
  income: string;
  alternateContact: string;
  employeerName: string;
  maritalStatus: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  emailId: string;
  decision: null | any;
  status: string;
  finalStatus: string;
  appId: string;
  branch?: string;
  existingCustomer?: string;
  relationship?: string;
  isMale?: boolean;
  isEarning?: string;
  userImagePath: string;
  applicantType: string;
  applicantId: null | any;
  gender: string;
  jobStability: string;
  jobStabilityYear: string;
  dob: string;
  selectedOffer: string;
  isSulbThird: string;
  tenure: string;
  referredBy: string;
  referredEmployeePhonenumber: string;
  referredEmployeeCode: string;
} | null;

type Lead = {
  status: string;
  updated_date: string;
  appId: string;
  name: string;
  leadName?: string;
  applicationId?: string;
  dealerName?: string;
  branch?: string;
  employeeId?: string;
  dealerCode?: string;
  mobileNo?: string;
  fatherName?: string;
  updatedDate?: string;
};

type Prospect = {
  status: string;
  app_id: string;
  remarks: string;
  tvr: boolean;
  decision: string | null;
  cpv: boolean;
  final_status: string;
  credit_status: 'false' | 'true';
  bureau_status: boolean;
  crif_report: string | null;
  payment_status: string | null;
  sanction_letter: string | null;
  case_moduleString: string | null;
  kyc_verification: 'false' | 'true';
  updated_date: string;
  name: string;
};

export type ViewProspectResponse = Prospect[] | null;

export type ViewLeadsResponse = Lead[] | null;

type customerProfileType = {
  id: number;
  profileId: string;
  profile: string;
};
export type GetCustomerProfileResponse = customerProfileType[] | null;

type refrenceType = {
  id: number;
  type: string;
  dropdownLabel: string;
  dropdownValue: string
};
export type GetRefrenceResponse = refrenceType[] | null;

interface PostOffice {
  postOfficeId: string;
  postOffice: string;
}

export type GetPincodeResponse = {
  pincode: string;
  city: string;
  cityCode: string;
  state: string;
  stateCode: string;
  postOfficeList: PostOffice[];
} | null;

export type GetSanctionLetterDetailsRequest = {
  appId: string;
};

export type GetSanctionLetterDetailsResponse = {
  appId: string;
  durationOfLoan: string;
  emiAmount: number;
  roi: number;
  tenure: number;
  loanAmount: number;
  customerId: string;
  customerName: string;
  isGuarantorMandatory: boolean;
  isNextEnable: boolean;
  addGuarantorVisible: boolean;
  nipRule: boolean,
  nipMessage: string,
  incomeRule: boolean,
  incomeMessage: string,
  isRetryButtonVisible: boolean
} | null;

export type ApplicantStatus = {
  appId: string;
  panStatus: boolean;
  kycStatus: boolean;
  ovdStatus: boolean;
  currentPermentAddressStatus: boolean;
  photoVerification: boolean;
  productStatus: boolean;
  loanDetailsStatus: boolean;
  applicantType: 'mainApplicant' | 'guarantor';
  bureauSuccess: boolean;
  bureauScore: string;
  applicantId: string;
  guarantorId: string;
  documentNumber: string;
  breSuccess: boolean;
  bre1Status: 'Bre1_Approved' | 'Bre1_Rejected' | 'Bre1_Manual';
  bre2Status: 'Bre2_Approved' | 'Bre2_Rejected' | 'Bre2_Manual';
  bre3Status: 'Bre3_Approved' | 'Bre3_Rejected' | 'Bre3_Manual';
  dealaerShipDetailStatus: boolean;
  empStatus: boolean;
  referenceStatus: boolean;
  criffReportPath: string;
  applicantName: string;
  loanOfferStatus: boolean;
  sanctionLetterStatus: boolean;
  bankDetailsStatus: boolean;
  isPsd: boolean;
  isLoanAgreement: boolean;
  kfsStatus: boolean;
  isDeferral: boolean;
  error: boolean;
  aaStatus: boolean;
  repaymentStatus: boolean;
  preDisbursalDocument: boolean;
  deferralDocument: boolean;
  postDisbursalDocument: boolean;
  isFreeze: boolean;
  isGuarantorMandatory: boolean;
  applicationCoApplicantType: string;
  psd: boolean;
  loanPopup: boolean,
  rejectMessage: string;
  isEditableAadhaar: boolean;
  isEditablePan: boolean;
  isReAppealButtonVisible: boolean;
  isNextEnableBureau: boolean;
  isPopUpVisibleBureau: boolean;
  popUpMessageBureau: string;
  consentStatus?: string;
};


export type ViewStatusResponse = {
  mainApplicant: ApplicantStatus[];
  guarantor: ApplicantStatus[];
  isGuarantor: boolean;
  productType: string;
  isSubmitToCreditFreeze: boolean;
  isSubmitToDisbursementFreeze: boolean;
  isDisbursementFreeze: boolean;
  isCreditApproved: boolean;
  isReEditbankDetails: boolean;
  isReEditRepayment: boolean;
  isSalesRejectButtonVisible: boolean,
  isSalesReject: boolean;
  isReEditButtonVisible: boolean;
  isReEdit: boolean;
} | null;


export type GetApplicantDetailsByAadharRequest = {
  appId?: string;
  aadharNo: string;
  applicantType: applicantType;
};

export type GetApplicantDetailsByAadharResponse = {
  isDataAvailable: boolean;
  isBre1Approved: boolean;
  appId: string;
  applicantType: string;
  firstName: string;
  middleName: string;
  lastName: string;
  constitutionType: string;
  isPanAvailable: boolean;
  income: string;
  customerProfile: string;
  customerType: string;
  aadharNo: string;
  mobileNumber: string;
  panNumber: string;
  bureauFilePath: string;
  bureauScore: string;
  bureauReportDate: string;
  dob: string;
  alternateContact: string;
  employeerName: string;
  spouseName: string;
  fatherName: string;
  motherName: string;
  maritalStatus: string;
  jobStability: string;
  jobStabilityYear: string;
  gender: string;
  emailId: string;
  branch?: string;
  existingCustomer?: string;
  relationship?: string;
  isEarning?: string;
} | null;

type BranchType = {
  id: number;
  branch: string;
};


export type Customer = {
  id: number;
  customerType: string;
};

export type GetCustomerTypeResponse = Customer[] | null;

export type GetBranchesResponse = BranchType[] | null;

export type salesRejectedRequest = {
  appId: string;
};
export type salesRejectedResponse = {
} | null;

export type salesReEditRequest = {
  appId: string;
  isReEdit: boolean
};
export type salesReEdidResponse = {
} | null;

export type GetPreApprovedOfferRequest = {
  aadharNo: string;
  applicantType: applicantType;
  mobileNumber: string;
  createdBy: string;
  income: string;
};

export type GetPreApprovedOfferResponse = {
  isSulbThird: boolean;
} | null;

export type sherLockCallingRequest = {
  applicantId: string;
  applicantType: string;
  guarantorId: string;
  guarantorType: string;
};

export type sherLockCallingResponse = {
  applicantId: string;
  applicantType: string;
  guarantorId: string;
  guarantorType: string;
  isRetryButtonVisible: boolean;
} | null;

export type GetPlCountResponse = {
  count: number;
  masterLogin: boolean;
} | null;

export type SaveRelationRequest = {
  appId: string;
  applicantType: string;
  coApplRelation: string;
  leadRelation: string;

};

export type SaveRelationResponse = {

} | null;

export type UpdateHeroLeadRequest = {
  appId: string;
  employeeId: string;
};

export type UpdateHeroLeadResponse = {

} | null;

export type LeadType = BaseModule & {
  SaveImage: (
    request: SaveImageRequest,
  ) => Promise<ApiResponse<SaveImageResponse>>;
  GetLead: (id: string) => Promise<ApiResponse<GetLeadResponse>>;
  ViewLeads: (employeeId: string, search: string, type?: string) => Promise<ApiResponse<ViewLeadsResponse>>;
  ViewProspects: (employeeId: string, search: string) => Promise<ApiResponse<ViewProspectResponse>>;
  SaveorUpdateLead: (
    request: SaveorUpdateLeadRequest,
  ) => Promise<ApiResponse<SaveorUpdateLeadResponse>>;
  GetCustomerProfile: (id: string) => Promise<ApiResponse<GetCustomerProfileResponse>>;
  GetRefrence: (id: string) => Promise<ApiResponse<GetRefrenceResponse>>;

  GetPincode: (pincode: string) => Promise<ApiResponse<GetPincodeResponse>>;
  Delete: (removeString: string) => Promise<ApiResponse<GetPincodeResponse>>;
  GetSanctionLetterDetails: (
    id: string,
  ) => Promise<ApiResponse<GetSanctionLetterDetailsResponse>>;
  ViewStatus: (id: string) => Promise<ApiResponse<ViewStatusResponse>>;
  GetApplicantDetailsByAadhar: (
    request: GetApplicantDetailsByAadharRequest,
  ) => Promise<ApiResponse<GetApplicantDetailsByAadharResponse>>;
  GetBranches: (
    employeeId: string,
  ) => Promise<ApiResponse<GetBranchesResponse>>;
  GetCustomerType: () => Promise<ApiResponse<GetCustomerTypeResponse>>;
  salesReject: (
    request: salesRejectedRequest,
  ) => Promise<ApiResponse<salesRejectedResponse>>;
  salesReEdit: (
    request: salesReEditRequest,
  ) => Promise<ApiResponse<salesReEdidResponse>>;
  GetPreApprovedOffer: (
    request: GetPreApprovedOfferRequest,
  ) => Promise<ApiResponse<GetPreApprovedOfferResponse>>;
  GetPlCount: (id: string) => Promise<ApiResponse<GetPlCountResponse>>;
  sherLockCalling: (
    request: sherLockCallingRequest,
  ) => Promise<ApiResponse<sherLockCallingResponse>>;
  SaveRelation: (
    request: SaveRelationRequest,
  ) => Promise<ApiResponse<SaveRelationResponse>>;
  UpdateHeroLead: (
    request: UpdateHeroLeadRequest,
  ) => Promise<ApiResponse<UpdateHeroLeadResponse>>;
};
