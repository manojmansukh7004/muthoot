import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import selectedBaseUrl from '.';
import serviceUrls from 'api/EndPoints/TwoWheeler';
import { showSessionExpiredPopup ,directlyLogout} from '../../components/SessionExpiredPopup';


const api: AxiosInstance = axios.create({
  baseURL: selectedBaseUrl.BaseUrl,
  timeout: 50000,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
// console.log("ttoooooo",token, await AsyncStorage.getItem('employeeId'));

    // if (config.url?.includes(serviceUrls.REGISTER_REPAYMENT_DETAILS) ||
    //   config.url?.includes(serviceUrls.GET_EMANDATE_BANKLIST) ||
    //   config.url?.includes(serviceUrls.GET_ESIGN_BANKLIST) ||
    //   config.url?.includes(serviceUrls.VALIDATE_VPA) ||
    //   config.url?.includes(serviceUrls.CREATE_MANDATE_VPA) ||
    //   config.url?.includes(serviceUrls.GET_VPA_STATUS) ||
    //   config.url?.includes(serviceUrls.ONE_RUPEES_MANDATE) ||
    //   config.url?.includes(serviceUrls.MERCHANTSTATUS)) {
    //   config.baseURL = selectedBaseUrl.CampsUrl;
    //   console.log("config.baseURL", config.baseURL);
    // }

    if (token) {
      config.headers['authentication-token'] = token;
    }

    config.headers['Content-Type'] = 'application/json';

    if (config.method?.toUpperCase() === 'POST') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL + '/' + config.url}`, config.data);
    } else {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL + '/' + config.url}`);
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor to log API responses
api.interceptors.response.use(
  async response => {
    // console.log(`API Responsejjj:`, response.headers['authentication-token']);

    const newToken = response.headers['authentication-token'];
    if (newToken) {
      await AsyncStorage.setItem('token', newToken);
    } 
    // else {
    //   // Show an error if the token is not present in the response headers
    //   console.error('Errorhh: authentication-token not received in response headers.');
    //   throw new Error('Authentication token is missing from the response headers.');
    // }

    return response;
  },
  error => {
    if (error.response) {
      console.log(`API Error Response mj:`, error);
      if (error.response.status === 401) {
        error.response.data.path === "/authdemograph/lead/versionCheck"?
        directlyLogout():
        showSessionExpiredPopup(); // Show the popup for session expired
      }

    } else {
      console.log('API Errornnn:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
