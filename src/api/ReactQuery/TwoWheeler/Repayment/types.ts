import { ApiResponse, BaseModule } from '..';

export type SaveRepaymentDetailsRequest = {
  paymentType: string;
  applicantUniqId: string;
  debitStartDate: string;
  authenticationMode: string;
  repaymentMode: string;
  vpa: string;
  bank: string;
  bankId: string;
  bankCode: string;
};

export type SaveRepaymentDetailsResponse = {
  applicantUniqId: string;
  repaymentMode: string;
  pdc: string | null;
  comments: string | null;
  employeeId: string | null;
  disbursementComments: string | null;
  type: string | null;
  leadId: string | null;
  leadCode: string | null;
  paymentType: string;
  debitStartDate: string;
  aadharNo: string | null;
  authenticationMode: string;
  vpa: string | null;
} | null;

export type GetRepaymentDetailsResponse = {
  bankDetailsIfsc: string;
  isReEditRepayment: boolean
  repaymentType: string;
  bankDetailsAccountNumber: string;
  nachSuccessFlag: boolean;
  bankDetailsAccountHolderName: string;
  enachamount: string;
  status: string;
  isAgreementDone: boolean;
  AadharNo: string;
  AuthenticationType: string;
  debit_start_date: any;
  upi: string,
  physicalNachFilePath: string;
  bankName: string;
  bankCode: string;
  bankId: string;
  type: 'jpg' | 'pdf' | null;
} | null;

export type GetApplicationDetailsRequest = {
  applicantUniqueId: string;
};

export type GetCamspayEnachRequest = {
  loanId: string;
};


export type GetCamspayEnachResponse = {
  enachAmount: string,
  status: string,
  isNachSuccess: boolean
} | null;

export type GetApplicationDetailsResponse = {
  emi: number;
  emailId: boolean;
  mobileNumber: bigint;
  applicantUniqueId: string;
  bankCode: boolean;
  accountHolderName: string;
  ifsc: string;
  accountNumber: string;
  tenure: number;
  debitStartDate: string;
  moveForwardFlag: boolean;
} | null;

export type saveCashRequest = {
  instrumentNo1: string;
  instrumentNo2?: string;
  instrumentNo3?: string;
  accountHolderName: string;
  bankName: string;
  ifscCode: string;
  appId: string;
  applicantType: string;
  repaymentMode: string;
  paymentType: string;
} | null;

export type saveCashResponse = {
  instrumentNo1: string;
  instrumentNo2: string;
  instrumentNo3: string;
  accountHolderName: string;
  bankName: string;
  ifscCode: string;
  appId: string;
  applicantType: string;
  repaymentMode: string;
  paymentType: string;
} | null;

export type getCashResponse = {
  instrumentNo1: string;
  instrumentNo2: string;
  instrumentNo3: string;
  accountHolderName: string;
  bankName: string;
  ifscCode: string;
  appId: string;
  applicantType: string;
  repaymentMode: string;
  paymentType: string;
  isCash: boolean;
  isVisibleCashOnly: boolean;
} | null;

export type GetPhysicalNachRequest = {
  appId: string;
  applicantType: string;
  isNachReactivation: boolean;

};

export type GetPhysicalNachResponse = {
  applicationNo : string;
  customer_id: string;
  mcslUniqueid: string;
  nupayRefNo:string;
  pdf_url:string;
  reference_number: string;
  statusDesc: string;
}| null;

export type UploadNachRequest = {
  base64value: string;
  appId: string;
  applicantType?: string;
  type: 'jpg' | 'pdf' | null;
}

export type UploadNachResponse = {
  filePath: string;

} | null;

export type deleteNachRequest = {
  appId: string;
  applicantType?: string;
}

export type deleteNachResponse = {

} | null;


interface Bank {
  id?: number;
  bankId?: number;
  appId?: number | null;
  name?: string;
  bankCode?: string;
  mode?: string;
  mode1?: string | null;
  mode2?: string | null;
  mode3?: string | null;
  mode4?: string | null;
  createdDate?: string;
  updatedDate?: string;
}

export type getRepaymentStatusResponse = {
  appId: string;
  isCaseSubmittoLMS: boolean,
  isError: boolean,
  statusMessage: string,
  finalStatus: string,
  paymentMode: string,
  enachStatus: string,
  isNewMandateVisible: boolean;
} | null;

export type getRepaymentStatusRequest = {
  appId: string;
  productType: string,
  type?: string
} | null;

export type getEsignBankListResponse = Bank[] | null;


export type RepaymentType = BaseModule & {
  SaveRepaymentDetails: (
    request: SaveRepaymentDetailsRequest,
  ) => Promise<ApiResponse<SaveRepaymentDetailsResponse>>;

  GetApplicationDetails: (
    request: GetApplicationDetailsRequest,
  ) => Promise<ApiResponse<GetApplicationDetailsResponse>>;

  GetRepaymentDetails: (
    request: string,
  ) => Promise<ApiResponse<GetRepaymentDetailsResponse>>;

  GetCamspayEnachResponse: (
    request: GetCamspayEnachRequest,
  ) => Promise<ApiResponse<GetCamspayEnachResponse>>;

  SaveCashDetails: (
    request: saveCashRequest,
  ) => Promise<ApiResponse<saveCashResponse>>;

  GetCashDetails: (
    request: string,
  ) => Promise<ApiResponse<getCashResponse>>;

  GetPhysicalNach: (
    request: GetPhysicalNachRequest,
  ) => Promise<ApiResponse<GetPhysicalNachResponse>>;
  UploadNach: (
    request: UploadNachRequest,
  ) => Promise<ApiResponse<UploadNachResponse>>;
  DeleteNach: (
    request: deleteNachRequest,
  ) => Promise<ApiResponse<deleteNachResponse>>;

  getEsignBankList: () => Promise<ApiResponse<getEsignBankListResponse>>;
  getEmandateBankList: () => Promise<ApiResponse<getEsignBankListResponse>>;
  GetRepaymentStatus: (request: getRepaymentStatusRequest) => Promise<ApiResponse<getRepaymentStatusResponse>>;

};