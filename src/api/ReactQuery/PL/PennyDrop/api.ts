import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import { ApiResponse } from '..';
import { PennyDropTypes, VerifyBankAccountResponse,  GetBankAccountDetailsResponse} from './types';

export const PennyDrop: PennyDropTypes = {
  name: 'PennyDrop',
 
 
  VerifyBankAccount: async (payload): Promise<ApiResponse<VerifyBankAccountResponse>> => {
    
    try {
      const response = await api.post(plServiceUrls.PENNY_DROP, payload);
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
  
  GetBankAccountDetails: async (payload): Promise<ApiResponse<GetBankAccountDetailsResponse>> => {
    
    try {
      const response = await api.post(plServiceUrls.GET_PENNY_DROP_DETAILS, payload);
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
