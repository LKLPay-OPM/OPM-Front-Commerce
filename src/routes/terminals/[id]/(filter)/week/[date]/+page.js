/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/* repos */
import { axiosDevicesClient } from "$lib/repos/axios";
/* handlers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, params }) {
  const idTerminal = params.id;
  const date = params.date;
  const filter = "week";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);

  try {
    const response = await axiosDevicesClient.get(`/transaction/${date}`, {
      params: { idTerminal, filter, start, end },
    });
    if (validQueryFilters.includes(filter))
      return { idTerminal, date, filter, start, end, response: response.data?.response };
  } catch (e) {
    const handler = await appErrorResponseHandler(e);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
