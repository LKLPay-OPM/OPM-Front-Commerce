import { get } from "svelte/store";
import { sessionUser } from "$lib/stores";

/** @param {import('axios').AxiosInstance} axiosInstance */
export function axiosWithAuth(axiosInstance) {
  const token = get(sessionUser)?.token;
  const refreshToken = get(sessionUser)?.refreshToken;

  return axiosInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["X-Refresh-Token"] = refreshToken;
    }
    return config;
  });
}
