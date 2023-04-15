/* svelte */
import { error } from "@sveltejs/kit";
import { goto } from "$app/navigation";
import { isLoggedIn, loggedInUser, sessionUser } from "$lib/stores";
/* services */
import { authService } from "./services/auth.service";

export class AuthController {
  static async login(body) {
    try {
      const { session, user } = await authService.login(body);
      isLoggedIn.update(() => true);
      loggedInUser.set(user);
      sessionUser.set(session);
      await goto("/");
    } catch (e) {
      isLoggedIn.update(() => false);
      loggedInUser.set({ error: true });
      sessionUser.set({ error: true });
      return { error: true };
    }
  }

  static async logout(id) {
    try {
      await authService.logout(id);
      isLoggedIn.update(() => false);
      loggedInUser.set({});
      sessionUser.set({});
    } catch (e) {
      return { error: true };
    }
  }

  static async register(body) {
    try {
      const data = await authService.login(body);
      return res.status(200).json({ data });
    } catch (e) {
      throw error(500, String(e));
    }
  }
}
