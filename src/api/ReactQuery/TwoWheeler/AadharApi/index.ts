import {useMutation} from 'react-query';
import useShowFlashMessage from 'hooks/useShowFlashMessage';

import { GetAadharDetailsByOTPRequest, CKYCDetailsEditableResponse, CKYCDetailsEditableRequest, GetCKYCResponse, GetAadharDetailsByOTPResponse, GetAadharOTPRequest, GetAadharOTPResponse, GetExistingAadharDetailsRequest, GetExistingAadharDetailsResponse } from './types';
import { AadharApi } from './api';


export const useGetExistingAadharDetails = (payload: GetExistingAadharDetailsRequest) => {
  const mutation = useMutation<GetExistingAadharDetailsResponse>(
    ['AadharApi', payload],
    async () => {
      const response = await AadharApi.GetExistingAadharDetails(payload);
      // if (response.error) {
      //   useShowFlashMessage('warning', response.message);
      // }
      return response.data;
    },
  );
  const {isLoading, isError, data, error} = mutation;

  return [mutation, {isLoading, isError, data, error}] as const;
};


export const useGetAadharOTP = (payload: GetAadharOTPRequest) => {
  const mutation = useMutation<GetAadharOTPResponse>(
    ['AadharApi', payload],
    async () => {
      const response = await AadharApi.GetAadharOTP(payload);
      if (response.error) {
        useShowFlashMessage('warning', response.message);
      }else{
        useShowFlashMessage('success', response.message);
      }
      return response.data;
    },
  );
  const {isLoading, isError, data, error} = mutation;

  return [mutation, {isLoading, isError, data, error}] as const;
};

export const useGetAadharDetailsByOTP = (payload: GetAadharDetailsByOTPRequest) => {
  const mutation = useMutation<GetAadharDetailsByOTPResponse>(
    ['AadharApi', payload],
    async () => {
      const response = await AadharApi.GetAadharDetailsByOTP(payload);
      if (response.error) {
        useShowFlashMessage('warning', response.message);
      }
      return response.data;
    },
  );
  const {isLoading, isError, data, error} = mutation;

  return [mutation, {isLoading, isError, data, error}] as const;
};

export const useGetCKYC = (id) => {
  const mutation = useMutation<GetCKYCResponse>(
    ['AadharApi', id],
    async () => {
      const response = await AadharApi.GetCKYCDetails(id);
      if (response.error) {
        useShowFlashMessage('warning', response.message);
      }
      return response.data;
    },
  );
  const {isLoading, isError, data, error} = mutation;

  return [mutation, {isLoading, isError, data, error}] as const;
};

export const useCKYCDetailsEditable = (payload: CKYCDetailsEditableRequest) => {
  const mutation = useMutation<CKYCDetailsEditableResponse>(
    ['AadharApi', payload],
    async () => {
      const response = await AadharApi.CKYCDetailsEditable(payload);
      if (response.error) {
        useShowFlashMessage('warning', response.message);
      }
      return response.data;
    },
  );
  const {isLoading, isError, data, error} = mutation;

  return [mutation, {isLoading, isError, data, error}] as const;
};



