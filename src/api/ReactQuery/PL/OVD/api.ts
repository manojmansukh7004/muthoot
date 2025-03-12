import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import {
  OVDType,
  SaveOVDDetailsResponse,
  GetOVDDetailsResponse,
  SaveManualOVDDetailsResponse
} from './types';

export const OVD: OVDType = {
  name: 'OVD',
  SaveOVDDetails: async (payload): Promise<ApiResponse<SaveOVDDetailsResponse>> => {
    try {
      const response = await api.post(plServiceUrls.SAVE_OVD_DETAILS, payload);
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

  GetOVDDetails: async (id): Promise<ApiResponse<GetOVDDetailsResponse>> => {
    
    try {
      const response = await api.get(plServiceUrls.GET_OVD_DETAILS+id );
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
  SaveManualOVDDetails: async (payload): Promise<ApiResponse<SaveManualOVDDetailsResponse>> => {
    try {
      const response = await api.post(plServiceUrls.SAVE_MANUAL_OVD_DETAILS, payload);
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
