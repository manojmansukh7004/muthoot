import {useMutation} from 'react-query';
import {KFS} from './api';
import {
  GenerateKFSResponse,
  GetKFSResponse,
  SendOTPForKFSResponse,
  VerifyOTPKFSRequest,
  callLegalityResponse,
} from './types';
import useShowFlashMessage from 'hooks/useShowFlashMessage';

export const useGenerateKFS = (appId: string) => {
  const mutation = useMutation<GenerateKFSResponse>(
    ['KFS', appId],
    async () => {
      const response = await KFS.GenerateKFS(appId);
      if (response.error) {
        useShowFlashMessage('warning', response.message);
      }
      return response.data;
    },
  );

  const {isLoading, isError, data, error} = mutation;

  return [mutation, {isLoading, isError, data, error}] as const;
};

export const useSendOTPKFS = (
  applicantId: string,
  employeeId: string,
  otpmode: 'F' | 'R',
) => {
  const mutation = useMutation<SendOTPForKFSResponse>(
    ['KFS', applicantId, employeeId, otpmode],
    async () => {
      const response = await KFS.SendOTPForKFS(
        applicantId,
        employeeId,
        otpmode,
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

export const useCallLegality = (id:string) => {
  const mutation = useMutation<callLegalityResponse>(
    ['KFS', id],
    async () => {
      const response = await KFS.CallLegality(id);
      if (response.error) {
        useShowFlashMessage('warning', response.message);
      }
      return response.data;
    },
  );

  const {isLoading, isError, data, error} = mutation;
  return [mutation, {isLoading, isError, data, error}] as const;
};

export const useGetKFS = (appId: string) => {
  const mutation = useMutation<GetKFSResponse>(
    ['KFS', appId],
    async () => {
      const response = await KFS.GetKFS(appId);
      // if (response.error) {
      //   useShowFlashMessage('warning', response.message);
      // }
      return response.data;
    },
  );

  const {isLoading, isError, data, error} = mutation;

  return [mutation, {isLoading, isError, data, error}] as const;
};
