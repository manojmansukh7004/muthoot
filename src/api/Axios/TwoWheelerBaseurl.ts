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
// 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJicmFuY2hJZCI6ImEyYTM2NjU3YjcwMTcwYjNlNDc1NzZiOWEyZjYyYTFjLkI2bkpmUlE3Tl94NzhnS2NGLUJHNVE9PSIsInN1YiI6ImU3NWQ0NmYzODA4OWJmOWQyNDVhODExNTJlMDY4NDg1LkZGTnhFLTc1bFBUZllHXzNScmlES2c9PSIsImJ1c2luZXNzU291cmNpbmciOiIxNzQ2NmE4N2I3NGQ4YjU1MGU4NDZmMDg4NGM3MWRhOS5wUVBsSXY3dmlHeUVFZGdRMTFOM3B3PT0iLCJzZXNzaW9uS2V5IjoiODNlZGY1Y2MtNTBlMC00ZmRjLTk2ODQtZjE1MGEyMGFlN2I5IiwiaXNzIjoiYWZ4LWFydGhtYXRlIiwidXNlck5hbWUiOiJkZDY2Mjk3ZTE3ZjJlMGJjY2NkN2ZmMDU1OWYxZDVmMy5reHZTUV9xMUlMTnBwS0w3Q3BZVWNnPT0iLCJ1c2VySWQiOiJmZDdmZjNmZmI5ZjllM2ZkOTkwNTU0ZGEzZTYwNjFkMC5HM3o4TUtFS3RlcWd1RE9BLTJ0MThnPT0iLCJicmFuY2giOiI0ODZhMWNjNTI5NGZiZTkwYjE4NGM2MGU5Njc5MGQ3YS5fZU14cFl5bWcwUHE3d2Jxd1Vzb29RPT0iLCJsMU1hbmFnZXJFbXBseWVlQ29kZSI6IjE0YjI0YjMxY2RlNWJmYWI5OWY3MmY5YzE1NDQxNzcyLjMtTC1wMzNUeFdqeGgyR2M5M3l3U1E9PSIsInJvbGVDb2RlIjoiNjU0ZmU2YTk1MDIzYjg0NWU1NDU5YTNkYjI4MmRhOGIubTJPNEsyYUd6WkVScFotc2ExZ1g0dz09IiwiZnJhbmNoaXNlSWQiOiI3MGRlNjhhN2Y0MGRiMDRmMDZhMTIyMzkxYjVkZDI0NS4xTUF3OTFUX19oWG1vSFhCbjlYVzJRPT0iLCJleHAiOjE3NDI2NjcwNjEsInJvbGVEZXNjcmlwdGlvbiI6IjFlYWYyNWVhNGMyYzhiZTlmOThlNTI5NjdiNGY2NGFhLmw4NGFGWkgyMmpvRTJZRGVzRjhuMWc9PSIsImlhdCI6MTc0MjY2NjQ2MSwiZnJhbmNoaXNlTmFtZSI6ImFmYzU4ODAzMWFkNGI3OWQyNmY1YzUyZWM2OTk3NDA0LkhON0U2eDIwdGNfZUxhV1R4Z2hNOUE9PSJ9.sxmRO3-pUG2l1rNSjGDcz3ADwjNsYEa-6bTvrv20fJAZP46cDr3PY3tnXmO3COWyBzUQ-xmWgt5ErNBncrSPfQ'
    secureData?.token;

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
