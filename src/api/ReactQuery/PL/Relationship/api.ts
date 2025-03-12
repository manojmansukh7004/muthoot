import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import {ApiResponse} from '..';
import { GetFamilyNonFamilyDetailsResponse, GetRelationshipMasterResponse, RelationshipType, SaveFamilyNonFamilyDetailsResponse, } from './types';

export const Relationship: RelationshipType = {
  name: 'Relationship',

  GetRelationshipMaster: async (payload): Promise<ApiResponse<GetRelationshipMasterResponse>> => {
    try {
      const response = await api.post(plServiceUrls.GET_RELATIONSHIP_MASTER,payload);
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
  SaveFamilyNonDetails: async (payload): Promise<ApiResponse<SaveFamilyNonFamilyDetailsResponse>> => {
    try {
      const response = await api.post(plServiceUrls.SAVE_FAMILY_NON_FAMILY_DATA,payload);
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
  GetFamilyNonFamilyDetails: async (payload): Promise<ApiResponse<GetFamilyNonFamilyDetailsResponse>> => {
    try {
      const response = await api.post(plServiceUrls.GET_FAMILY_NON_FAMILY_DATA,payload);
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
