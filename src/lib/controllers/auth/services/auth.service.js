import { browser } from '$app/environment';
/* jwt decode */
import jwtDecode from "jwt-decode";

class AuthService {
  async login({ email, password }) {
    /* repo */
    const { profilesClient } = browser ? await (async () => await import("$lib/repos/axios"))() : await (async () => await import("$lib/repos/axios/clients/api-clients"))();

    const { data } = await profilesClient.post("auth/commerce/login", {
      email,
      password,
    });

    if (!data?.response) throw new Error("Request Failed");
    if (!data.response?.token) throw new Error("Token not receiveed");

    const user = jwtDecode(data.response.token);
    return { session: data.response, user };
  }
  async register({email, password}){
    const { profilesClient } = browser ? await (async () => await import("$lib/repos/axios"))() : await (async () => await import("$lib/repos/axios/clients/api-clients"))();
    const { data } = await profilesClient.post(`auth/register`, {email, password});

    if (!data?.response) throw new Error("Request Failed");
    if (!data.response?.token) throw new Error("Token not receiveed");

    const user = jwtDecode(data.response.token);
    return { session: data.response, user };
  }
}

export const authService = new AuthService();
