/* appwrite */
import {
  AppAccount,
  AppDatabases,
  AppProfilesFunctions,
} from "$lib/repos/appwrite";

class ProfileService {
  async getProfile() {
    const execution = await AppProfilesFunctions.createExecution(
      "641a6c62ed8d695bedbc"
    );
    const response = execution.response;
    const parsed = JSON.parse(response);
    return parsed;
  }

  async getSession() {
    const account = await AppAccount.get();
    return account;
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
