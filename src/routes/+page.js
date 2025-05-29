/* svelte */
import { error } from "@sveltejs/kit";
/* axios */
import { axiosDevicesClient, profilesClient } from "$lib/repos/axios";
/* stores */
import { get } from "svelte/store";
import { isLoggedIn } from "$lib/stores.js";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";
import { getStringDate } from "$lib/utils/date";

export const ssr = false;

export async function load({ url, params }) {
  if (get(isLoggedIn)) {
    const start = Number(url.searchParams.get("start") ?? 0);
    const end = Number(url.searchParams.get("end") ?? 10);
    const date = new Date();
    let dateStart = `${getStringDate(date)}070000`;
    let dateEnd = `${getStringDate(new Date(date.setDate(date.getDate() + 1)))}065959`;
    try {
      const response = await axiosDevicesClient.get(
        `transaction/commerce/getTransactions?startDate=${dateStart}&endDate=${dateEnd}&start=${start}&end=${end}`
      );

      const user = await profilesClient.get("/user/profile");
      return {
        transactions: response.data?.response.records?? [],
        total: response.data?.response.paging.total,
        summary: response.data?.response.summary,
        user: user.data?.response,
        dateStart,
        dateEnd,
        start,
        end,
      };
    } catch (err) {
      console.log("err", err);
      const handler = await appErrorResponseHandler(err);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  }
}
