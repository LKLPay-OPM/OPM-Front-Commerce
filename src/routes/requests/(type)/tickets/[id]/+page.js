/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { ticketsClient } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const ticket = params.id;
  console.log(ticket)
  try {
    const response = await ticketsClient.get(`/ticket/${ticket}`);
    return { ticket: response.data?.response };
  } catch (err) {
    const handler = await appErrorResponseHandler(err);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
