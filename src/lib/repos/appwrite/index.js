import { Client, Account, Databases, Functions, Storage } from "appwrite";
/* environment */
import {
  PUBLIC_APPWRITE_ENDPOINT,
  PUBLIC_APPWRITE_PROJECT_ID,
  PUBLIC_PROFILES_PROJECT_ID,
} from "$env/static/public";

export const AppClient = new Client()
  .setEndpoint(PUBLIC_APPWRITE_ENDPOINT ?? "")
  .setProject(PUBLIC_APPWRITE_PROJECT_ID ?? "");

export const AppProfilesClient = new Client()
  .setEndpoint(PUBLIC_APPWRITE_ENDPOINT ?? "")
  .setProject(PUBLIC_PROFILES_PROJECT_ID ?? "");

/* clientes comercio */
export const AppAccount = new Account(AppClient);
export const AppDatabases = new Databases(AppClient);
export const AppFunctions = new Functions(AppClient);
/* clientes profiles */
export const AppProfilesFunctions = new Functions(AppProfilesClient);
export const AppProfilesStorage = new Storage(AppProfilesClient);
