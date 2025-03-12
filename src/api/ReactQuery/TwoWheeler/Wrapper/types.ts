import { ApiResponse, BaseModule } from '..';

interface RegisterRepaymentData {
  nameMatched: boolean;
  enachResponseUrl: string;
}

// interface ValidateVpaData {
//   nameMatched: boolean,
//   payerName: string,
//   payerVpa: string,
//   accountHolderName: string,
//   status: string
// }


interface CreateMandateVpaData {
  nameMatched: boolean,
  message: string,
  desc: string,
  status: string

}

export type RegisterRepaymentDetailsRequest = {
  emi: string | undefined,
  tenure: string | undefined,
  emailId: string | undefined,
  mobileNumber: string | undefined,
  applicantUniqueId: string | undefined
  debitStartDate: string | undefined,
  accountHolderName: string | undefined,
  bankCode: string | undefined,
  ifsc: string | undefined,
  accountNumber: string | undefined,
  aadharNo: string | undefined,
  service: string | undefined,
  bankId: string,
  mode: string,
  // isNachReactivation: boolean,
  authenticationMode: 'A' | 'D' | 'N' | 'V' | 'C' | undefined

};
export type RegisterRepaymentDetailsResponse = {
  data?: RegisterRepaymentData,
  Enachregistrationurl: string,
  error?: boolean,
  message?: string,
  statusCode?: string
} | null;

export type ValidateVpaRequest = {
  vpa?: string,
  applicantUniqueId?: string,
  service?: string,
  accountHolderName?: string,
  appId: string,
  virAdd: string
};


// export type ValidateVpaResponse = {
//   data: ValidateVpaData,
//   error: boolean,
//   message: string,
//   statusCode: string
// } | null;

export type ValidateVpaData = {
  timeStamp: string;
  FK_VVPA_REQ_ID: number;
  code: string;
  resDesc: string;
  hmac: string;
  resCode: string;
  operationName: string;
  verifiedName: string;
  ifsc: string;
  accType: string;
  type: string;
  txnId: string;
};

export type ValidateVpaResponse = {
  statusDesc: string;
  responseStatus: string;
  resData: ValidateVpaData;
  responseCode: string;
  statusCode: string;
};

export type CreateMandateVpaRequest = {
  applicantUniqueId: string,
  appId: string,
  // emi: string,
  amount: string,
  payerName: string,
  payerVpa: string,
  authenticationMode: string,
  debitStartDate: string,
  service?: string,
  isNachReactivation: boolean
};

export type CreateMandateVpaResponse = {
  data: CreateMandateVpaData,
  error: boolean,
  message: string,
  statusCode: string
} | null;

export type GetVpaStatusRequest = {
  appId: string,
};


interface ResData {
  umrn: string;
  applicationNo: string;
  umn: string;
  customer_id: string;
  subType: string;
  status: string;
}

export type GetVpaStatusResponse = {
  nachType: string;
  mcslUniqueid: string;
  statusdesc: string;
  oneRupeeMandateCalling: boolean;
  responseStatus: string;
  resData: ResData;
  responseCode: string;
} | null;

export type OneRupessMandateRequest = {
  appId: string
};


interface ResData {
  fK_REQ_ID: number;
  mcslUniqueId: string;
  applicationNo: string;
  operationName: string;
  txnId: string;
  txnRefId: string;
  custRefId: string;
  resCode: string;
  resDesc: string;
  timeStamp: string;
  hmac: string;
  resJson: string;
  executeType: string;
}
export type OneRupessMandateResponse = {
  responseCode: string;
  responseStatus: string;
  statuscode: string;
  mcslUniqueid: string;
  statusdesc: string;
  resData: ResData;
} | null;

export type MerchantStatusRequest = {
  appId: string
};

export type WrapperType = BaseModule & {
  RegisterRepaymentDetails: (
    request: RegisterRepaymentDetailsRequest,
  ) => Promise<ApiResponse<RegisterRepaymentDetailsResponse>>;
  ValidateVpa: (
    request: ValidateVpaRequest,
  ) => Promise<ApiResponse<ValidateVpaResponse>>;
  CreateMandateVpa: (
    request: CreateMandateVpaRequest,
  ) => Promise<ApiResponse<CreateMandateVpaResponse>>;
  GetVpaStatus: (
    request: string,
  ) => Promise<ApiResponse<GetVpaStatusResponse>>;
  OneRupessMandate: (
    request: OneRupessMandateRequest,
  ) => Promise<ApiResponse<OneRupessMandateResponse>>;
  MerchantStatus: (
    request: MerchantStatusRequest,
  ) => Promise<ApiResponse<GetVpaStatusResponse>>;
}