import { ID } from "appwrite";
/* appwrite */
import { AppAccount, AppClient } from "$lib/repos/appwrite";

class AuthService {
  async login({ email, password }) {
    const session = await AppAccount.createEmailSession(email, password);
    const user = await AppAccount.get();
    const jwt = await AppAccount.createJWT();
    return { session, user, jwt };
  }

  async logout(id) {
    return await AppAccount.deleteSession(id);
  }

  async register({ email, password }) {
    return await AppAccount.create(ID.unique(), email, password);
  }
}

export const authService = new AuthService();
