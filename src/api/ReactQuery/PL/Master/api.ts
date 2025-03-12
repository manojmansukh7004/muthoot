import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import { ApiResponse } from '..';

import { GetConstitutionResponse, GetPreDocumentsDetailResponse, GetTermsAndConditionsResponse, MasterType } from './types';
export const Master: MasterType = {
  name: 'Master',

  GetPreDocumentsDetail: async (
    applicantId,
    applicantType,
  ): Promise<ApiResponse<GetPreDocumentsDetailResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.GET_PRE_DOCUMENT_DETAIL + applicantType + '/' + applicantId,
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
  GetConstitution: async (id): Promise<
    ApiResponse<GetConstitutionResponse>
  > => {
    try {
      const response = await api.get(plServiceUrls.GET_CONSTITUTION + id);
      //console.log('API Success:', JSON.stringify(response.data));
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
  GetTermsAndConditions: async (): Promise<
    ApiResponse<GetTermsAndConditionsResponse>
  > => {
    try {
      const response = await api.get(plServiceUrls.GET_TERMS_AND_CONDITIONS);
      //console.log('API Success:', JSON.stringify(response.data));
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
