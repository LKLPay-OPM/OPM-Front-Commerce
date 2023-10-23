import jwtDecode from "jwt-decode";
/* client */
import { refreshTokenClient } from "$lib/repos/axios/clients/refresh-client";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";
/* stores */
import { isLoggedIn, loggedInUser, sessionUser } from "$lib/stores";
/* utils */
import { setCookie } from "$lib/utils/cookie";

async function refreshTokenWithCustomHeaders(token, refresh) {
  try {
    const { data } = await refreshTokenClient.post("auth/commerce/refresh-token", undefined, {
      headers: { Authorization: `Bearer ${token}`, "X-Refresh-Token": refresh },
    });

    if (!data?.response) throw new Error("Request Failed");
    if (!data.response?.token) throw new Error("Token not receiveed");

    const user = jwtDecode(data.response.token);
    return { session: data.response, user };
  } catch (error) {
    await appErrorResponseHandler(error);
    throw error;
  }
}

/**
 * @param {import("axios").AxiosInstance} axiosInstance
 */
export function axiosResponseInterceptorWithCustomHeaders(axiosInstance, token, refresh, cookies) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
        // check if the request is the token refresh request
        const { session, user } = await refreshTokenWithCustomHeaders(token, refresh);
        // setCookie(cookies, "token", session.token);
        // setCookie(cookies, "refreshToken", session.refreshToken);
        isLoggedIn.set(true);
        loggedInUser.set(user);
        sessionUser.set(session);
        const config = {
          ...originalRequest,
          headers: { Authorization: `Bearer ${token}`, "X-Refresh-Token": refresh },
        };
        return axiosInstance(config);
      }

      return Promise.reject(error);
    }
  );
}
