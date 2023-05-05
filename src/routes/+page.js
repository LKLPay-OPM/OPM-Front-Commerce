import { axiosTransactionsClient } from "$lib/repos/axios";

export const ssr = false;

export async function load() {
  const transactions = await axiosTransactionsClient.get("/transaction");

  return {
    transactions: transactions.data?.response,
  };
}
