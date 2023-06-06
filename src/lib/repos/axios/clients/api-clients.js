/* environment */
import {
  PUBLIC_DEVICES_ENDPOINT,
  PUBLIC_PROFILES_ENDPOINT,
  PUBLIC_ECOMMERCE_ENDPOINT,
  PUBLIC_DEPOSITS_AND_FEES_ENDPOINT,
  PUBLIC_FRAUD_PREVENTION_MANAGEMENT_ENDPOINT,
} from "$env/static/public";
/* client */
import axios from "axios";
/* constants */
import { axiosDefaultsClientFormData, axiosDefaultsClientJson } from "$lib/constants/axios";

axios.defaults.withCredentials = true;

export const axiosECommerceClient = axios.create({
  ...axiosDefaultsClientFormData,
  baseURL: PUBLIC_ECOMMERCE_ENDPOINT,
});
export const axiosClient = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_DEVICES_ENDPOINT,
});
export const axiosFormDataClient = axios.create({
  ...axiosDefaultsClientFormData,
  baseURL: PUBLIC_DEVICES_ENDPOINT,
});
export const profilesFormDataClient = axios.create({
  ...axiosDefaultsClientFormData,
  baseURL: PUBLIC_PROFILES_ENDPOINT,
});
export const profilesClient = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_PROFILES_ENDPOINT,
});
export const axiosDevicesClient = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_DEVICES_ENDPOINT,
});
export const axiosDepositsAndFees = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_DEPOSITS_AND_FEES_ENDPOINT,
});
export const axiosFraudPreventionManagement = axios.create({
  ...axiosDefaultsClientJson,
  baseURL: PUBLIC_FRAUD_PREVENTION_MANAGEMENT_ENDPOINT,
});
