/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosTransactionsClient } from "$lib/repos/axios";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const ticket = url.searchParams.get("ticket");

  try {
    const response = await axiosTransactionsClient.get(`/transaction/detail/${ticket}`);
    return { ticket, response: response.data?.response };
  } catch (err) {
    console.error(err);
    throw new error(500, "Something went wrong!");
  }
}
