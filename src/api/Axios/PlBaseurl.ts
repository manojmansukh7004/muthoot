import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import selectedBaseUrl from '.';
import plServiceUrls from 'api/EndPoints/PL';
import { showSessionExpiredPopup ,directlyLogout} from '../../components/SessionExpiredPopup';

const api: AxiosInstance = axios.create({
    baseURL: selectedBaseUrl.PlBaseUrl,
    timeout: 5000,
});

api.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token');

        // Check if the request URL includes specific endpoints and change the baseURL accordingly
        // if (config.url?.includes(plServiceUrls.REGISTER_REPAYMENT_DETAILS) || 
        //     config.url?.includes(plServiceUrls.GET_EMANDATE_BANKLIST) || 
        //     config.url?.includes(plServiceUrls.GET_ESIGN_BANKLIST)) {
        //     config.baseURL = selectedBaseUrl.PlCampsUrl;
        //     console.log("Updated config.baseURL to:", config.baseURL);
        // }

        // If token exists, set it in the headers
        if (token) {
            config.headers['authentication-token'] = token;
        }

        config.headers['Content-Type'] = 'application/json';

        // Log the request details
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

// Interceptor to log API responses and handle the token
api.interceptors.response.use(
    async response => {
        // console.log(`API Response:`, response.headers['authentication-token']);

        // Check if the token is present in the response headers
        const newToken = response.headers['authentication-token'];
        if (newToken) {
            await AsyncStorage.setItem('token', newToken);
        } 
        // else {
        //     // Show an error if the token is not present
        //     console.error('Error: authentication-token not received in response headers.');
        //     throw new Error('Authentication token is missing from the response headers.');
        // }

        return response;
    },
    error => {
        if (error.response) {
            console.log(`API Error Response:`, error.response);
            if (error.response.status === 401) {
                error.response.data.path === "/authdemograph/lead/versionCheck"?
                directlyLogout():
                showSessionExpiredPopup(); // Show the popup for session expired
              }
        } else {
            console.log('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
