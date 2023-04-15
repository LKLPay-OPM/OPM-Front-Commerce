/* svelte */
import { error } from "@sveltejs/kit";
/* clients */
import { appClient } from "$lib/repos/axios";

// export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    const transactions = await appClient.transactions().get("/transaction");
    return { transactions: transactions.data?.response };
  } catch (err) {
    console.error(err?.response?.data);
    throw new error(500, "Something went wrong!");
  }
}
