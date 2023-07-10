import { validateSameDay } from "$lib/utils/date";
export function transactionStatus(status) {
  if (status === "approved") {
    return "APROBADA";
  }
  if (status === "declined") {
    return "DECLINADA";
  }
  if (status === "cancelled") {
    return "CANCELADA";
  }
  return "DESCONOCIDO";
}

export function transactionCancelValidation(status, date, type) {
  if (status === "approved" && validateSameDay(date) && type === "e-commerce") {
    return true;
  }
  return false;
}
