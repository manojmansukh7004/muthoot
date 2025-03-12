import api from 'api/Axios/TwoWheelerBaseurl';
import serviceUrls from 'api/EndPoints/TwoWheeler';
import {ApiResponse} from '..';
import {
 VehicalType, 
 vechileTypeResponse,
 branchResponse,
 delarResponse,
 franchiseResponse,
 externalLeadResponse,
 manufactureResponse,
 modelResponse,
 subDelarResponse,
 getSchemeDetailsResponse,
 getAllSchemeDetailsResponse,
 getRoadtaxResponse,
 getTenureResponse,
 emiResponse,
 pliResponse,
 setDearshipDetailsResponse,
 getDearshipDetailsResponse,
 getLoanDetailsResponse,
 setLoanDetailsResponse,
 getInsuranceCapResponse,
 dedupeDetailsResponse,
 getDeliveryLetterResponse,
 GetRSAAmountYearResponse,
 getVerifyEmployeeResponse,
 getLeadBusinessVerticleResponse,
 getLeadSourceResponse
} from './types';

export const Vehical: VehicalType = {
  name: 'Vehical',

  GetVehicalType: async (payload): Promise<ApiResponse<vechileTypeResponse>> => {
  
    
    try {
      const response = await api.get(serviceUrls.GET_VEHICAL_TYPE+payload );
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

  GetFranchise: async (): Promise<ApiResponse<franchiseResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_FRANCSIES );
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

  GetManufacturer: async (): Promise<ApiResponse<manufactureResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_MANUFACTURE );
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

  GetModel: async (payload): Promise<ApiResponse<modelResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_MODEL + payload );
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

  GetDelar: async (id): Promise<ApiResponse<delarResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_DELAR + id );
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

  GetSubDelar: async (id): Promise<ApiResponse<subDelarResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_SUB_DELAR + id );
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

  GetBranch: async (id): Promise<ApiResponse<branchResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_ALL_BRANCH + id);
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
  GetSchemeDetails: async (payload): Promise<ApiResponse<getSchemeDetailsResponse>> => {
    try {
      const response = await api.post(serviceUrls.GET_SCHEME_DETAILS, payload );
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
  GetAllSchemeDetails: async (payload): Promise<ApiResponse<getAllSchemeDetailsResponse>> => {
    
    try {
      const response = await api.post(serviceUrls.GET_ALL_SCHEME_DETAILS , payload );
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
  GetRoadTax: async (id): Promise<ApiResponse<getRoadtaxResponse>> => {
    
    try {
      const response = await api.get(`${serviceUrls.GET_ROAD_TAX_DETAILS + id }`);
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
  GetTenure: async (id): Promise<ApiResponse<getTenureResponse>> => {

    try {
      const response = await api.get(`${serviceUrls.GET_TENURE + id }`);
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

  GetEMIValue: async (payload): Promise<ApiResponse<emiResponse>> => {
    
    try {
      const response = await api.post(serviceUrls.GET_EMI_VALUE, payload );
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

  GetPLIValue: async (payload): Promise<ApiResponse<pliResponse>> => {
    
    try {
      const response = await api.post( payload?.type == 'goDigit'? serviceUrls.GET_GODIGIT_VALUE: serviceUrls.GET_PLI_VALUE, payload );
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

  SetLoanDetails: async (payload): Promise<ApiResponse<setLoanDetailsResponse>> => {
    try {
      const response = await api.post(serviceUrls.SET_LOAN_DETAILS, payload );
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

  GetLoanDetails: async (payload): Promise<ApiResponse<getLoanDetailsResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_LOAN_DETAILS + payload );
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

   SetDearshipDetails: async (payload): Promise<ApiResponse<setDearshipDetailsResponse>> => {
    try {
      const response = await api.post(serviceUrls.SET_DELARSHIP_DETAILS, payload );
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

  GetDearshipDetails: async (payload): Promise<ApiResponse<getDearshipDetailsResponse>> => {
    
    try {
      const response = await api.get(serviceUrls.GET_DELARSHIP_DETAILS + payload );
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

  
  GetExternalLead: async (): Promise<ApiResponse<externalLeadResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_EXTERNALLEAD );
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
  

  GetInsuranceCap: async (payload): Promise<ApiResponse<getInsuranceCapResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_INSURANCE_CAP + payload );
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

  GetDedupeDetails: async (payload): Promise<ApiResponse<dedupeDetailsResponse>> => {
    try {
      const response = await api.post(serviceUrls.GET_DEDUPES_DETAILS, payload );
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

  GetDeliveryLetter: async (payload): Promise<ApiResponse<getDeliveryLetterResponse>> => {
    try {
      const response = await api.post(serviceUrls.GET_DELIVERY_LETTER, payload );
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

  GetRSAAmountYear: async (id): Promise<ApiResponse<GetRSAAmountYearResponse>> => {

    try {
      const response = await api.get(`${serviceUrls.GET_RSA_TENURE + id }`);
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
  
  GetLeadSource: async (payload): Promise<ApiResponse<getLeadSourceResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_LEAD_SOURCE + payload );
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

  GetLeadBusinessVerticle: async (payload): Promise<ApiResponse<getLeadBusinessVerticleResponse>> => {
    try {
      const response = await api.get(serviceUrls.GET_LEAD_BUSINESS_VERTICAL + payload );
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

  GetVerifyEmployee: async (payload): Promise<ApiResponse<getVerifyEmployeeResponse>> => {
    try {
      const response = await api.post(serviceUrls.GET_VERIFY_EMPLOYEE, payload );
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

