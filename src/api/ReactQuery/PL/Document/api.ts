import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import { ApiResponse } from '..';

import { DocumentType, GetDeferalDocumentResponse, UploadDocumentResponse } from './types';
export const Document: DocumentType = {
  name: 'Document',

  UploadDocument: async (payload): Promise<ApiResponse<UploadDocumentResponse>> => {
    try {
      console.log("paaaaaa", payload?.doctype == 'PAN');

      const response = await api.post(payload?.doctype == 'PAN' ? plServiceUrls.UPLOAD_POST_DISBURSAL_PAN_OCR :
        payload?.doctype == 'Aadhaar' ? plServiceUrls.UPLOAD_POST_DISBURSAL_AADHAR_OCR :
          plServiceUrls.UPLOAD_DOCUMENTS, payload);
      console.log('MJJJJJ Success:', JSON.stringify(response.data, null, 4));
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
      const response = await api.post(plServiceUrls.DELETE_DOCUMENT, payload);
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
  UploadDeferralDocument: async (payload): Promise<ApiResponse<UploadDocumentResponse>> => {
    try {
      const response = await api.post(plServiceUrls.UPLOAD_DEFERAL_DOCUMENT, payload);
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
  GetDeferralDocuments: async (appId: string): Promise<ApiResponse<GetDeferalDocumentResponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_DEFERAL_DOCUMENTS + appId);
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
  DeleteDeferralDocument: async (payload): Promise<ApiResponse<UploadDocumentResponse>> => {
    try {
      const response = await api.post(plServiceUrls.DELETE_DEFERAL_DOCUMENT, payload);
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

};
