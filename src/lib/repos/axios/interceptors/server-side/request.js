/**
 * @param {import("axios").AxiosInstance} axiosInstance
 */
export function axiosRequestInterceptorWithCustomHeaders(axiosInstance, headers) {
  axiosInstance.interceptors.request.use((config) => {
    config.headers = { ...config.headers, ...headers };
    return config;
  });
}
