import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import {
  GenerateKFSResponse,
  GetKFSResponse,
  KFSTypes,
  SendOTPForKFSResponse,
  callLegalityResponse,
} from './types';

export const KFS: KFSTypes = {
  name: 'KFS',

  GenerateKFS: async (
    appId,
  ): Promise<ApiResponse<GenerateKFSResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.GENERATE_KFS + appId,
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
  SendOTPForKFS: async (
    applicantId,
    employeeId,
    otpmode,
  ): Promise<ApiResponse<SendOTPForKFSResponse>> => {
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
  CallLegality: async (
    payload,
  ): Promise<ApiResponse<callLegalityResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.CALL_LIGALITY+payload,
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
  GetKFS: async (
    appId,
  ): Promise<ApiResponse<GetKFSResponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_KFS + appId);
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
