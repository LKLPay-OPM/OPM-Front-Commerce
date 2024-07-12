/* svelte */
import { error } from "@sveltejs/kit";
/* consts */
import { validQueryFilters } from "$lib/constants/filter";
/* client */
import { axiosDevicesClient, profilesClient } from "$lib/repos/axios";
/* controllers */
import { appErrorResponseHandler } from "$lib/handlers/error.handler";
/* utils */
import { getStringDate, parseSlashDate } from "$lib/utils/date";
export const ssr = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  const regexp = new RegExp("(day|week|month|range|id)");
  const regexNumbers = new RegExp("[0-9]+");
  let selectedDate = url.pathname.match(regexNumbers) ?? [];
  const current = getStringDate(new Date(parseSlashDate(new Date().toJSON().slice(0, 10))));
  const filters = {
    branch: url.searchParams.get("branch") ?? "all",
    brand: url.searchParams.get("brand") ?? "",
    end: Number(url.searchParams.get("end") ?? 10),
    endDate: url.searchParams.get("endDate") ?? "",
    filter: url.pathname.match(regexp)[0],
    start: Number(url.searchParams.get("start") ?? 0),
    startDate: url.searchParams.get("startDate") ?? "",
    terminal: url.searchParams.get("terminal") ?? "all",
    ticketId: url.searchParams.get("search") ?? "",
    type: url.searchParams.get("type") ?? "all",
    status: url.searchParams.get("status") ?? "all",
  }

  const branchesReq = [
    {_id: "BR111", branchName: "SUCURSAL 1"},
    {_id: "BR222", branchName: "SUCURSAL 2"},
    {_id: "BR333", branchName: "SUCURSAL 3"},
  ]

  const terminalsReq = [
    {_id: "TPV111", "ID Terminal": "111"},
    {_id: "TPV222", "ID Terminal": "222"},
    {_id: "TPV333", "ID Terminal": "333"},
  ]
  
  const transactionType = [
    {value: "all", name: "TODAS"},
    {value: "ecommerce", name: "E-COMMERCE"},
    {value: "tpv", name: "TPV"},
  ]

  const transactionStatus = [
    {value: "all", name: "TODAS"},
    {value: "n/a", name: "SIN ESTATUS"},
    {value: "approved", name: "APROBADA"},
    {value: "declined", name: "DECLINADA"},
    {value: "cancelled", name: "CANCELADA"},
    {value: "refund", name: "DEVOLUCIÓN"},
    {value: "reversed", name: "REVERSO"},
  ]

  try {
    let arrayBranches = [{name: "TODAS", value: "all"}];
    const branchesReq = await profilesClient.get(`branch/commerce/search`);
    branchesReq.data.response.map((branch) => {arrayBranches.push({name: branch.branchName, value: branch._id})})

    let arrayTerminals = [{name: "TODAS", value: "all"}];
    const terminalsReq = await axiosDevicesClient.get(`terminal/commerce/search`);
    terminalsReq.data.response.map((terminal) => {arrayTerminals.push({name: `${terminal.name.toUpperCase()} - ${terminal.serialNumber}`, value:terminal.serialNumber})}) 

    const response = await axiosDevicesClient.get(`/transaction`, {
      params: { 
        branch: filters.branch,
        brand: filters.brand,
        end: filters.end,
        endDate: filters.endDate,
        filter: filters.filter,
        selectedDate: selectedDate[0] ?? "",
        start: filters.start,
        startDate: filters.startDate,
        serialNumber: filters.terminal,
        ticketId: filters.ticketId,
        type: filters.type,
        status: filters.status,
      },
    });
    return { branches: arrayBranches, filters, response: response.data?.response, terminals: arrayTerminals, transactionType, transactionStatus };
  } catch (e) {
    console.log(e)
    const handler = await appErrorResponseHandler(e);
    const code = handler?.code ?? 500;
    const message = handler?.message ?? "¡Algo salió mal!";
    throw new error(code, message);
  }
}
