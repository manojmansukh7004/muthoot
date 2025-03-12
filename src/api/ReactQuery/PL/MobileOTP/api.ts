import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import {GenerateOTPResponse, MobileOTPType, ValidateOTPResponse} from './types';

export const MobileOTP: MobileOTPType = {
  name: 'MobileOTP',

  GenerateOTP: async (payload): Promise<ApiResponse<GenerateOTPResponse>> => {

    try {
      const response = await api.post(plServiceUrls.GENERATE_OTP, payload);
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
  ValidateOTP: async (payload): Promise<ApiResponse<ValidateOTPResponse>> => {
 

    try {
      const response = await api.post(plServiceUrls.VALIDATE_OTP, payload);
      // console.log('API Success:', JSON.stringify(response.data));
      return response.data;
    } catch (error: unknown) {
      // console.log('err');
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
