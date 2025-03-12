import api from 'api/Axios/TwoWheelerBaseurl';
import serviceUrls from 'api/EndPoints/TwoWheeler';
import {ApiResponse} from '..';
import {
  AadharApiType,
  GetAadharDetailsByOTPResponse,
  GetAadharOTPResponse,
  GetExistingAadharDetailsResponse,
  GetCKYCResponse,
  CKYCDetailsEditableResponse
} from './types';

export const AadharApi: AadharApiType = {
  name: 'AadharApi',

  GetExistingAadharDetails: async (
    payload,
  ): Promise<ApiResponse<GetExistingAadharDetailsResponse>> => {
    try {
      const response = await api.post(
        serviceUrls.GET_EXISTING_AADHAR_DETAILS,
        payload,
      );
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

  GetAadharOTP: async (payload): Promise<ApiResponse<GetAadharOTPResponse>> => {
    try {
      const response = await api.post(serviceUrls.GET_AADHAR_OTP, payload);
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

  GetAadharDetailsByOTP: async (
    payload,
  ): Promise<ApiResponse<GetAadharDetailsByOTPResponse>> => {
    try {
      const response = await api.post(
        serviceUrls.GET_AADHAR_DETAILS_BY_OTP,
        payload,
      );
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

  GetCKYCDetails: async (
    payload,
  ): Promise<ApiResponse<GetCKYCResponse>> => {
    try {
      const response = await api.get(
        serviceUrls.GET_CKYC_DETAILS+
        payload,
      );
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


  CKYCDetailsEditable: async (
    payload,
  ): Promise<ApiResponse<CKYCDetailsEditableResponse>> => {
    try {
      const response = await api.post(
        serviceUrls.EDIT_CKYC_DETAILS,
        payload,
      );
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
