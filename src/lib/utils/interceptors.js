/* interceptor */
import { axiosRequestInterceptorWithCustomHeaders } from "$lib/repos/axios/interceptors/request";
import { axiosResponseInterceptorWithCustomHeaders } from "$lib/repos/axios/interceptors/response";
/* svelte */
import { sessionUser } from "$lib/stores";
import { get } from "svelte/store";

export function interceptor(client) {
  const session = get(sessionUser);
  console.log(session);
  axiosRequestInterceptorWithCustomHeaders(client, {
    Authorization: `Bearer ${session.token}`,
    "X-Refresh-Token": session.refreshToken,
  });
  axiosResponseInterceptorWithCustomHeaders(client, session.token, session.refreshToken);
}