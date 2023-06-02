/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosDepositsAndFees } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  // const ticket = url.searchParams.get("ticket");

  try {
    const response = await axiosDepositsAndFees.get(`/dispersions`);
    return { dispersions: response.data?.response?.dispersions, resume: response.data?.response?.resume };
  } catch (err) {
    console.error(err);
    const handler = await appErrorResponseHandler(err);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}