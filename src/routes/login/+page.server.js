/* svelte */
import { error } from "@sveltejs/kit";
import { isLoggedIn, loggedInUser, sessionUser } from "$lib/stores";
/* interceptor */
import { interceptor } from "$lib/utils/interceptors";
/* endpoints */
import { axiosFraudPreventionManagement, profilesClient } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";
import { AuthController } from "$lib/controllers/auth/auth.controller";
/* utils */
import { setCookie } from "$lib/utils/cookie";

export const ssr = false;

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const input = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    try {
      const data = await AuthController.login(input);
      setCookie(cookies, "token", data?.session?.token);
      setCookie(cookies, "refreshToken", data?.session?.refreshToken);
      return data;
    } catch (err) {
      console.error(err);
      const handler = await appErrorResponseHandler(err);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  },
};
