/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosDevicesClient } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, params }) {
  const uuid = params.uuid;

  try {
    /* if (uuid != 1) {
      throw new Error();
    } */
    /* const response = await axiosDevicesClient.get(`/transaction/detail/${ticket}`);
    return { ticket, response: response.data?.response }; */
    return { uuid };
  } catch (err) {
    const handler = await appErrorResponseHandler(err);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
