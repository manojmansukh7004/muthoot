import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import {BureauType, GetCriffResponse, GetSherlockResponse} from './types';

export const BureauApi: BureauType = {
  name: 'BureauApi',

  GetCriff: async (payload): Promise<ApiResponse<GetCriffResponse>> => {
    try {
      const response = await api.post(payload?.type == 'retry' ? plServiceUrls.GET_RETRY_CRIFF_RESPONSE : plServiceUrls.GET_CRIFF_RESPONSE, payload);
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
  GetSherlockResponse: async ( payload): Promise<ApiResponse<GetSherlockResponse>> => {
    try {
      const response = await api.post(plServiceUrls.GET_SHERLOCK_RESPONSE ,payload);
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
