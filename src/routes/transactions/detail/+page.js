/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/*  */
  import { axiosTransactionsClient } from "$lib/repos/axios";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const ticket = url.searchParams.get("ticket");

  try {
    const response = await axiosTransactionsClient.get(
      `/transaction/detail/${ticket}`,
    );
    console.log(response)
    return { ticket, response: response.data?.response };
  } catch (err) {
    console.log(err)
    throw new error(500, "Something went wrong!");
  }
}
