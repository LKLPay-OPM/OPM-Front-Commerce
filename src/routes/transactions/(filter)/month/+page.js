/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/*  */
import { axiosDevicesClient } from "$lib/repos/axios";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const filter = "month";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);
  const brand = url.searchParams.get("brand") ?? "";

  try {
    const response = await axiosDevicesClient.get(`/transaction`, { params: { brand, filter, start, end } });
    if (validQueryFilters.includes(filter)) return { brand, filter, start, end, response: response.data?.response };
  } catch (err) {
    console.error(err);
    throw new error(500, "Something went wrong!");
  }
}
