/* repo */
import { appClient } from "$lib/repos/axios";
/* appwrite */
import { AppAccount } from "$lib/repos/appwrite";
/* jwt decode */
import jwtDecode from "jwt-decode";

class AuthService {
  async login({ email, password }) {
    const { data } = await appClient.profiles().post("/auth/commerce/login", {
      email,
      password,
    });

    if (!data?.response) throw new Error("Request Failed");
    if (!data.response?.token) throw new Error("Token not receiveed");

    const user = jwtDecode(data.response.token);
    return { session: data.response, user };
  }

  async logout(id) {
    return await AppAccount.deleteSession(id);
  }

  async register({ email, password }) {
    return await AppAccount.create(ID.unique(), email, password);
  }
}

export const authService = new AuthService();
