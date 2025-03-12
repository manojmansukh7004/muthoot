import api from 'api/Axios/PlBaseurl';
import plServiceUrls from 'api/EndPoints/PL';
import { ApiResponse } from '..';
import {
  GetLeadResponse,
  LeadType,
  SaveorUpdateLeadResponse,
  ViewLeadsResponse,
  SaveImageResponse,
  ViewProspectResponse,
  GetCustomerProfileResponse,
  GetPincodeResponse,
  GetSanctionLetterDetailsResponse,
  ViewStatusResponse,
  GetApplicantDetailsByAadharResponse,
  GetBranchesResponse,
  GetCustomerTypeResponse,
  salesRejectedResponse,
  salesReEdidResponse,
  GetPreApprovedOfferResponse,
  GetPlCountResponse,
  GetRefrenceResponse
} from './types';

export const Lead: LeadType = {
  name: 'Lead',

  SaveImage: async (payload): Promise<ApiResponse<SaveImageResponse>> => {
    try {
      const response = await api.post(plServiceUrls.SAVE_IMAGE, payload);
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

  ViewLeads: async (
    employeeId,
    search,
  ): Promise<ApiResponse<ViewLeadsResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.VIEW_LEADS + `empId=${employeeId}&search=${search}`,
      );
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
  ViewProspects: async (
    employeeId,
    search,
  ): Promise<ApiResponse<ViewProspectResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.VIEW_PROSPECT + `empId=${employeeId}&search=${search}`,
      );
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
  SaveorUpdateLead: async (
    payload,
  ): Promise<ApiResponse<SaveorUpdateLeadResponse>> => {
    try {
      const response = await api.post(plServiceUrls.SAVE_OR_UPDATE_LEAD, payload);
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
  GetLead: async (id): Promise<ApiResponse<GetLeadResponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_LEAD + id);
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
  GetCustomerProfile: async (id): Promise<
    ApiResponse<GetCustomerProfileResponse>
  > => {
    try {
      const response = await api.get(plServiceUrls.GET_CUSTOMER_PROFILE + id);
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
  GetPincode: async (pincode): Promise<ApiResponse<GetPincodeResponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_PINCODE + pincode);
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
  Delete: async (removeString): Promise<ApiResponse<GetPincodeResponse>> => {
    try {
      const response = await api.post(plServiceUrls.REMOVE + removeString);
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
  GetSanctionLetterDetails: async (
    id,
  ): Promise<ApiResponse<GetSanctionLetterDetailsResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.GET_SANCTION_LETTER_DETAILS + id,
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
  ViewStatus: async (id): Promise<ApiResponse<ViewStatusResponse>> => {
    try {
      const response = await api.post(plServiceUrls.VIEW_STATUS + id);
      //    console.log('API Success:', JSON.stringify(response.data));
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
  GetApplicantDetailsByAadhar: async (
    payload,
  ): Promise<ApiResponse<GetApplicantDetailsByAadharResponse>> => {
    try {
      const response = await api.post(
        plServiceUrls.GET_APPLICANT_DETAILS_BY_AADHAR,
        payload,
      );
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

  GetBranches: async (
    employeeId,
  ): Promise<ApiResponse<GetBranchesResponse>> => {
    try {
      const response = await api.get(
        plServiceUrls.GET_BRANCHES + `?employeeId=${employeeId}`,
      );
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

  GetCustomerType: async (): Promise<ApiResponse<GetCustomerTypeResponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_CUSTOMER_TYPE);
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

  salesReject: async (
    payload,
  ): Promise<ApiResponse<salesRejectedResponse>> => {
    try {
      const response = await api.post(
        plServiceUrls.SALES_REJECT,
        payload,
      );
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

  salesReEdit: async (
    payload,
  ): Promise<ApiResponse<salesReEdidResponse>> => {
    try {
      const response = await api.post(
        plServiceUrls.SALES_REEDIT,
        payload,
      );
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
  GetPreApprovedOffer: async (
    payload,
  ): Promise<ApiResponse<GetPreApprovedOfferResponse>> => {
    try {
      const response = await api.post(
        plServiceUrls.GET_PREOFFER,
        payload,
      );
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

  GetPlCount: async (id): Promise<ApiResponse<GetPlCountResponse>> => {
    try {
      const response = await api.get(plServiceUrls.GET_PL_COUNT+ id);
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
  GetRefrence: async (id): Promise<
  ApiResponse<GetRefrenceResponse>
> => {
  try {
    const response = await api.get(plServiceUrls.GET_REFRENCE + id);
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
