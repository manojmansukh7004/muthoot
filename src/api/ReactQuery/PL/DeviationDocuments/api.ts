import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import { ApiResponse } from '..';

import { DeviationDocumentType, UploadDocumentResponse,GetDeviationDocumentsDetailResponse } from './types';
export const DeviationDocuments: DeviationDocumentType = {
  name: 'DeviationDocuments',

  UploadDocument: async (payload): Promise<ApiResponse<UploadDocumentResponse>> => {
    try {
      const response = await api.post(plServiceUrls.UPLOAD_DEVIATION_DOCUMENTS, payload);
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
  GetDeviationDocumentsDetail: async (
    applicantId,
    applicantType,
  ): Promise<ApiResponse<GetDeviationDocumentsDetailResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.GET_DEVIATION_DOCUMENT_DETAIL + '?appId=' + applicantId,
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
