import axios from 'axios'
/* environment */
import {
  PUBLIC_DEVICES_ENDPOINT,
  PUBLIC_PROFILES_ENDPOINT,
  PUBLIC_TRANSACTIONS_ENDPOINT,
} from "$env/static/public";

class AppEndpoint {
  client = axios.create()

  constructor(contentType = 'application/json', baseUrl= PUBLIC_DEVICES_ENDPOINT) {
    this.client.defaults.baseURL = baseUrl
    this.client.defaults.headers.common['Content-Type'] = contentType
  }
}

export const axiosClient = new AppEndpoint().client
export const axiosFormDataClient = new AppEndpoint('multipart/form-data').client
export const profilesFormDataClient = new AppEndpoint('multipart/form-data', PUBLIC_PROFILES_ENDPOINT).client
export const profilesClient = new AppEndpoint('application/json', PUBLIC_PROFILES_ENDPOINT).client
export const axiosTransactionsClient = new AppEndpoint('application/json', PUBLIC_TRANSACTIONS_ENDPOINT).client