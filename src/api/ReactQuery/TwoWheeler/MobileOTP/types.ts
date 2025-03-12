import {ApiResponse, BaseModule, applicantType} from '..';

export type GenerateOTPRequest = {
  appId: string;
  applicantType: applicantType;
  mobile:string;
 
  otpmode:'F'|'R';
  employeeId:string;
} | null;

export type GenerateOTPResponse = {
  appId: string;
  otp: string;
  mobile:string;
  requestId: string;
  otpmode:'F'|'R';
  employeeId:string;


} | null;

export type ValidateOTPRequest = {
  appId: string;
  applicantType: applicantType;
  mobile:string;

  otp: string;
  otpmode:'F'|'R';
  employeeId:string;


} | null;

export type ValidateOTPResponse = {
  appId: string;
  applicantType:applicantType;
  coAppId:string;
  isOtpValidated: boolean;
  employeeId:string;
  otpmode:'F'|'R';
  isPopupAlert:  string;
  message: string;
} | null;

export type SaveRelationRequest = {
  appId: string;
  applicantType: string;
  coApplRelation?: string;
  leadRelation: string;
 
};

export type SaveRelationResponse = {
 
} | null;

export type MobileOTPType = BaseModule & {
  GenerateOTP: (
    request: GenerateOTPRequest,
  ) => Promise<ApiResponse<GenerateOTPResponse>>;
  ValidateOTP: (
    request: ValidateOTPRequest,
  ) => Promise<ApiResponse<ValidateOTPResponse>>;
  SaveRelation: (
    request: SaveRelationRequest,
  ) => Promise<ApiResponse<SaveRelationResponse>>;
};
