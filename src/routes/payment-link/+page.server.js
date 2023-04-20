/* svelte */
import { error } from "@sveltejs/kit";
/* endpoints */
import { axiosECommerceClient } from "$lib/repos/axios/index.js";
import { axiosWithAuth } from "$lib/utils/axios.js";

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
    const token = formData.get("token");
    formData.delete("token");
    let response;
    try {
        response = await axiosECommerceClient.post(`/payment/generate/link`, formData, {headers: {Authorization: `Bearer ${token}` }});
        return { response: response.data?.response };
      } catch (err) {
        throw new error(response?.status ?? 400, { info: response?.data?.message ?? "Something went wrong!" });
    }
    const email = formData.get("email");
    if (!email) {
      return error(400, { email, missing: true });
    }

    return { success: true };
  },
};
