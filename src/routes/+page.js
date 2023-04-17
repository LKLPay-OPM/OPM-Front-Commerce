import { axiosTransactionsClient } from "$lib/repos/axios";
import { axiosWithAuth } from "$lib/utils/axios";

export const ssr = false;

export async function load() {
  axiosWithAuth(axiosTransactionsClient); // llamamos a la función para agregar el token a las solicitudes
  const transactions = await axiosTransactionsClient.get("/transaction");

  return {
    props: {
      transactions: transactions.data?.response,
      // ...
    },
  };
}
