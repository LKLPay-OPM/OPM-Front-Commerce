import {
  axiosClient,
  profilesClient,
  axiosFormDataClient,
  axiosECommerceClient,
  profilesFormDataClient,
  axiosTransactionsClient,
} from "$lib/repos/axios/clients/api-clients";
import { refreshTokenClient } from "$lib/repos/axios/clients/refresh-client";
/* interceptors */
import { axiosRequestInterceptor } from "$lib/repos/axios/interceptors/request";
import { axiosResponseInterceptor } from "$lib/repos/axios/interceptors/response";

/* interceptors */
axiosRequestInterceptor(axiosClient);
axiosRequestInterceptor(axiosFormDataClient);
axiosRequestInterceptor(profilesFormDataClient);
axiosRequestInterceptor(profilesClient);
axiosRequestInterceptor(axiosTransactionsClient);
axiosRequestInterceptor(axiosECommerceClient);

axiosResponseInterceptor(axiosClient);
axiosResponseInterceptor(axiosFormDataClient);
axiosResponseInterceptor(profilesFormDataClient);
axiosResponseInterceptor(profilesClient);
axiosResponseInterceptor(axiosTransactionsClient);
axiosResponseInterceptor(axiosECommerceClient);

/* exports after assigning interceptors */
export {
  axiosClient,
  axiosFormDataClient,
  profilesFormDataClient,
  profilesClient,
  axiosTransactionsClient,
  axiosECommerceClient,
  refreshTokenClient,
};
