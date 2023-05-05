/* svelte */
import { error } from "@sveltejs/kit";
/* endpoints */
import { axiosECommerceClient } from "$lib/repos/axios";

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
      response = await axiosECommerceClient.post(`/payment/generate/link`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Refresh-Token": refreshToken,
        },
      });
      return { response: response.data?.response };
    } catch (err) {
      throw new error(response?.status ?? 400, { info: response?.data?.message ?? "Something went wrong!" });
    }
  },
};
