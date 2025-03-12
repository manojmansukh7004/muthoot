import { useMutation } from 'react-query';
import useShowFlashMessage from 'hooks/useShowFlashMessage';
import { Wrapper } from './api';
import {
    RegisterRepaymentDetailsRequest,
    RegisterRepaymentDetailsResponse,
    ValidateVpaRequest,
    ValidateVpaResponse,
    CreateMandateVpaRequest,
    CreateMandateVpaResponse,
    GetVpaStatusRequest,
    GetVpaStatusResponse,
    MerchantStatusRequest,
    MerchantStatusResponse,
    OneRupessMandateRequest,
    OneRupessMandateResponse
  } from './types';

  
export const useRegisterRepaymentDetails = (
    payload: RegisterRepaymentDetailsRequest,
  ) => {
    const mutation = useMutation<RegisterRepaymentDetailsResponse>(
      ['Wrapper', payload],
      async () => {
        const response = await Wrapper.RegisterRepaymentDetails(payload);
  
        if (response.error) {
          useShowFlashMessage('warning', response?.message ? response?.message : "Internal Servar Error");
        }
        return response.data;
      },
    );
  
    const { isLoading, isError, data, error } = mutation;
  
    return [mutation, { isLoading, isError, data, error }] as const;
  };

  
export const useValidateVpa = (
    payload: ValidateVpaRequest,
  ) => {
    const mutation = useMutation<ValidateVpaResponse>(
      ['Wrapper', payload],
      async () => {
        const response = await Wrapper.ValidateVpa(payload);        
        if (response.error) {      
          useShowFlashMessage('warning', response.message);
        }
        return response.data;
      },
    );
  
    const { isLoading, isError, data, error } = mutation;
  
    return [mutation, { isLoading, isError, data, error }] as const;
  };
  
  
  export const useCreateMandateVpa = (
    payload: CreateMandateVpaRequest,
  ) => {
    const mutation = useMutation<CreateMandateVpaResponse>(
      ['Wrapper', payload],
      async () => {
        const response = await Wrapper.CreateMandateVpa(payload);
  
        if (response.error) {
          useShowFlashMessage('warning', response.message);
        }
        return response.data;
      },
    );
  
    const { isLoading, isError, data, error } = mutation;
  
    return [mutation, { isLoading, isError, data, error }] as const;
  };
  
  export const useGetVpaStaus = (
    payload,
  ) => {
    const mutation = useMutation<GetVpaStatusResponse>(
      ['Wrapper', payload],
      async () => {
        const response = await Wrapper.GetVpaStatus(payload);
  
        if (response.error) {
          useShowFlashMessage('warning', response.message);
        }
        return response.data;
      },
    );
  
    const { isLoading, isError, data, error } = mutation;
  
    return [mutation, { isLoading, isError, data, error }] as const;
  };

  export const useMerchantStatus = (
    payload: MerchantStatusRequest,
  ) => {
    const mutation = useMutation<MerchantStatusResponse>(
      ['Wrapper', payload],
      async () => {
        const response = await Wrapper.MerchantStatus(payload);
  
        if (response.error) {
          useShowFlashMessage('warning', response?.message ? response?.message : "Internal Servar Error");
        }
        return response.data;
      },
    );
  
    const { isLoading, isError, data, error } = mutation;
  
    return [mutation, { isLoading, isError, data, error }] as const;
  };

  export const useOneRupessMandate = (
    payload: OneRupessMandateRequest,
  ) => {
    const mutation = useMutation<OneRupessMandateResponse>(
      ['Wrapper', payload],
      async () => {
        const response = await Wrapper.OneRupessMandate(payload);
  
        if (response.error) {
          useShowFlashMessage('warning', response?.message ? response?.message : "Internal Servar Error");
        }
        return response.data;
      },
    );
  
    const { isLoading, isError, data, error } = mutation;
  
    return [mutation, { isLoading, isError, data, error }] as const;
  };