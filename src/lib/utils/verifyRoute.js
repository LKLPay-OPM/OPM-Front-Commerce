/* stores */
import { linkSelected } from "$lib/stores";
/* router */
import { router } from "$lib/hooks/router.js";
/* sveltekit */
import { goto } from "$app/navigation";
import { browser } from "$app/environment";

export async function checkRouter(user, page) {
  const response = await router(user.accountType, page.route.id);
  if (!response && browser) {
    linkSelected.set("Inicio");
    await goto("/");
  }
}
