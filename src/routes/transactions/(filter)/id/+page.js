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
  const filter = "id";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);
  const ticketId = url.searchParams.get("search") ?? "";
  const brand = url.searchParams.get("brand") ?? "";

  try {
    const response = await axiosDevicesClient.get(`/transaction/getTransactionById/${ticketId}`, {
      params: { start, end, brand },
    });
    return { brand, ticket: ticketId, filter, start, end, response: response.data?.response };
  } catch (e) {
    const handler = await appErrorResponseHandler(e);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
