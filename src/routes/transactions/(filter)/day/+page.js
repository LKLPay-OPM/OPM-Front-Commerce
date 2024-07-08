/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/* client */
import { axiosDevicesClient } from "$lib/repos/axios";
/* handlers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler.js";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const filters = {
    branch: url.searchParams.get("branch") ?? "all",
    brand: url.searchParams.get("brand") ?? "",
    end: Number(url.searchParams.get("end") ?? 10),
    endDate: url.searchParams.get("endDate") ?? "",
    filter: "day",
    start: Number(url.searchParams.get("start") ?? 0),
    startDate: url.searchParams.get("startDate") ?? "",
    terminal: url.searchParams.get("terminal") ?? "all",
    ticketId: url.searchParams.get("search") ?? "",
    type: url.searchParams.get("type") ?? "all",
    status: url.searchParams.get("status") ?? "all",
  }

  try {
    const response = await axiosDevicesClient.get(`/transaction`, { params: { 
      branch: filters.branch,
      brand: filters.brand,
      end: filters.end,
      endDate: filters.endDate,
      filter: filters.filter,
      start: filters.start,
      startDate: filters.startDate,
      serialNumber: filters.terminal,
      ticketId: filters.ticketId,
      type: filters.type,
      status: filters.status,
    }});
    return { filters, response: response.data?.response };
  } catch (e) {
    const handler = await appErrorResponseHandler(e);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
