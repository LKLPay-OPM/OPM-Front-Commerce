/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/*  */
import { axiosDevicesClient } from "$lib/repos/axios";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, params }) {
  const date = params.date;
  const filter = "month";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);
  const brand = url.searchParams.get("brand") ?? "";

  try {
    const response = await axiosDevicesClient.get(`/transaction/month/${date}`, {
      params: { filter, start, end, brand },
    });
    if (validQueryFilters.includes(filter))
      return { brand, date, filter, start, end, response: response.data?.response };
  } catch (err) {
    throw new error(500, "Something went wrong!");
  }
}
