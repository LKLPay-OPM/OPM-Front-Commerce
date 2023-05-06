/* axios */
import { axiosTransactionsClient } from "$lib/repos/axios";
/* stores */
import { get } from "svelte/store";
import { isLoggedIn } from "$lib/stores.js";

export const ssr = false;

export async function load() {
  if(get(isLoggedIn)){
    const transactions = await axiosTransactionsClient.get("/transaction");
    return {
      transactions: transactions.data?.response,
    };
  }
}
