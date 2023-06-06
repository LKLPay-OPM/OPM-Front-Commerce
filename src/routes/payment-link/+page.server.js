/* svelte */
import { error } from "@sveltejs/kit";
/* interceptor */
import { axiosRequestInterceptorWithCustomHeaders } from "$lib/repos/axios/interceptors/request";
import { axiosResponseInterceptorWithCustomHeaders } from "$lib/repos/axios/interceptors/response";
/* endpoints */
import { axiosFraudPreventionManagement, profilesClient } from "$lib/repos/axios/clients/api-clients";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

export const ssr = false;

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const token = formData.get("token");
    const refreshToken = formData.get("refreshToken");
    formData.delete("token");
    formData.delete("refreshToken");
    let response;
    try {
      axiosRequestInterceptorWithCustomHeaders(axiosFraudPreventionManagement, {
        Authorization: `Bearer ${token}`,
        "X-Refresh-Token": refreshToken,
      });
      axiosRequestInterceptorWithCustomHeaders(profilesClient, {
        Authorization: `Bearer ${token}`,
        "X-Refresh-Token": refreshToken,
      });
      axiosResponseInterceptorWithCustomHeaders(profilesClient, token, refreshToken);
      const user = await profilesClient.get(`/user/profile`);
      formData.append("commerceName", user?.data?.response?.businessName ?? user?.data?.response?.name);
      axiosResponseInterceptorWithCustomHeaders(axiosFraudPreventionManagement, token, refreshToken);
      response = await axiosFraudPreventionManagement.post(`/payment/generate/link`, formData);
      return { response: response.data?.response };
    } catch (err) {
      console.error(err);
      const handler = await appErrorResponseHandler(err);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  },
};
/* export const actions = {
  default: async ({ request }) => {
    try {
      axiosResponseInterceptorWithCustomHeaders(profilesClient, token, refreshToken);
      const user = await profilesClient.get(`/user/profile`);
      formData.append("commerceName", user?.data?.response?.businessName ?? user?.data?.response?.name);
      axiosResponseInterceptorWithCustomHeaders(axiosECommerceClient, token, refreshToken);
      response = await axiosECommerceClient.post(`/payment/generate/link`, formData);
      return { response: response.data?.response };
    } catch (err) {
      console.error(err);
      throw new error(response?.status ?? 400, { info: response?.data?.message ?? "Something went wrong!" });
    }
  },
}; */