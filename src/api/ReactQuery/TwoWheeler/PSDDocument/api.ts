import api from 'api/Axios/TwoWheelerBaseurl';
import serviceUrls from 'api/EndPoints/TwoWheeler';
import {ApiResponse} from '..';

import { PostDocumentType, SaveGoDigitResponse, UploadDocumentResponse ,submitToDisbursmentResponse, getInsuranceCompanyResponse, GetPSDResponse, SavePSDResponse, getInvoiceDetailsWithIPBranchResponse, getInvoiceDetailsWithIPBranchRequest} from './types';
export const Document: PostDocumentType = {
  name: 'Document',

  UploadDocument: async (payload): Promise<ApiResponse<UploadDocumentResponse>> => {
    try {
      const response = await api.post(serviceUrls.UPLOAD_POST_DISBURSAL_DOCUMENTS, payload);
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
  DeleteDocument: async (payload): Promise<ApiResponse<UploadDocumentResponse>> => {
    try {
      const response = await api.post(serviceUrls.DELETE_POST_DISBURSAL_DOCUMENT, payload);
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
  GetPSD: async (applicantId): Promise<ApiResponse<GetPSDResponse>> => {
    try {
      const response = await api.get(
        `${serviceUrls.GET_PSD_INFO}/${applicantId}` ,
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
  SavePSD: async (
    payload,
  ): Promise<ApiResponse<SavePSDResponse>> => {
    try {
      const response = await api.post(serviceUrls.SAVE_PSD_INFO, payload);
      // console.log('[API] Success:', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
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

  SaveGoDigit: async (
    payload,
  ): Promise<ApiResponse<SaveGoDigitResponse>> => {
    try {
      const response = await api.post(serviceUrls.SAVE_GO_DIGIT, payload);
      // console.log('[API] Success:', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
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
  
  getInvoiceDetailsWithIPBranch: async (
    payload,
  ): Promise<ApiResponse<getInvoiceDetailsWithIPBranchResponse>> => {
    try {
      const response = await api.post(serviceUrls.GET_PSD_INFO_WITH_IP, payload);
      // console.log('[API] Success:', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
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
  GetInsuranceCompanyMaster: async (): Promise<ApiResponse<getInsuranceCompanyResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_INSURANCE_COMPANY_MASTER);
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
  GetSubmitToDisbursment: async (payload): Promise<ApiResponse<submitToDisbursmentResponse>> => {
    
    try {
      const response = await api.post(serviceUrls.SUBMIT_TO_DISBUSTMENT, payload);
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
