import axios, {AxiosInstance} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import selectedBaseUrl from '.';
import {
  showSessionExpiredPopup,
  directlyLogout,
} from '../../components/SessionExpiredPopup';
import * as Keychain from 'react-native-keychain';

const api: AxiosInstance = axios.create({
  baseURL: selectedBaseUrl.PlBaseUrl,
  timeout: 5000,
});

const getSecureData = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log('Raw Keychain Data:', credentials); // Debugging log
      return JSON.parse(credentials.password);
    }
  } catch (error) {
    console.error('Error retrieving secure data:', error);
  }
  return null;
};

// Function to save secure data
const saveSecureData = async (data: Record<string, string>) => {
  try {
    await Keychain.setGenericPassword('secureData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving secure data:', error);
  }
};


// Function to update only the token while keeping other data unchanged
const updateToken = async (newToken: string) => {
  try {
    let secureData = await getSecureData();
    
    if (!secureData) {
      secureData = {}; // Ensure secureData is an object and not null
    }

    secureData.token = newToken; // Update only the token

    await saveSecureData(secureData);
    console.log('Updated Secure Data:', secureData);
  } catch (error) {
    console.error('Error updating token:', error);
  }
};

api.interceptors.request.use(
  async config => {
    // const token = await AsyncStorage.getItem('token');
    const secureData = await getSecureData();
    const token =  secureData.token
    // await secureData.token;
    console.log('tttttttttt', secureData.token);

    if (token) {
      config.headers['authentication-token'] = token;
    }

    config.headers['Content-Type'] = 'application/json';

    // Log the request details
    if (config.method?.toUpperCase() === 'POST') {
      console.log(
        `API Request: ${config.method?.toUpperCase()} ${
          config.baseURL + '/' + config.url
        }`,
        config.data,
      );
    } else {
      console.log(
        `API Request: ${config.method?.toUpperCase()} ${
          config.baseURL + '/' + config.url
        }`,
      );
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Interceptor to log API responses and handle the token
api.interceptors.response.use(
  async response => {
    // console.log(`API Response:`, response.headers['authentication-token']);

    // Check if the token is present in the response headers
    const newToken = response.headers['authentication-token'];
    if (newToken) {
    //   await Keychain.setGenericPassword('token', newToken);
      await updateToken(newToken);

     
      // await AsyncStorage.setItem('token', newToken);
    }

    return response;
  },
  error => {
    if (error.response) {
      console.log(`API Error Response:`, error.response);
      if (error.response.status === 401) {
        error.response.data.path === '/authdemograph/lead/versionCheck'
          ? directlyLogout()
          : showSessionExpiredPopup(); // Show the popup for session expired
      }
    } else {
      console.log('API Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
