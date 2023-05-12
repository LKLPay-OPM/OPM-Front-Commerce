import {
  axiosClient,
  profilesClient,
  axiosFormDataClient,
  axiosECommerceClient,
  profilesFormDataClient,
  axiosDevicesClient,
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
axiosRequestInterceptor(axiosDevicesClient);
axiosRequestInterceptor(axiosECommerceClient);

axiosResponseInterceptor(axiosClient);
axiosResponseInterceptor(axiosFormDataClient);
axiosResponseInterceptor(profilesFormDataClient);
axiosResponseInterceptor(profilesClient);
axiosResponseInterceptor(axiosDevicesClient);
axiosResponseInterceptor(axiosECommerceClient);

/* exports after assigning interceptors */
export {
  axiosClient,
  axiosFormDataClient,
  profilesFormDataClient,
  profilesClient,
  axiosDevicesClient,
  axiosECommerceClient,
  refreshTokenClient,
};
