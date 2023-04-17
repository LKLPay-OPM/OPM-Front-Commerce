/* environment */
import { PUBLIC_DEVICES_ENDPOINT, PUBLIC_PROFILES_ENDPOINT, PUBLIC_TRANSACTIONS_ENDPOINT } from "$env/static/public";
/* client */
import axios from "axios";
/* decode */
import jwtDecode from "jwt-decode";
/* store */
import { sessionUser, isLoggedIn, loggedInUser } from "$lib/stores";
/* constants */
import { axiosDefaultsClientFormData, axiosDefaultsClientJson } from "$lib/constants/axios";
import { axiosWithAuth } from "$lib/utils/axios";

axios.defaults.withCredentials = true;

const axiosClient = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_DEVICES_ENDPOINT,
});
const axiosFormDataClient = axios.create({
  ...axiosDefaultsClientFormData,
  baseURL: PUBLIC_DEVICES_ENDPOINT,
});
const profilesFormDataClient = axios.create({
  ...axiosDefaultsClientFormData,
  baseURL: PUBLIC_PROFILES_ENDPOINT,
});
const profilesClient = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_PROFILES_ENDPOINT,
});
const axiosTransactionsClient = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_TRANSACTIONS_ENDPOINT,
});
const refreshTokenClient = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_PROFILES_ENDPOINT,
});

let isRefreshing = false;

async function refreshToken() {
  try {
    axiosWithAuth(refreshTokenClient);
    const { data } = await refreshTokenClient.post("auth/commerce/refresh-token");

    if (!data?.response) throw new Error("Request Failed");
    if (!data.response?.token) throw new Error("Token not receiveed");

    const user = jwtDecode(data.response.token);
    return { session: data.response, user };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

async function errorInterceptor(error, axiosInstance) {
  const originalRequest = error.config;
  if ([401, 403].includes(error.response?.status) && !originalRequest._retry) {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return axiosInstance(originalRequest);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    }
    originalRequest._retry = true;
    isRefreshing = true;
    try {
      const { session, user } = await refreshToken();
      isLoggedIn.update(() => true);
      loggedInUser.set(user);
      sessionUser.set(session);
      processQueue(null, session);
      return axiosInstance(originalRequest);
    } catch (error) {
      processQueue(error, null);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
  return Promise.reject(error);
}

let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

/* interceptors */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => errorInterceptor(error, axiosClient)
);
axiosFormDataClient.interceptors.response.use(
  (response) => response,
  (error) => errorInterceptor(error, axiosFormDataClient)
);
profilesFormDataClient.interceptors.response.use(
  (response) => response,
  (error) => errorInterceptor(error, profilesFormDataClient)
);
profilesClient.interceptors.response.use(
  (response) => response,
  (error) => errorInterceptor(error, profilesClient)
);
axiosTransactionsClient.interceptors.response.use(
  (response) => response,
  (error) => errorInterceptor(error, axiosTransactionsClient)
);

/* exports after assigning interceptors */
export { axiosClient, axiosFormDataClient, profilesFormDataClient, profilesClient, axiosTransactionsClient };
