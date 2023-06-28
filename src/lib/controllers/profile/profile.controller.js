/* svelte */
import { error } from "@sveltejs/kit";
import { isLoggedIn, loggedInUser, sessionUser } from "$lib/stores";
/* services */
import { profileService } from "./services/profile.service";
/* handlers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";
import { appResponseHandler } from "$lib/handlers/response.handler";

export class ProfileController {
  static async getProfile(body) {
    try {
      const { data } = await profileService.getProfile(body);
      const response = appResponseHandler(data);
      return { response };
    } catch (e) {
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  }
}
