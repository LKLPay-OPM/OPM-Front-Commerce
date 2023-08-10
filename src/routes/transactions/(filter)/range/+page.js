/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/* client */
import { axiosDevicesClient } from "$lib/repos/axios";
/* handlers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";
/* utils */
import { getStringDate, parseSlashDate } from "$lib/utils/date";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const filter = "range";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);
  const current = getStringDate(new Date(parseSlashDate(new Date().toJSON().slice(0, 10))));
  const startDate = url.searchParams.get("startDate") ?? current;
  const endDate = url.searchParams.get("endDate") ?? current;
  const brand = url.searchParams.get("brand") ?? "";

  try {
    const response = await axiosDevicesClient.post(`/transaction/dateRange`, {
      startDate: startDate,
      endDate: endDate,
      start,
      end,
      brand,
    });
    console.log(response);
    return { brand, filter, startDate, endDate, start, end, response: response.data?.response };
  } catch (e) {
    const handler = await appErrorResponseHandler(e);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
