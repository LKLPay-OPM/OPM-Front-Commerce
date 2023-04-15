/* environment */
import { PUBLIC_DEVICES_ENDPOINT, PUBLIC_PROFILES_ENDPOINT, PUBLIC_TRANSACTIONS_ENDPOINT } from "$env/static/public";
/* store */
import { sessionUser } from "$lib/stores";
/* client */
import axios from "axios";

const axiosClient = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: PUBLIC_DEVICES_ENDPOINT,
  withCredentials: true,
});
const axiosFormDataClient = axios.create({
  headers: { "Content-Type": "multipart/form-data" },
  baseURL: PUBLIC_DEVICES_ENDPOINT,
  withCredentials: true,
});
const profilesFormDataClient = axios.create({
  headers: { "Content-Type": "multipart/form-data" },
  baseURL: PUBLIC_PROFILES_ENDPOINT,
  withCredentials: true,
});
const profilesClient = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: PUBLIC_PROFILES_ENDPOINT,
  withCredentials: true,
});
const axiosTransactionsClient = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: PUBLIC_TRANSACTIONS_ENDPOINT,
  withCredentials: true,
});

const refreshTokenClient = axios.create({
  headers: { "Content-Type": "application/json" },
  baseURL: PUBLIC_PROFILES_ENDPOINT,
  withCredentials: true,
});

async function refreshToken() {
  const response = await refreshTokenClient.post("/auth/commerce/refresh-token");
  const sessionData = response.data;
  return sessionData;
}

let isRefreshing = false;

async function errorInterceptor(error) {
  const originalRequest = error.config;
  if ([401, 403].includes(error.response?.status) && !originalRequest._retry) {
    if (isRefreshing) {
      try {
        return profilesClient(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    originalRequest._retry = true;
    isRefreshing = true;
    try {
      const session = await refreshToken();
      sessionUser.set(session);
      return profilesClient(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
  return Promise.reject(error);
}

const axiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

class AppClient {
  /**
   * @param {import('axios').AxiosInstance} axiosInstance
   */
  constructor(axiosInstance) {
    this.client = axiosInstance;
    /* interceptores */
    this.client.interceptors.response.use((response) => response, errorInterceptor);
  }

  profiles() {
    this.client.defaults.baseURL = PUBLIC_PROFILES_ENDPOINT;
    return this.client;
  }

  transactions() {
    this.client.defaults.baseURL = PUBLIC_TRANSACTIONS_ENDPOINT;
    return this.client;
  }
}

export const appClient = new AppClient(axiosInstance);

axiosClient.interceptors.response.use((response) => response, errorInterceptor);
axiosFormDataClient.interceptors.response.use((response) => response, errorInterceptor);
profilesFormDataClient.interceptors.response.use((response) => response, errorInterceptor);
profilesClient.interceptors.response.use((response) => response, errorInterceptor);
axiosTransactionsClient.interceptors.response.use((response) => response, errorInterceptor);

export { axiosClient, axiosFormDataClient, profilesFormDataClient, profilesClient, axiosTransactionsClient };
