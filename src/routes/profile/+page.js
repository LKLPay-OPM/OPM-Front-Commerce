/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/* client */
import { profilesClient } from "$lib/repos/axios";
/* utils */
import { axiosWithAuth } from "$lib/utils/axios";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    axiosWithAuth(profilesClient);
    const response = await profilesClient.get(`/user/profile`);
    return { response: response.data?.response };
  } catch (err) {
    console.error(err);
    throw new error(500, "Something went wrong!");
  }
}
