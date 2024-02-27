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
      isLoggedIn.set(true);
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

  static async logout() {
    try {
      isLoggedIn.update(() => false);
      loggedInUser.set({});
      sessionUser.set({});
      await goto("/login");
    } catch (e) {
      return { error: true };
    }
  }

  static async register(body) {
    try {
      const { session, user } = await authService.register(body);
      return { session, user };
      /* isLoggedIn.set(true);
      loggedInUser.set(user);
      sessionUser.set(session); */
    } catch (e) {
      isLoggedIn.update(() => false);
      loggedInUser.set({ error: true });
      sessionUser.set({ error: true });
      return { error: true, message: e };
    }
  }

  static async validateUser(route) {
    try {
      return await authService.validateUser(route);
    } catch (e) {
      console.error(e)
    }
  }
}
