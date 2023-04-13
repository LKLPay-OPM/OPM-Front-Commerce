/* svelte */
import { error } from "@sveltejs/kit";
import { goto } from "$app/navigation";
import { isLoggedIn, loggedInUser, appwriteUser } from "$lib/stores";
/* services */
import { authService } from "./services/auth.service";
import { profilesClient } from "$lib/repos/axios";

export class AuthController {
  static async login(body) {
    try {
      const { session, user, jwt } = await authService.login(body);
      /* const profile = await profilesClient.get(
        '/user/profile',
        jwt,
      )
      console.log(profile) */
      isLoggedIn.update(() => true);
      // loggedInUser.set(user);
      loggedInUser.set(session);
      appwriteUser.set(user);
      // console.log(session);
      // console.log(user);
      await goto("/");
    } catch (e) {
      isLoggedIn.update(() => false);
      loggedInUser.set({});
      appwriteUser.set({});
      return { error: true };
    }
  }

  static async logout(id) {
    try {
      await authService.logout(id);
      isLoggedIn.update(() => false);
      loggedInUser.set({});
      appwriteUser.set({});
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
