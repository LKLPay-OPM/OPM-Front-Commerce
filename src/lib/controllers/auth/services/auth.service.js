/* repo */
import { profilesClient } from "$lib/repos/axios";
/* jwt decode */
import jwtDecode from "jwt-decode";

class AuthService {
  async login({ email, password }) {
    const { data } = await profilesClient.post("auth/commerce/login", {
      email,
      password,
    });

    if (!data?.response) throw new Error("Request Failed");
    if (!data.response?.token) throw new Error("Token not receiveed");

    const user = jwtDecode(data.response.token);
    return { session: data.response, user };
  }
}

export const authService = new AuthService();
