/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/*  */
import { axiosDevicesClient } from "$lib/repos/axios";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, params }) {
  const filter = "week";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);

  try {
    const response = await axiosDevicesClient.get(`/transaction`, { params: { filter, start, end } });
    if (validQueryFilters.includes(filter)) return { filter, start, end, response: response.data?.response };
  } catch (err) {
    console.error(err);
    throw new error(500, "Something went wrong!");
  }
}
