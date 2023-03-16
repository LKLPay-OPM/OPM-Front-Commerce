import { error } from "@sveltejs/kit";
/* controllers */
import { ProfileController } from "$lib/controllers/profile/profile.controller";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // const profile = await ProfileController.getProfile();
  // if (profile?.error) throw error(500, profile?.message);
  // return { saludo: "hola", profile };
}
