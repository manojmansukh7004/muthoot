import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import {
 ProductType,
 GetAssetresponse,
 UploadProductResponse,
 addProductResponse, 
 getIPMasterResponse,
 getProductResponse,
 getRelationMasterResponse
} from './types';

export const Product: ProductType = {
  name: 'Product',

  SaveProduct: async (payload): Promise<ApiResponse<addProductResponse>> => {
    try {
      const response = await api.post(plServiceUrls.SET_PRODUCT_DETILS, payload);
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

  UploadProduct: async (payload): Promise<ApiResponse<UploadProductResponse>> => {
    try {
      const response = await api.post(plServiceUrls.UPLOAD_PRODUCT_DOCUMENT, payload);
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

  GetIPMaster: async (): Promise<ApiResponse<getIPMasterResponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_IP_MASTER);
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

  GetAssetMaster: async (): Promise<ApiResponse<GetAssetresponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_ASSET_MASTER);
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

  GetRelationMaster: async (): Promise<ApiResponse<getRelationMasterResponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_Relation_MASTER);
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

  GetProductDetails: async (id): Promise<ApiResponse<getProductResponse>> => {
    
    try {
      const response = await api.get(`${plServiceUrls.GET_PRODUCT_DETILS}${id.applicantType}/${id.appId}`);
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
