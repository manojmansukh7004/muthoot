import {useMutation} from 'react-query';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import {applicantType} from '..';

import {
  UploadDocumentRequest,
  UploadDocumentResponse,
  GetDeviationDocumentsDetailResponse
} from './types';
import {DeviationDocuments} from './api';

export const useUploadDocument = (payload: UploadDocumentRequest) => {
  const mutation = useMutation<UploadDocumentResponse>(
    ['DeviationDocuments', payload],
    async () => {
      const response = await DeviationDocuments.UploadDocument(payload);
      if (response.error) {
        useShowFlashMessage('warning', response.message);
      }

      return response.data;
    },
  );

  const {isLoading, isError, data, error} = mutation;

  return [mutation, {isLoading, isError, data, error}] as const;
};

export const useGetDeviationDocumentsDetail = (
  applicantId: string,
  applicantType: applicantType,
) => {
  const mutation = useMutation<GetDeviationDocumentsDetailResponse>(
    ['DeviationDocuments', applicantId, applicantType],
    async () => {
      const response = await DeviationDocuments.GetDeviationDocumentsDetail(
        applicantId,
        applicantType,
      );
      if (response.error) {
        useShowFlashMessage('warning', response.message);
      }

      return response.data;
    },
  );

  const {isLoading, isError, data, error} = mutation;

  return [mutation, {isLoading, isError, data, error}] as const;
};
