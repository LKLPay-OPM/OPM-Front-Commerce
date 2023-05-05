import jwtDecode from "jwt-decode";
/* client */
import { refreshTokenClient } from "$lib/repos/axios/clients/refresh-client";
/* store */
import { get } from "svelte/store";
import { sessionUser, isLoggedIn, loggedInUser } from "$lib/stores";

async function refreshToken() {
  try {
    const session = get(sessionUser);
    console.log(session);
    const token = session?.token;
    const refresh = session?.refreshToken;
    const { data } = await refreshTokenClient.post("auth/commerce/refresh-token", undefined, {
      headers: { Authorization: `Bearer ${token}`, "X-Refresh-Token": refresh },
    });

    if (!data?.response) throw new Error("Request Failed");
    if (!data.response?.token) throw new Error("Token not receiveed");

    const user = jwtDecode(data.response.token);
    return { session: data.response, user };
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
}

/**
 * @param {import("axios").AxiosInstance} axiosInstance
 */
export function axiosResponseInterceptor(axiosInstance) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
        // check if the request is the token refresh request
        const { session, user } = await refreshToken();
        isLoggedIn.set(true);
        loggedInUser.set(user);
        sessionUser.set(session);
        const token = session.token;
        const refresh = session.refreshToken;
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
