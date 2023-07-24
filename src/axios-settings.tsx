import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const timeout = 10000;

const Axios = axios.create({
  baseURL: '',
  timeout,
  withCredentials: true,
});
const interceptorResponse = (response: AxiosResponse) => {
  if (response?.data?.code !== 0) {
    return Promise.reject({
      msg: response?.data?.msg || 'Api failed',
      code: response?.data?.code,
    });
  }

  if (response?.data) {
    return response.data;
  }

  return Promise.reject({
    msg: 'Api failed',
    code: 999,
  });
};

const interceptorResponseError = (error: AxiosError) => {
  if (!window.navigator.onLine) {
    return Promise.reject({ msg: error });
  }
  if (error.response && error.response.status === 401) {
    return Promise.reject({ msg: error, code: error.response.status });
  }

  return Promise.reject({ msg: error, code: 999 });
};

const interceptorRequest = (config: AxiosRequestConfig) => {
  // Do something before request is sent
  if (!window.navigator.onLine) {
    return;
  }
  return config;
};

Axios.interceptors.response.use(interceptorResponse, interceptorResponseError);
Axios.interceptors.request.use(interceptorRequest, undefined);

export default Axios;
