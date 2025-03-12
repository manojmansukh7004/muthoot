import api from 'api/Axios/TwoWheelerBaseurl';
import serviceUrls from 'api/EndPoints/TwoWheeler';
import { ApiResponse } from '..';
import { BureauType, GetCriffResponse, GetSherlockResponse } from './types';

export const BureauApi: BureauType = {
  name: 'BureauApi',

  GetCriff: async (payload): Promise<ApiResponse<GetCriffResponse>> => {
    try {
      const response = await api.post(payload?.type == 'retry' ? serviceUrls.GET_RETRY_CRIFF_RESPONSE : payload?.type == 'cibil' ? serviceUrls.GET_CIBIL_RESPONSE : serviceUrls.GET_CRIFF_RESPONSE, payload);
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
  GetSherlockResponse: async (payload): Promise<ApiResponse<GetSherlockResponse>> => {
    try {
      const response = await api.post(serviceUrls.GET_SHERLOCK_RESPONSE, payload);
      // console.log('API Success:', JSON.stringify(response));
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
