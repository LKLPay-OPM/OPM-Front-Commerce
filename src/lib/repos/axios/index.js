import {
  axiosClient,
  profilesClient,
  axiosFormDataClient,
  axiosECommerceClient,
  profilesFormDataClient,
  axiosDevicesClient,
  axiosDepositsAndFees,
  axiosFraudPreventionManagement,
  axiosFraudPreventionManagementJSON,
  ticketsClient,
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
axiosRequestInterceptor(axiosDepositsAndFees);
axiosRequestInterceptor(axiosFraudPreventionManagement);
axiosRequestInterceptor(axiosFraudPreventionManagementJSON);
axiosRequestInterceptor(ticketsClient);

axiosResponseInterceptor(axiosClient);
axiosResponseInterceptor(axiosFormDataClient);
axiosResponseInterceptor(profilesFormDataClient);
axiosResponseInterceptor(profilesClient);
axiosResponseInterceptor(axiosDevicesClient);
axiosResponseInterceptor(axiosECommerceClient);
axiosResponseInterceptor(axiosDepositsAndFees);
axiosResponseInterceptor(axiosFraudPreventionManagement);
axiosResponseInterceptor(axiosFraudPreventionManagementJSON);
axiosResponseInterceptor(ticketsClient);

/* exports after assigning interceptors */
export {
  axiosClient,
  axiosFormDataClient,
  profilesFormDataClient,
  profilesClient,
  axiosDevicesClient,
  axiosECommerceClient,
  refreshTokenClient,
  axiosDepositsAndFees,
  axiosFraudPreventionManagement,
  axiosFraudPreventionManagementJSON,
  ticketsClient,
};
