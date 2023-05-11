import axios from 'axios';
import StorageManager from '../storage/StorageManager';
import {API_TOKEN, COOKIE} from '../storage/StorageKeys';
import {baseUrl} from '../Constants';

const req = async (config, isTokenNeeded = true, customHeaders) => {
  var headers = {
    'Content-Type': 'application/json',
  };
  var authToken = null;
  let cookie = null;
  if (customHeaders) {
    headers = customHeaders;
  }
  if (isTokenNeeded) {
    authToken = await StorageManager.get(API_TOKEN);
    headers = {...headers, Authorization: `Bearer ${authToken}`};
  }
  const client = axios.create({
    baseURL: baseUrl,
    headers: headers,
    withCredentials: true,
  });

  // client.interceptors.request.use(async config => {
  //   cookie = await StorageManager.get(COOKIE);
  //   if (cookie) {
  //     config.headers.Cookie = cookie;
  //   }
  //   return config;
  // });

  const onSuccess = data => {
    //console.log(data.headers);
    return data.data;
  };

  const onFailure = error => {
    console.debug(config.url + ' ' + error);
    return Promise.reject(error);
  };

  return client(config).then(onSuccess).catch(onFailure);
};

export default req;
