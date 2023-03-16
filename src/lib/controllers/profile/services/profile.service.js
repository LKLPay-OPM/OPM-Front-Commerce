/* appwrite */
import { AppAccount, AppDatabases } from "$lib/repos/appwrite";

class ProfileService {
  async getProfile() {
    const user = await AppAccount.get();
    const database = await AppDatabases.getDocument(
      "6412c41b180803badba9",
      "6412c429ca4fad3febf8",
      user.$id
    );
    return database;
  }

  async createProfile() {
    const user = await AppAccount.get();
    const database = await AppDatabases.createDocument(
      "6412c41b180803badba9",
      "6412c429ca4fad3febf8",
      user.$id,
      {
        idClient: user.$id,
      }
    );
    return database;
  }
}

export const profileService = new ProfileService();
