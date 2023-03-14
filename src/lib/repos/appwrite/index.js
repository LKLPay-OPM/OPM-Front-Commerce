import { Client, Account, Databases } from "appwrite";
/* environment */
import {
  PUBLIC_APPWRITE_ENDPOINT,
  PUBLIC_APPWRITE_PROJECT_ID,
} from "$env/static/public";

export const AppClient = new Client()
  .setEndpoint(PUBLIC_APPWRITE_ENDPOINT ?? "")
  .setProject(PUBLIC_APPWRITE_PROJECT_ID ?? "");

export const AppAccount = new Account(AppClient);
export const AppDatabases = new Databases(AppClient);
