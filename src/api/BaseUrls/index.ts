type UrlTypes = {
  BaseUrl: string;
  PlBaseUrl: string;
  Url: string;
  CampsUrl: string;
  PlCampsUrl: string;
};

type BaseUrlsType = {
  // UAT: UrlTypes;
  // SIT: UrlTypes;
  MUTHOOT_UAT: UrlTypes;
  MUTHOOT_PROD: UrlTypes;
  MUTHOOT_DR: UrlTypes;

};

// const SIT: UrlTypes = {
//   BaseUrl: 'http://13.126.17.80:9061',
//   CampsUrl: 'http://13.126.17.80:9007',
//   Url: 'http://13.126.17.80',
// };

// const UAT: UrlTypes = {
//   BaseUrl: 'http://15.206.141.156:9061',
//   CampsUrl: 'http://15.206.141.156:9007',
//   Url: 'http://15.206.141.156',
// };


const MUTHOOT_UAT: UrlTypes = {
  BaseUrl: 'https://uatapi.muthootcap.com:9061',
  CampsUrl: 'https://uatapi.muthootcap.com:9007',
  PlBaseUrl: 'https://uatapi1.muthootcap.com:10061',
  PlCampsUrl: 'https://uatapi1.muthootcap.com:10007',
  Url: 'https://uatapi.muthootcap.com:7070',
};

const MUTHOOT_PROD: UrlTypes = {
  BaseUrl: 'https://api-rise.muthootcap.com:9061',
  CampsUrl: 'https://api-rise.muthootcap.com:9007',
  PlBaseUrl: 'https://api-rise1.muthootcap.com:10061',
  PlCampsUrl: 'https://api-rise1.muthootcap.com:10007',
  Url: 'https://api-rise.muthootcap.com:7070',
};

const MUTHOOT_DR: UrlTypes = {
  BaseUrl: 'https://dr-api-rise.muthootcap.com:9061',
  CampsUrl: 'https://dr-api-rise.muthootcap.com:9007',
  PlBaseUrl: 'https://dr-api-rise1.muthootcap.com:10061',
  PlCampsUrl: 'https://dr-api-rise1.muthootcap.com:10007',
  Url: 'https://dr-api-rise.muthootcap.com:7070',
};

const BaseUrls: BaseUrlsType = {
  // UAT,
  // SIT,
  MUTHOOT_UAT,
  MUTHOOT_PROD,
  MUTHOOT_DR
};

export default BaseUrls;