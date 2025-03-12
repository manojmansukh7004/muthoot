import {ApiResponse, BaseModule, applicantType} from '..';

export type docTypes =
  | 'Down Payment Receipt'
  | 'Proforma Invoice'
  | 'Insurance Copy'
  | 'KLI Form'
  | 'RC Book'
  | 'RTO Tax Receipt';

export interface PostDto {
  documentType: docTypes;
  isMandatory: 'Y' | 'N';
  section: string;
  filePath?: string;
  fileType?: 'jpg' | 'pdf';
  filePath2?: string;
}
type PostVehicleDetails = {
  appId: string;
  applicantType: string;
  id: number;
  vehicleChasisNumber: string;
  vehicleEngineNumber: string;
  vehicleRegistrationNumber: string;
};

export type UploadDocumentRequest = {
  base64: string;
  appId: string;
  documentType: docTypes | null;
  applicantType: applicantType;
  type: 'jpg' | 'pdf' | null;
} | null;

export type DeleteDocumentRequest =
  | {
      appId: string;
      documentType: docTypes | null;
      applicantType: applicantType;
      isMandatory?: 'Y' | 'N';
    }
  | '';

export type UploadDocumentResponse =
  | {
      applicantId: string;
    }
  | null
  | '';

export type GetPSDResponse = {
  appId: string;
  isOriginalInvoice: boolean;
  applicantType: string;
  invoiceType: string;
  invoiceBy: string;
  exShowRoomPrice: string;
  isOriginalInsurance: boolean;
  isInvoiceBy: string;
  retailInvoiceDate: string;
  retailInvoiceNumber: string;
  exShoroomPriceAsPerInvoice: number;
  chasisNumber: string;
  engineNumber: string;
  performaInvoiceDate: string;
  performaInvoiceNumber: string;
  exShowroomPriceAsPerPerforma: number;
  insuranceFilePath: string;
  insurancePolicyNumber: string;
  insuranceCompany: string;
  insuranceFromDate: string;
  insuranceToDate: string;
  sumInsured: string;
  isInsurancePremiumAmount: string;
  advEmi: number;
  marginAmount: number;
  consolidatedNumberOfCharges: number;
  totalIp: string;
  ipPaidAtBranch: boolean;
  ipPaidAtDealerAndBranch: string;
  ipPaidAtDealer: string;
  ipPaidAtBranchAmount: string;
  dealerName: string;
  subDealerName: string;
  ipMsclAmount: number;
  ipfilePth: string;
  retailInvoiceFilePth: string;
  proformaInvoiceFilePth: string;
  downPayment: number;
  insuranceAmount: number;
  ipfilePthType: string;
  proformaInvoiceFilePthType: string;
  retailInvoiceFilePthType: string;
  goldReceiptUrlType: string;
  insuranceFilePathType: string;
  goldReceiptUrl: string;
  goldWeight: string;
  isSmartPlus: boolean;
  vehicleModel: string;
  name: string;
  applicantRelationship: string;
  martialStatus: string;
  dob: string;
  emailId: string;
  mobileNumber: string;
  gender: string;
  isNomineeMandatory: boolean;
  unsignedFilePath: string;
  signedFilePath: string;
  goodHealthConsent: string;
  isGoDigitVisible: boolean;
} | null;

export type SavePSDRequest = {
  appId: string;
  isOriginalInvoice: boolean;
  applicantType: string;
  invoiceType?: string;
  invoiceBy: string;
  isInvoiceBy: string;
  isOriginalInsurance: boolean;
  retailInvoiceDate: string;
  retailInvoiceNumber: string;
  exShoroomPriceAsPerInvoice: number;
  chasisNumber: string;
  engineNumber: string;
  performaInvoiceDate: string;
  performaInvoiceNumber: string;
  exShowroomPriceAsPerPerforma: number;
  insuranceFilePath?: string;
  insurancePolicyNumber: string;
  insuranceCompany: string;
  insuranceFromDate: string;
  insuranceToDate: string;
  sumInsured: number | null;
  isInsurancePremiumAmount: string;
  advEmi: number;
  marginAmount: number;
  consolidatedNumberOfCharges: number;
  totalIp: string;
  ipPaidAtBranch: boolean;
  ipPaidAtDealer: string;
  ipPaidAtBranchAmount: string;
  ipMsclAmount?: number;
  goldWeight: string;
  ipPaidAtDealerAndBranch: string;
  name: string;
  applicantRelationship: string;
  martialStatus: string;
  dob: string;
  emailId: string;
  mobileNumber: string;
  gender: string;
  isGoDigitVisible: boolean;
} | null;

export type SaveGoDigitRequest = {
  appId: string;
  goodHealthConsent: string;
  goDigitOtpVerified: boolean;
  nomineeName: string;
  nomineeDob: string
} | null;

export type SaveGoDigitResponse = {
  goodHealthConsent: boolean;
  unsignedFilePath: string;
  signedFilePath: string;
  goDigitOtpVerified: boolean;
  isNextEnabled: boolean;
} | null;

export type SavePSDResponse = {} | null;

export type getInvoiceDetailsWithIPBranchRequest = {
  appId: string;
  ipBranch: string;
} | null;

export type getInvoiceDetailsWithIPBranchResponse = {
  ipPaidAtDealer: string;
  ipPaidAtBranchAmount: string;
} | null;

type InsuranceCompany = {
  masterCode: string;
  active: boolean;
  id: number;
  insuranceCompanyName: string;
};

export type getInsuranceCompanyResponse = {
  InsuranceMasterList: InsuranceCompany[];
} | null;

export type GetSubmitToDisbursmentRequest = {
  appId: string;
  submitToDisbursementRemark: string;
} | null;

export type submitToDisbursmentResponse = {} | null;

export type PostDocumentType = BaseModule & {
  UploadDocument: (
    request: UploadDocumentRequest,
  ) => Promise<ApiResponse<UploadDocumentResponse>>;
  DeleteDocument: (
    request: DeleteDocumentRequest,
  ) => Promise<ApiResponse<UploadDocumentResponse>>;
  GetPSD: (appId: string) => Promise<ApiResponse<GetPSDResponse>>;
  SavePSD: (request: SavePSDRequest) => Promise<ApiResponse<SavePSDResponse>>;
  SaveGoDigit: (
    request: SaveGoDigitRequest,
  ) => Promise<ApiResponse<SaveGoDigitResponse>>;
  getInvoiceDetailsWithIPBranch: (
    request: getInvoiceDetailsWithIPBranchRequest,
  ) => Promise<ApiResponse<getInvoiceDetailsWithIPBranchResponse>>;
  GetInsuranceCompanyMaster: () => Promise<
    ApiResponse<getInsuranceCompanyResponse>
  >;
  GetSubmitToDisbursment: (
    request: GetSubmitToDisbursmentRequest,
  ) => Promise<ApiResponse<submitToDisbursmentResponse>>;
};
