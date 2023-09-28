/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/* client */
import { profilesClient, axiosDevicesClient } from "$lib/repos/axios";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const regexp = new RegExp("(day|week|month)");
  let filter = url.searchParams.get("filter") ?? "day";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);

  try {
    const transactions = await axiosDevicesClient.get(`/transaction`, { params: { filter, start, end } });
    if (validQueryFilters.includes(filter)) return { filter, start, end, transactions: transactions.data?.response };
  } catch (err) {
    throw new error(500, "Something went wrong!");
  }
}
