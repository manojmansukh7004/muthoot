import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import {
  AddressType,
  AddCurrentAddressResponse,
  GetAddressDetailsResponse,
  AddPermanentAddressResponse,
  GetDedupeDetailsResponse
} from './types';

export const Address: AddressType = {
  name: 'Address',
  AddCurrentAddress: async (payload): Promise<ApiResponse<AddCurrentAddressResponse>> => {
    try {
      const response = await api.post(plServiceUrls.ADD_CURRENT_ADDRESS, payload);
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

  AddPermanentAddress: async (payload): Promise<ApiResponse<AddPermanentAddressResponse>> => {
    
    try {
      const response = await api.post(plServiceUrls.ADD_PERMANENT_ADDRESS,payload );
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

  GetAddressDetails: async (payload): Promise<ApiResponse<GetAddressDetailsResponse>> => {
    
    try {
      const response = await api.post(plServiceUrls.GET_ADDRESS_DETAILS,payload);
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

  GetDedupeDetails: async (payload): Promise<ApiResponse<GetDedupeDetailsResponse>> => {
    
    try {
      const response = await api.post(plServiceUrls.GET_DEDUPE_DETAILS,payload);
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
