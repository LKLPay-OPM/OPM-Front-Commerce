/* svelte */
import { error } from "@sveltejs/kit";
import { isLoggedIn, loggedInUser, sessionUser } from "$lib/stores";
/* services */
import { paymentLinkService } from "./services/payment-link.service";
/* handlers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";
import { appResponseHandler } from "$lib/handlers/response.handler";

export class PaymentLinkController {
  static async generate(body) {
    try {
      const { data } = await paymentLinkService.generate(body);
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
