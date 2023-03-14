import { ID } from "appwrite";
/* appwrite */
import { AppAccount, AppClient } from "$lib/repos/appwrite";

class AuthService {
  async login({ email, password }) {
    const data = await AppAccount.createEmailSession(email, password);
    return data;
  }

  async logout(id) {
    const data = await AppAccount.deleteSession(id);
    return data;
  }

  async register({ email, password }) {
    const data = await AppAccount.create(ID.unique(), email, password);
    return data;
  }
}

export const authService = new AuthService();
