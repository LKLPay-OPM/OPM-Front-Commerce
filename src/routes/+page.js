/* svelte */
import { error } from "@sveltejs/kit";
/* axios */
import { axiosDevicesClient, profilesClient } from "$lib/repos/axios";
/* stores */
import { get } from "svelte/store";
import { isLoggedIn } from "$lib/stores.js";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

export const ssr = false;

export async function load() {
  if (get(isLoggedIn)) {
    try {
      const resume = await axiosDevicesClient.get(`/transaction/getPending/balance`);
      const transactions = await axiosDevicesClient.get("/transaction");
      const user = await profilesClient.get("/user/profile");
      transactions.data.response.resume.Deposit = resume.data.response;
      return {
        transactions: transactions.data?.response,
        user: user.data?.response,
      };
    } catch (err) {
      const handler = await appErrorResponseHandler(err);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  }
}
