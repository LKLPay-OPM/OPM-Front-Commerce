/* svelte */
import { error } from "@sveltejs/kit";
/* controllers */
import { ProfileController } from "$lib/controllers/profile/profile.controller";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const profile = await ProfileController.getSession();
  if (profile?.error) {
    if (
      profile.message?.includes?.("User (role: guests) missing scope (account)")
    )
      return { redirect: false };
    throw error(500, profile?.message);
  }
  return { redirect: true, path: "/" };
}
