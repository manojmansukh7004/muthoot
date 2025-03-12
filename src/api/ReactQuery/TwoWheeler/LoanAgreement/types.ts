import { ApiResponse, BaseModule } from '..';

export type GetAgreementDetailsResponse = {
  filepath: string;
  dropdownValue: string;
  languageLabel: string;
} | null;


export type eSignRequest = {
  appId: string;
  language: string;
  languageLabel: string;
  // isReEdit: boolean;
};
export type eSignResponse = {
  disbursedAmt: string;
  mainAppSignUrl: string;
  message: string;
  status: string;
  guarantorSignUrl: string;
  muthootSignUrl: string;
  isMainApplicantSigned: string,
  isGuarantorSigned: string,
} | null;

export type LoanAgreementTypes = BaseModule & {
  GetAgreementDetails: (
    appid: string,
  ) => Promise<ApiResponse<GetAgreementDetailsResponse>>;

  eSign: (
    request: eSignRequest,
  ) => Promise<ApiResponse<eSignResponse>>;

};
