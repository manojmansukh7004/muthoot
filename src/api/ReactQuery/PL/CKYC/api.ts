import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import {
  CKYCType,
  GetCKYCStatusResponse
} from './types';

export const CKYC: CKYCType = {

  name: 'CKYC',
  GetCKYCStatus: async (payload): Promise<ApiResponse<GetCKYCStatusResponse>> => {

    try {
      const response = await api.post(payload?.type == "kycStatus" ? plServiceUrls.GET_CKYC_STATUS : plServiceUrls.GET_CKYC , payload);
      //  console.log('[API] Success:', JSON.stringify(response.data));
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