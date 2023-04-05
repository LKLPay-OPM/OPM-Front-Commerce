/* svelte */
import { error } from "@sveltejs/kit";
/* controllers */
import { ProfileController } from "$lib/controllers/profile/profile.controller";
/*  */
import { axiosTransactionsClient } from "$lib/repos/axios";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const profile = await ProfileController.getSession();
  if (profile?.error) {
    if (
      profile.message?.includes?.("User (role: guests) missing scope (account)")
    )
      return { redirect: true, path: "/login" };
    throw error(500, profile?.message);
  }

  try {
    
    const transactions = await axiosTransactionsClient.get('/transaction')
    // const userProfile = await ProfileController.getProfile();
    return { profile, transactions: transactions.data?.response /*, userProfile */ };
  } catch (err) {
    throw new error(500, "Something went wrong!");
  }
}
