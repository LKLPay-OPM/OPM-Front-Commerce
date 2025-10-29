/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { profilesClient } from "$lib/repos/axios";
/* handlers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  try {
    const response = await profilesClient.get("/user/profile");
    console.log(response.data?.response);
    return { settings: response.data?.response };
  } catch (e) {
    const handler = await appErrorResponseHandler(e);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
