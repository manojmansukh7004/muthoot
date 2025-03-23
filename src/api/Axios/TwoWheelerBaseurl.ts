// import axios, { AxiosInstance } from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import selectedBaseUrl from '.';
// import serviceUrls from 'api/EndPoints/TwoWheeler';
// import { showSessionExpiredPopup ,directlyLogout} from '../../components/SessionExpiredPopup';
// import * as Keychain from 'react-native-keychain';

// // need to change manoj
// const api: AxiosInstance = axios.create({
//   baseURL: selectedBaseUrl.BaseUrl,
//   timeout: 50000,
// });
// const getSecureData = async () => {
//   const credentials = await Keychain.getGenericPassword();
//   console.log("credentials",credentials);

//   return credentials ? JSON.parse(credentials?.password) : null;
// };

// const saveSecureData = async (data: Record<string, string>) => {
//   await Keychain.setGenericPassword('secureData', JSON.stringify(data));
// };

// const updateToken = async (newToken: string) => {
//   const secureData = await getSecureData();

//   if (secureData) {
//     secureData.token = newToken; // Update only the token
//     await saveSecureData(secureData); // Save updated data
//   }
// };

// api.interceptors.request.use(
//   async config => {
//     // const token = await AsyncStorage.getItem('token');
//     const secureData = await getSecureData();
//     const token =  secureData?.token

//     if (token) {
//       config.headers['authentication-token'] = token;
//     }

//     config.headers['Content-Type'] = 'application/json';

//     if (config.method?.toUpperCase() === 'POST') {
//       console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL + '/' + config.url}`, config.data);
//     } else {
//       console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL + '/' + config.url}`);
//     }

//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

// // Interceptor to log API responses
// api.interceptors.response.use(
//   async response => {
//     // console.log(`API Responsejjj:`, response.headers['authentication-token']);

//     const newToken = response.headers['authentication-token'];
//     if (newToken) {
//       // await AsyncStorage.setItem('token', newToken);
//       // await Keychain.setGenericPassword('token', newToken);
//             await updateToken(newToken);

//     }
//     return response;
//   },
//   error => {
//     if (error.response) {
//       console.log(`API Error Response mj:`, error);
//       if (error.response.status === 401) {
//         error.response.data.path === "/authdemograph/lead/versionCheck"?
//         directlyLogout():
//         showSessionExpiredPopup(); // Show the popup for session expired
//       }

//     } else {
//       console.log('API Errornnn:', error);
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
import axios, {AxiosInstance} from 'axios';
import selectedBaseUrl from '.';
import serviceUrls from 'api/EndPoints/TwoWheeler';
import {
  showSessionExpiredPopup,
  directlyLogout,
} from '../../components/SessionExpiredPopup';
import * as Keychain from 'react-native-keychain';

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: selectedBaseUrl.BaseUrl,
  timeout: 50000,
});

// Function to retrieve secure data
export const getSecureData = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      // console.log('Raw Keychain Data:', credentials); // Debugging log
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
    // console.log('Updated Secure Data:', secureData);
  } catch (error) {
    console.error('Error updating token:', error);
  }
};

export const removeSecureData = async () => {
  await Keychain.resetGenericPassword();
};

 export const updateMasterLogin = async (newToken: string) => {
  try {
    let secureData = await getSecureData();
    
    if (!secureData) {
      secureData = {}; // Ensure secureData is an object and not null
    }

    secureData.ismasterLogin = newToken; // Update only the token

    await saveSecureData(secureData);
    // console.log('Updated Secure Data:', secureData);
  } catch (error) {
    console.error('Error updating token:', error);
  }
};

export const updateIsNachReactivation = async (newToken: string) => {
  try {
    let secureData = await getSecureData();
    
    if (!secureData) {
      secureData = {}; // Ensure secureData is an object and not null
    }

    secureData.isNachReactivation = newToken; // Update only the token

    await saveSecureData(secureData);
    // console.log('Updated Secure Data:', secureData);
  } catch (error) {
    console.error('Error updating token:', error);
  }
};

// Axios request interceptor
api.interceptors.request.use(
  async config => {
    const secureData = await getSecureData();
    const token = 
    secureData?.token;
// 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6Ijk3OGU5NTFiMmVmMGVmZDY0ZjJhYjI1ZjFiNTIxZGI4LjJyaUMyVGE0ZXFOcjNMZWUwSFFpUGc9PSIsInN1YiI6IjA3ZGI1N2E0NzgyMDM0ZDk3YWJkOWYxOWE4NTdhYTljLm9jSG9TemNSYmdDcFRyM01xZzF1S2c9PSIsImJ1c2luZXNzU291cmNpbmciOiJkNDU5ODdiMWI3ZmQzM2ZiMDA2NDA4OTE5ZTVjMjFlMi5hTUNiSHhId0lMQzFZdy1YdElXeTJRPT0iLCJzZXNzaW9uS2V5IjoiZmYwYTFlNmUtY2ViNi00NmU2LTgzMjctNjgwMTY1ZTk1NzA3IiwiaXNzIjoiYWZ4LWFydGhtYXRlIiwidXNlck5hbWUiOiI4MjNiOWQ3Y2FiMDJiNjZmMmViOGM4NjA5MzQyZDI1My55YW1ONmo3TjhiaHRVU2NzbEtselVBPT0iLCJ1c2VySWQiOiJiM2YwNGJhZGY3ODM5OWZhOGM3YTg2NjRmMTRjYmQ4MC51SXdGT042YVlvaWxoaWUweWVOUWpnPT0iLCJicmFuY2giOiI5NTNlZmYwMDcxNTkwZWViNDgxMGM2YTkxNjhjYjFlNS5RSHhac1p2X0VYVXdDc3lVcDc1akZRPT0iLCJsMU1hbmFnZXJFbXBseWVlQ29kZSI6IjJjODUwYmZiNTZjNDc2ZTY1OTNkNGJhMTY4ZjJmYjYzLnYzcnI3dEVUY3RWbm82dVFsbnNHRHc9PSIsInJvbGVDb2RlIjoiOGNiODdlNjk3NDJjZjgyMjlhNDg2NmRhMmEzOTkwNTEuTGlqSmxhVDdWR1FhaTJRQUxfSUk1UT09IiwiZnJhbmNoaXNlSWQiOiJmOGNiZDI4MzY2NDk3ZDc2ZTI4MWViY2E3ZGRhYWQzZS41T0F3MmU3ZjFhSjB5SkJ1ZlhwMzZnPT0iLCJleHAiOjE3NDI3MjgyNjAsInJvbGVEZXNjcmlwdGlvbiI6IjkxMTUxZWFjN2ViMTZiOWI2MTc2MzcyMDNlMDZmYWMwLjE0VTBha0VWV3dVRUMxYTZqaVpKWWc9PSIsImlhdCI6MTc0MjcyNzY2MCwiZnJhbmNoaXNlTmFtZSI6IjRhN2NkMTJiZjkyOWQwOTAwYjMwZTYyYTA4NWYzYzhlLnl3Mks0WnNGX0JFbWVTMkhKV0hnZkE9PSJ9.VG2Tr9w6M2rSTV_iHh4p6b81TssjU6SAgHhhtrCQgrLSc85ofCdWnxm4LoMvj-lT-3WvXFZxuqdQfMjpX5VV1w'

    if (token) {
      config.headers['authentication-token'] = token;
    }

    config.headers['Content-Type'] = 'application/json';

    console.log(
      `API Request: ${config.method?.toUpperCase()} ${
        config.baseURL + '/' + config.url
      }`,
      config.method?.toUpperCase() === 'POST' ? config.data : '',
    );

    return config;
  },
  error => Promise.reject(error),
);

// Axios response interceptor
api.interceptors.response.use(
  async response => {
    console.log('reeee', response.data);

    if (response.config.url === 'authdemograph/auth/login') {
      await saveSecureData({
        employeeId: response.data.employeeId,
        employeeName: response.data.employeeName,
        roleDescription: response.data.roleDescription,
        token: response.headers['authentication-token'],
        ismasterLogin: 'false',
        isNachReactivation: 'false'
      
      });
    } 
    else {
      console.log("kkkkkkkkkk",response.headers['authentication-token']);
      const newToken = response.headers['authentication-token'];
      if (newToken) {
        await updateToken(newToken); // Update only the token
      }
    }

    return response;
  },
  error => {
    if (error.response) {
      console.error('API Error Response:', error);
      if (error.response.status === 401) {
        error.response.data.path === '/authdemograph/lead/versionCheck'
          ? directlyLogout()
          : showSessionExpiredPopup();
      }
    } else {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  },
);

export default api;
