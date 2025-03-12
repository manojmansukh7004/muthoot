import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import {
  GenerateSanctionLetterResponse,
  GetSanctionLetterResponse,
  SanctionLetterTypes,
  SendOTPForSanctionLetterResponse,
  VerifyOTPSanctionLetterResponse,
} from './types';

export const SanctionLetter: SanctionLetterTypes = {
  name: 'SanctionLetter',

  GenerateSanctionLetter: async (
    appId,
  ): Promise<ApiResponse<GenerateSanctionLetterResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.GENERATE_SANCTION_LETTER + appId,
      );
      //  console.log('API Success:', JSON.stringify(response.data));
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message || (error as Error).message;

      return {
        data: null,
        message: errorMessage,
        afxToken: null,
        status: (error as any)?.response?.status || 500,
        error: true,
      };
    }
  },
  SendOTPForSanctionLetter: async (
    applicantId,
    employeeId,
    otpmode,
  ): Promise<ApiResponse<SendOTPForSanctionLetterResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.SEND_OTP_SANCTION_LETTER +
          `applicantId=${applicantId}&employeeId=${employeeId}&otpmode=${otpmode}`,
      );
    //  console.log('API Success:', JSON.stringify(response.data));
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message || (error as Error).message;

      return {
        data: null,
        message: errorMessage,
        afxToken: null,
        status: (error as any)?.response?.status || 500,
        error: true,
      };
    }
  },
  VerifyOTPSanctionLetter: async (
    payload,
  ): Promise<ApiResponse<VerifyOTPSanctionLetterResponse>> => {
    try {
      const response = await api.post(
        plServiceUrls.VERIFY_OTP_SANCTION_LETTER,
        payload,
      );
      //  console.log('API Success:', JSON.stringify(response.data));
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message || (error as Error).message;

      return {
        data: null,
        message: errorMessage,
        afxToken: null,
        status: (error as any)?.response?.status || 500,
        error: true,
      };
    }
  },
  GetSanctionLetter: async (
    appId,
  ): Promise<ApiResponse<GetSanctionLetterResponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_SANCTION_LETTER + appId);
      //  console.log('API Successjjjjjj:', JSON.stringify(response.data));
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        (error as any)?.response?.data?.message || (error as Error).message;

      return {
        data: null,
        message: errorMessage,
        afxToken: null,
        status: (error as any)?.response?.status || 500,
        error: true,
      };
    }
  },
};
