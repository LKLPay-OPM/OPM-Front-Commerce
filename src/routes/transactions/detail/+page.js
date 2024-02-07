/* svelte */
import { error } from "@sveltejs/kit";
/* client */
import { axiosDevicesClient, axiosFraudPreventionManagementJSON } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";

export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const ticket = url.searchParams.get("ticket");

  try {
    const response = await axiosDevicesClient.get(`/transaction/detail/${ticket}`);
    let data3ds;
    const idTransaction = response.data.response["ID Transaction"];
    const response3ds = await axiosFraudPreventionManagementJSON.get(`/3ds/get3dsRequest`, {
      params: {
        idTransaction,
      },
    });
    const threeDS = response3ds.data.response;
    console.log(threeDS)
    if (response3ds.data.response == null) {
      data3ds = response3ds.data.response;
    } else {
      if(threeDS.checkEnrollmentData.status == "PENDING_AUTHENTICATION"){
        data3ds = {
          _id: threeDS._id,
          eci: threeDS.validation.consumerAuthenticationInformation.eciRaw,
          token: threeDS.validation.consumerAuthenticationInformation.token,
          cavv: threeDS.validation.consumerAuthenticationInformation.cavv,
          threeDSServerTransactionId: threeDS.validation.consumerAuthenticationInformation.threeDSServerTransactionId,
          id: threeDS.validation.id,
          status: threeDS.validation.status,
        };
      } else {
        data3ds = {
          _id: threeDS._id,
          eci: threeDS.checkEnrollmentData.consumerAuthenticationInformation.eciRaw,
          token: threeDS.checkEnrollmentData.consumerAuthenticationInformation.token,
          cavv: threeDS.checkEnrollmentData.consumerAuthenticationInformation.cavv,
          threeDSServerTransactionId: threeDS.checkEnrollmentData.consumerAuthenticationInformation.threeDSServerTransactionId,
          id: threeDS.checkEnrollmentData.id,
          status: threeDS.checkEnrollmentData.status,
        };
      }
    }
    return { ticket, response: response.data?.response, data3ds };
  } catch (err) {
    const handler = await appErrorResponseHandler(err);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
