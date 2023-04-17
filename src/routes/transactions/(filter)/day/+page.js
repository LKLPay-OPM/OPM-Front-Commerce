/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/* client */
import { axiosTransactionsClient } from "$lib/repos/axios";
/* utils */
import { axiosWithAuth } from "$lib/utils/axios";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const filter = "day";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);

  try {
    axiosWithAuth(axiosTransactionsClient);
    const response = await axiosTransactionsClient.get(`/transaction`, { params: { filter, start, end } });
    if (validQueryFilters.includes(filter)) return { filter, start, end, response: response.data?.response };
  } catch (err) {
    console.error(err);
    throw new error(500, "Something went wrong!");
  }
}
