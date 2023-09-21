/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosDepositsAndFees } from "$lib/repos/axios";
/* handlers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const id = url.searchParams.get("id");

  try {
    const response = await axiosDepositsAndFees.get(`/dispersion/${id}`);
    return { response: response.data?.response };
  } catch (e) {
    const handler = await appErrorResponseHandler(e);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
