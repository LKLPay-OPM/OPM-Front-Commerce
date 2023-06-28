/* interceptor */
import { axiosRequestInterceptorWithCustomHeaders } from "$lib/repos/axios/interceptors/server-side/request";
import { axiosResponseInterceptorWithCustomHeaders } from "$lib/repos/axios/interceptors/server-side/response";

export function interceptor(client, token, refreshToken, cookies) {
  axiosRequestInterceptorWithCustomHeaders(client, {
    Authorization: `Bearer ${token}`,
    "X-Refresh-Token": refreshToken,
  });
  axiosResponseInterceptorWithCustomHeaders(client, token, refreshToken, cookies);
}
