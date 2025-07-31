/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/* client */
import { axiosDevicesClient } from "$lib/repos/axios";
/* handlers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler.js";

export const ssr = false;

const transactions = [
  {
    "Afiliate Number": "4460816",
    Amount: 1590,
    "Application PAN": "415231******8572",
    "Card Type": "debit",
    "Cardholder Name": "",
    "ID Afiliate": "4460816",
    "ID Aggregator": "10089784",
    "ID Terminal": "CODETPV1+0000000",
    "ID Transaction": "TTPV19177926",
    "IFD Serial Number": "0821407546",
    "ISO CODE DESCRIPTION": "Aprobada o completada exitosamente",
    "ISO CODE RESPONSE": "00",
    IVA: 8.904000000000002,
    MIT: "0210",
    "MIT Fields": {
      3: "000000",
      4: "000000159000",
      7: "0807124253",
      11: "418830",
      12: "124253",
      13: "0807",
      15: "0807",
      17: "0807",
      22: "051",
      37: "TTPV19177926",
      38: "00Z00Z",
      39: "00",
      41: "TPVACOD1        ",
      48: "4460816            00000000",
      49: "484",
      63: "& 0000500070! Q100002 04! Q200002 04! C400012 000000001032! ER00002 00",
      _id: "64d13b31e5e680b0c19b7630",
    },
    MSI: 0,
    POS: "TPVACOD1",
    "Points BBVA": false,
    "SIC Code": "5399",
    "Transaction_Date": "230815",
    "Transaction_Time": "124255",
    "Transaction_Type": "00",
    active: true,
    authorization: "00Z00Z",
    comission: 55.650000000000006,
    commerce: "6427534b564dafe73299a7d8",
    createdAt: "2023-08-07T18:42:55.788Z",
    deposit: 1525.446,
    dispersed: false,
    id: "64d13aed283753e9bd54826b",
    originalElements: "0200TTPV191779260807124253000807          ",
    reference: "74555463218081696722653",
    status: "ISO Response - Respuesta recibida por parte del ISO",
    tlv: "5F2A020484820238008407A0000000031010950500800088009A032308079C01009F02060000001590009F03060000000000009F0902008C9F100706011203A4B8069F1A0204849F1E0832313430373534369F2608FF1903E1E9CC4E8B9F2701809F3303E0B0C89F34034403029F3501229F360202599F37047C6CC7509F4104000001599F530152",
    transaction: "64d13b2fe5e680b0c19b762e",
    transactionStatus: "approved",
    type: "tpv",
    updatedAt: "2023-08-07T18:41:49.237Z",
    yearMonth: "2308",
    __v: 0,
    _id: "64d13aed283753e9bd54826b",
  },
];

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, params }) {
  const idTerminal = params.id;
  const start = Number(url.searchParams.get("start") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);

  try {
    const filter = "day";
    const response = await axiosDevicesClient.get(`/transaction`, { params: { start, end } });
    return { filter, start, end, response: response.data?.response };
    // return { transactions };
  } catch (e) {
    const handler = await appErrorResponseHandler(e);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
