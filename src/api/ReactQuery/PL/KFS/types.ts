import {ApiResponse, BaseModule} from '..';

export type GenerateKFSResponse = {
  sanction_letter: string;
} | null;

export type SendOTPForKFSResponse = {

} | null;

export type GetKFSResponse = {
  unsignedKfsDoc: string;
  sanction_letter: string;
  signedKfsDoc: string;
  isNextEnable: boolean;
  isConsent: boolean;
  language: string;
} | null;

export type VerifyOTPKFSRequest = {
  applicantId: string;
  otp: string;
  employeeId: string;
  otpmode:  'F' | 'R',
};
export type callLegalityResponse = {
  mainApplicantUrl: string;
  guarantorUrl: string

} | null;

export type KFSTypes = BaseModule & {
  GenerateKFS: (
    appid: string,
  ) => Promise<ApiResponse<GenerateKFSResponse>>;
  SendOTPForKFS: (
    applicantId: string,
    employeeId: string,
    otpmode: 'F' | 'R',
  ) => Promise<ApiResponse<SendOTPForKFSResponse>>;
  CallLegality: (
    id: string,
  ) => Promise<ApiResponse<callLegalityResponse>>;
  GetKFS: (
    appid: string,
  ) => Promise<ApiResponse<GetKFSResponse>>;
};
