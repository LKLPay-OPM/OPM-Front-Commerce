/* svelte */
import { error } from "@sveltejs/kit";
/* interceptor */
import { axiosRequestInterceptorWithCustomHeaders } from "$lib/repos/axios/interceptors/request";
import { axiosResponseInterceptorWithCustomHeaders } from "$lib/repos/axios/interceptors/response";
/* endpoints */
import { axiosECommerceClient } from "$lib/repos/axios/clients/api-clients";

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
      axiosRequestInterceptorWithCustomHeaders(axiosECommerceClient, {
        Authorization: `Bearer ${token}`,
        "X-Refresh-Token": refreshToken,
      });
      axiosResponseInterceptorWithCustomHeaders(axiosECommerceClient, token, refreshToken);
      response = await axiosECommerceClient.post(`/payment/generate/link`, formData);
      return { response: response.data?.response };
    } catch (err) {
      console.error(err);
      throw new error(response?.status ?? 400, { info: response?.data?.message ?? "Something went wrong!" });
    }
  },
};
