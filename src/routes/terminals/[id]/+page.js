/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosDevicesClient } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";
/* utils */
import { getStringDate, parseSlashDate } from "$lib/utils/date";
export const ssr = false;

const data = {
  id: "0001",
  name: "Matriz 1",
  serial: "F20-003925",
  branch: "Matriz",
  type: "Master",
  transactions: "000000200000",
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, params }) {
  const terminal = params.id;
  /* const regexp = new RegExp("(day|week|month|range|id)");
  const regexNumbers = new RegExp("[0-9]+");
  let filter = url.pathname.match(regexp)[0];
  let selectedDate = url.pathname.match(regexNumbers) ?? [];
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);
  const current = getStringDate(new Date(parseSlashDate(new Date().toJSON().slice(0, 10))));
  const startDate = url.searchParams.get("startDate") ?? "";
  const endDate = url.searchParams.get("endDate") ?? "";
  const ticketId = url.searchParams.get("search") ?? "";
  const brand = url.searchParams.get("brand") ?? ""; */

  try {
    /* const response = await axiosDevicesClient.get(`/transaction`, {
      params: { ticketId, filter, selectedDate: selectedDate[0] ?? "", start, end, startDate, endDate, brand },
    });
    return { brand, ticketId, filter, start, end, startDate, endDate, response: response.data?.response }; */
    return { terminal: data };
  } catch (e) {
    const handler = await appErrorResponseHandler(e);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
