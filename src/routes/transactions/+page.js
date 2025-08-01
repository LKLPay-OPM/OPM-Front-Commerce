/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosDevicesClient } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";
/* utils */
import { getStringDate } from "$lib/utils/date";
import { createQueryString } from "$lib/utils/query";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, params }) {
  const regexp = new RegExp("(day|week|month|range|id)");
  let filter = url.searchParams.get("filter") ?? "day";
  let dateStart = url.searchParams.get("dateStart") ?? "";
  let dateEnd = url.searchParams.get("dateEnd") ?? "";
  let serialNumber = url.searchParams.get("serialNumber") ?? "";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  /* if (filter === "range" ){

  } */
  if (filter === "day") {
    dateStart = `${getStringDate(date)}`;
    dateEnd = `${getStringDate(date)}`;
  }
  if (filter === "week") {
    dateStart = `${getStringDate(new Date(new Date(date.setDate(date.getDate() - date.getDay()+1))))}`;
    dateEnd = `${getStringDate(new Date(new Date(date.setDate(date.getDate() - date.getDay()+7))))}`;
  }
  if (filter === "month") {
    dateStart = `${getStringDate(new Date(new Date(date.getFullYear(), date.getMonth(), 1)))}`;
    dateEnd = `${getStringDate(new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0)))}`;
  }
  try {
    const query = createQueryString({
      serialNumber,
      startDate: dateStart,
      endDate: dateEnd,
      start,
      end
    })
    const transactions = await axiosDevicesClient.get(`transaction/commerce/getTransactions?${query}`);
    const terminals = await axiosDevicesClient.get('terminal/commerce/getTerminals?start=0&end=999');

    return {
      transactions: transactions.data?.response.records,
      summary: transactions.data?.response.summary,
      salesCount: transactions.data?.response.summary.approvedCount,
      salesAmount: transactions.data?.response.summary.approvedAmount,
      comissionAmount: transactions.data?.response.summary.comission,
      ivaAmount: transactions.data?.response.summary.iva,
      total: transactions.data?.response.paging.total,
      start,
      end,
      filter,
      dateStart,
      dateEnd,
      serialNumber,
      terminals: terminals.data?.response.records,
    };
  } catch (err) {
    const handler = await appErrorResponseHandler(err);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
