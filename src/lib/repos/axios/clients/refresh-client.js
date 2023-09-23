/* environment */
import { PUBLIC_PROFILES_ENDPOINT } from "$lib/constants/envs";
/* client */
import axios from "axios";
/* constants */
import { axiosDefaultsClientJson } from "$lib/constants/axios";

axios.defaults.withCredentials = true;

export const refreshTokenClient = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_PROFILES_ENDPOINT,
});
