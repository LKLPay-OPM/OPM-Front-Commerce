/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosDevicesClient } from "$lib/repos/axios";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const ticket = url.searchParams.get("ticket");

  try {
    const response = await axiosDevicesClient.get(`/transaction/detail/${ticket}`);
    return { ticket, response: response.data?.response };
  } catch (err) {
    console.error(err);
    throw new error(500, "Something went wrong!");
  }
}
