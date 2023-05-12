/* axios */
import { axiosDevicesClient } from "$lib/repos/axios";
/* stores */
import { get } from "svelte/store";
import { isLoggedIn } from "$lib/stores.js";

export const ssr = false;

export async function load() {
  if(get(isLoggedIn)){
    try {
      const transactions = await axiosDevicesClient.get("/transaction");
      return {
        transactions: transactions.data?.response,
      };
    } catch (err) {
      throw new error(500, "Something went wrong!");
    }
  }
}
