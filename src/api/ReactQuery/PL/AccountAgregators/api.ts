import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import {

 AAResponse, 
 AAType
 
} from './types';

export const AA: AAType = {
  name: 'Product',

  GetAccountAggregator: async (payload): Promise<ApiResponse<AAResponse>> => {
    try {
      const response = await api.post(plServiceUrls.ACCOUNT_AGGREGATOT, payload);
      // console.log('API Success:', JSON.stringify(response.data));
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
