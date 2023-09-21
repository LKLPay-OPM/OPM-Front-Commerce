/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosDepositsAndFees, axiosDevicesClient } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  // const ticket = url.searchParams.get("ticket");

  try {
    const resume = await axiosDevicesClient.get(`/transaction/getPending/balance`);
    const response = await axiosDepositsAndFees.get(`/dispersion`);
    return {
      dispersions: response.data?.response?.dispersions,
      resume: { depositBalance: resume.data?.response },
      rate: response.data?.response?.rate,
    };
  } catch (err) {
    const handler = await appErrorResponseHandler(err);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
