/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/* client */
import { profilesClient, axiosDevicesClient, axiosDepositsAndFees } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const regexp = new RegExp("(day|week|month)");
  let filter = url.searchParams.get("filter") ?? "day";
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);

  try {
    const user = await profilesClient.get(`/user/profile`);
    const sicCatalog = await axiosDepositsAndFees.get(`/catalog/sicCodesById/${user.data.response.businessLine}`);
    const businessLineName = sicCatalog.data.response[0].name;
    const transactions = await axiosDevicesClient.get(`/transaction`, { params: { filter, start, end } });
    user.data.response.businessLine = businessLineName;
    if (validQueryFilters.includes(filter))
      return { user: user?.data?.response, filter, start, end, transactions: transactions.data?.response };
  } catch (err) {
    console.error(err);
    const handler = await appErrorResponseHandler(err);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
