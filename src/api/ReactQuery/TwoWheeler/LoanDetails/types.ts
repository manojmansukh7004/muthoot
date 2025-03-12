import {ApiResponse, BaseModule} from '..';

type vechileType = {
  id: number;
  category: string;
};

export type vechileTypeRequest = {
  manufacturer: string;
};

export type vechileTypeResponse = vechileType[] | null;

type manufactureType = {
  id: number;
  manufacture: string;
};

export type manufactureRequest = {
  vechileType: string;
};

export type manufactureResponse = manufactureType[] | null;

type modelType = {
  id: number;
  assetId: string;
  assetCode: string;
  model: string;
  modelCode: string;
  price: number;
  manufacture: string;
  category: string;
};

export type modelRequest = {
  vechileType: string;
  vechileManufacturer: string;
};

export type modelResponse = modelType[] | null;

export type DealerTypeDto = {
  id: number;
  dealerName: string;
  dealerCode: string;
  dealerAndBranch: string;
};

export type delarResponse = {
  error: boolean;
  dealerTypeDto: DealerTypeDto[];
} | null;

export type delarRequest = {
  appId: string;
};

export type subDealerTypeDto = {
  id: number;
  subDealername: string;
  subDealerCode: string;
  subDealerAndBranch: string;
};

export type subDelarResponse = {
  error: boolean;
  subDealerTypeDto: subDealerTypeDto[];
} | null;

export type subDelarRequest = {
  dealerCode: string;
  applicantType?: string;
};

type branchType = {
  id: number;
  branchId: number;
  branchName: string;
  branchCode: string;
  city: string;
  cityCode: string;
  state: string;
  stateCode: string;
  stateId: string;
  brnachNameCode: string;
};

export type branchRequest = {
  appId: string;
};

export type branchResponse = branchType[] | null;

type franchiseType = {
  franchiseId: string;
  code: string;
};

export type franchiseResponse = franchiseType[] | null;

type externalLeadType = {
  id: number;
  leadSourceType: string;
};

export type externalLeadResponse = externalLeadType[] | null;

export type getSchemeDetailsRequest = {
  schemeCode: string;
  appId: string;
  schemeName: string;
  applicantType?: string;
  vechicleType: string;
  vechicleModel: string;
  manufacturer: string;
};

export type getSchemeDetailsResponse = {
  id: number;
  schemeCode: string;
  schemeName: string;
  sourcing: string;
  manufacturer: string;
  rateOfInterest: number;
  netYield: string;
  dealerIncentive: string;
  advanceEmi: number;
  serviceCharge: string;
  state: string;
  dealer: string;
  ltv: string;
  minMarginAmount: string;
  maxLoanAmount: string;
  cliAmount: string;
} | null;

type getAllschemeDetails = {
  schemeCode: string;
  schemeName: string;
};

export type getAllSchemeDetailsRequest = {
  appId: string;
  vechicleType: string;
  vechicleModel: string;
  manufacturer: string;
  applicantType: string;
};

export type getAllSchemeDetailsResponse = getAllschemeDetails[] | null;

export type getRoadtaxResponse = {
  id: number;
  zone: string;
  state: string;
  roadTax: string;
  registration: string;
  scooter: string;
  motorCycle: string;
  mopeds: string;
  roadTaxCalculated: string;
  accessories: string;
  exShowRoomPrice: string;
  dob: string;
} | null;

type getTenureDetails = {
  id: number;
  schemeCode: string;
  schemeName: string;
  tenure: string;
  roi: number;
  dealerIncentive: string;
  pliAmount: string;
};

export type getTenureResponse = getTenureDetails[] | null;

type GetRSAAmountYear = {
  id: number;
  rsaAmount: string | null;
  rsaYear: string | null;
  value: string;
};

export type GetRSAAmountYearResponse = GetRSAAmountYear[] | null;

export type emiRequest = {
  loanAmount: number;
  tenureInMonths: number;
  flatRate: number;
  appId: string;
  applicantType?: string;
  schemeCode: string;
  schemeName: string;
  exShowRoomPrice: number;
};

export type emiResponse = {
  appId: null | string;
  loanAmount: null | number;
  loanDisbursementDate: null | string; // You can use a specific date format here
  firstDueDate: null | string; // You can use a specific date format here
  tenureInMonths: null | number;
  flatRate: null | number;
  emiAdvance: null | number;
  emiAmount: number;
  bpiPeriodInDays: number;
  serviceCharges: string;
  documentationCharges: string;
  documentationWaivedValueMin: string;
  bpi: null | number;
  emiWithBpi: number;
  repaymentMode: string;
  companyProofId: string;
  documentationWaivedValue: number;
  vintageProof: string;
  error: boolean;
  irr: number;
  emiWithoutBpi: number;
  firstEmiDate: string;
  bpiDay: number;
  bpiAmount: number;
} | null;

export type pliRequest = {
  applicantId?: string;
  appId?: string;
  loanAmount?: string;
  loanAmt?: string;
  tenure: string;
  type?: string;
};

export type pliResponse = {
  applicantId: string;
  dateOfBirth: string;
  tenure: string;
  loanAmount: string;
  insurer: string;
  premium: number;
  statusMessage: string;
  grossPremiumAmount?: string;
} | null;

export type dedupeDetailsRequest = {
  applicantId: string;
  loanAmount: string;
  tenure: string;
};

export type dedupeDetailsResponse = {
  applicantId: string;
  dateOfBirth: string;
  tenure: string;
  loanAmount: string;
  insurer: string;
  premium: number;
  statusMessage: string;
} | null;

export type getDeliveryLetterRequest = {
  dealerCode: string;
};

export type getDeliveryLetterResponse = {
  isRCNearThreshold: boolean | null;
  isRCCrossThreshold: boolean | null;
  isGNPANearThreshold: boolean | null;
  isGNPACrossThreshold: boolean | null;
  message: string;
  isAlertPopupVisible: boolean;
} | null;

export type setDearshipDetailsResponse = {} | null;

export type setDearshipDetailsRequest = {
  appId: string;
  sourcedBy: string;
  dealerName: string;
  dealerCode: any;
  subDealerCode: string;
  subDealerName: string;
  franchiseSourcedBy: string;
  branchName: string;
  branchCode: string;
  employeeCode: string;
  leadSourcedBy: string;
  leadNumber: string;
  accountConductsSatisfatcory: string;
  isExistingCustomerFranchise: boolean;
  applicantType?: string;
  isUpdatedBy: string;
  dealerAndBranch: string;
  subDealerAndBranch: string;
  isReEdit: boolean;
  paymentTo: string;
  businessVerticle: string;
  businessChannel: string;
  channelBranchUser: string;
  leadSource: string;
  leadPartnerName: string;
  payoutCategory: string;
  leadGeneratedBy: string;
  isEmployeeIdVerified: boolean;
  originalEmployeeId: string;
} | null;

export type getDearshipDetailsResponse = {
  id: number;
  appId: string;
  sourcedBy: string;
  dealerName: string;
  dealerCode: string;
  subDealerCode: string;
  subDealername: string;
  franchiseSourcedBy: string;
  branchName: string;
  branchCode: string;
  employeeCode: string;
  leadSourcedBy: string;
  leadNumber: string;
  accountConductsSatisfatcory: string;
  isExistingCustomerFranchise: boolean;
  dealerAndBranch: string;
  subDealerAndBranch: string;
  isSulb: boolean;
  paymentTo: string;
  businessChannel: string;
  channelBranchUser: string;
  isEmployeeIdVerified: boolean;
  leadGeneratedBy: string;
  leadPartnerName: string;
  payoutCategory: string;
} | null;

export type setLoanDetailsRequest = {
  appId: string;
  applicantType?: string;
  updatedBy?: string;
  schemeName: string;
  schemeId: string;
  loanAmountRequested: number;
  tenure: number;
  roi: number;
  ltv: number;
  maxLoanAmount: number;
  noOfAdvanceEmi: number;
  emiAmount: number;
  minAndMaxTenure: number;
  margin: number;
  isCli: boolean;
  isCliAddLoan: boolean;
  cliAmount: number | null;
  isPli: boolean;
  isPliAddLoan: boolean;
  pliAmount: number | null;
  isGoDigit: boolean;
  isGoDigitAddedLoan: boolean;
  goDigitAmount: number | null;
  goDigitTenure: number;
  finalLoanAmount: number;
  unsignedSanctionLetter: string;
  signSanctionLetter: string;
  remarks: string;
  manufacturer: string;
  vehicleType: string;
  vehicleModel: string;
  assetCode: string;
  exShowRoomPrice: number;
  roadTax: number;
  insurance: number;
  registrationCharges: number;
  accessories: number;
  ltvAmount: number;
  approvedLoanAmount: number;
  on_road_price: number;
  downPayment: number;
  actualDownPayment: number;
  addOnCharges: number;
  repaymentMode: string;
  companyProofId: string;
  vintageProof: string;
  serviceCharges: number;
  documentationCharges: number;
  documentationWaived: boolean;
  documentationChargesWithoutWaived: number;
  isAmtRequestedIsFreez: boolean;
  pliTenure: number;
  irr: number;
  isReEdit: boolean;
  documentationChargesWaiver: string;
  finalDocumentationCharges: string;
  isRoadSiteAssisting: boolean;
  isRoadSiteAssistingAddLoan: boolean;
  roadSiteAssistingAmount: number | null;
  roadSiteAssistingValue: number | null;
  roadSiteAssistingYear: number | null;
  emiWithoutBpi: number;
  firstEmiDate: string;
  bpiDay: number;
  bpiAmount: number;
  emiWithBpi: number;
} | null;

export type setLoanDetailsResponse = {} | null;

export type getLoanDetailsResponse = {
  id: number;
  appId: string;
  schemeName: string;
  schemeId: string;
  loanAmountRequested: number;
  tenure: number;
  roi: number;
  ltv: number;
  maxLoanAmount: number;
  noOfAdvanceEmi: number;
  emiAmount: number;
  minAndMaxTenure: number;
  margin: number;
  isCli: boolean;
  isCliAddLoan: boolean;
  cliAmount: number;
  isPli: boolean;
  isPliAddLoan: boolean;
  pliAmount: number;
  isGoDigit: boolean;
  isGoDigitAddedLoan: boolean;
  goDigitAmount: number | null;
  goDigitTenure: string;
  finalLoanAmount: number;
  unsignedSanctionLetter: string;
  signSanctionLetter: string;
  remarks: string;
  manufacturer: string;
  vehicleType: string;
  vehicleModel: string;
  assetCode: string;
  exShowRoomPrice: number;
  roadTax: number;
  insurance: number;
  registrationCharges: number;
  accessories: number;
  ltvAmount: number;
  approvedLoanAmount: number;
  on_road_price: number;
  downPayment: number;
  actualDownPayment: number;
  addOnCharges: number;
  serviceCharges: string;
  documentationCharges: string;
  documentationChargesWithoutWaived: string;
  documentationWaived: boolean;
  documentationWaivedValue: string;
  isAmtRequestedIsFreez: boolean;
  pliTenure: number;
  documentationChargesWaiver: string;
  finalDocumentationCharges: string;
  dob: string;
  isRoadSiteAssisting: string;
  isRoadSiteAssistingAddLoan: string;
  roadSiteAssistingAmount: string;
  roadSiteAssistingValue: string;
  roadSiteAssistingYear: string;
} | null;

export type getInsuranceCapResponse = {
  id: number;
  vechileType: string;
  insuranceAmnt: number;
  maxCapAmnt: number;
  accessories: boolean;
} | null;

export type getLeadSourceResponse = {} | null;

export type getLeadBusinessVerticleResponse = {} | null;

export type getVerifyEmployeeRequest = {
  employeeId: string;
  appId: string;
};

export type getVerifyEmployeeResponse = {
  employeeId: string;
  appId: string;
  isEmployeeIdVerified: boolean;
} | null;

export type VehicalType = BaseModule & {
  GetVehicalType: (
    vechileTypeRequest: string,
  ) => Promise<ApiResponse<vechileTypeResponse>>;
  GetFranchise: () => Promise<ApiResponse<franchiseResponse>>;
  GetExternalLead: () => Promise<ApiResponse<externalLeadResponse>>;
  GetManufacturer: () => Promise<ApiResponse<manufactureResponse>>;
  GetModel: (modelRequest: string) => Promise<ApiResponse<modelResponse>>;
  GetDelar: (delarRequest: string) => Promise<ApiResponse<delarResponse>>;
  GetAllSchemeDetails: (
    request: getAllSchemeDetailsRequest,
  ) => Promise<ApiResponse<getAllSchemeDetailsResponse>>;
  GetRoadTax: (
    getRoadTaxRequest: string,
  ) => Promise<ApiResponse<getRoadtaxResponse>>;
  GetTenure: (
    getTenureRequest: string,
  ) => Promise<ApiResponse<getTenureResponse>>;
  GetRSAAmountYear: (
    GetRSAAmountYear: string,
  ) => Promise<ApiResponse<GetRSAAmountYearResponse>>;
  GetDearshipDetails: (
    getDearshipDetailsRequest: string,
  ) => Promise<ApiResponse<getDearshipDetailsResponse>>;
  GetLoanDetails: (
    getLoanDetailsRequest: string,
  ) => Promise<ApiResponse<getLoanDetailsResponse>>;
  GetSubDelar: (
    request: subDelarRequest,
  ) => Promise<ApiResponse<subDelarResponse>>;
  GetBranch: (branchRequest: string) => Promise<ApiResponse<branchResponse>>;
  GetSchemeDetails: (
    request: getSchemeDetailsRequest,
  ) => Promise<ApiResponse<getSchemeDetailsResponse>>;
  GetEMIValue: (request: emiRequest) => Promise<ApiResponse<emiResponse>>;
  GetPLIValue: (request: pliRequest) => Promise<ApiResponse<pliResponse>>;
  SetDearshipDetails: (
    request: setDearshipDetailsRequest,
  ) => Promise<ApiResponse<setDearshipDetailsResponse>>;
  SetLoanDetails: (
    request: setLoanDetailsRequest,
  ) => Promise<ApiResponse<setLoanDetailsResponse>>;
  GetInsuranceCap: (
    request: string,
  ) => Promise<ApiResponse<getInsuranceCapResponse>>;
  GetDedupeDetails: (
    request: dedupeDetailsRequest,
  ) => Promise<ApiResponse<dedupeDetailsResponse>>;
  GetDeliveryLetter: (
    request: getDeliveryLetterRequest,
  ) => Promise<ApiResponse<getDeliveryLetterResponse>>;
  GetLeadSource: (leadSourceRequest: string) => Promise<ApiResponse<getLeadSourceResponse>>;
  GetLeadBusinessVerticle: (leadBusinessVerticleRequest: string) => Promise<ApiResponse<getLeadBusinessVerticleResponse>>;
  GetVerifyEmployee: (
    request: getVerifyEmployeeRequest,
  ) => Promise<ApiResponse<getVerifyEmployeeResponse>>;
};
