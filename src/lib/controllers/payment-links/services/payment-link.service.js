import { browser } from "$app/environment";
/* jwt decode */
import jwtDecode from "jwt-decode";
/* clients */
import { axiosFraudPreventionManagement } from "$lib/repos/axios";

class PaymentLinkService {
  async generate(body) {
    return await axiosFraudPreventionManagement.post(`/link`, body);
  }
}

export const paymentLinkService = new PaymentLinkService();
