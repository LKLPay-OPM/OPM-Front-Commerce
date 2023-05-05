/* store */
import { get } from "svelte/store";
import { sessionUser } from "$lib/stores";

/**
 * @param {import("axios").AxiosInstance} axiosInstance
 */
export function axiosRequestInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use((config) => {
    const session = get(sessionUser);
    const token = session?.token;
    const refreshToken = session?.refreshToken;

    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (refreshToken) config.headers["X-Refresh-Token"] = refreshToken;

    return config;
  });
}

/**
 * @param {import("axios").AxiosInstance} axiosInstance
 */
export function axiosRequestInterceptorWithCustomHeaders(axiosInstance, headers) {
  axiosInstance.interceptors.request.use((config) => {
    config.headers = { ...config.headers, ...headers };
    return config;
  });
}
