/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosDepositsAndFees } from "$lib/repos/axios";

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  // const ticket = url.searchParams.get("ticket");

  try {
    const response = await axiosDepositsAndFees.get(`/dispersions`);
    return { dispersions: response.data?.response?.dispersions, resume: response.data?.response?.resume };
  } catch (err) {
    console.error(err);
    throw new error(500, "Something went wrong!");
  }
}