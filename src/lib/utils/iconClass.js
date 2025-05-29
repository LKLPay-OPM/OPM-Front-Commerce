export function getIconStatusClass(status) {
  if (status === "approved") {
    return "success";
  }
  if (status === "cancelled") {
    return "error";
  }
  if (status === "declined") {
    return "muted";
  }
  return "";
}

export function getDepositIconTooltip(status) {
  if (status === "done") {
    return "Realizado";
  }
  if (status === "n/a") {
    return "N/A";
  }
  if (status === "in-process") {
    return "En Proceso";
  }
  return "Pendiente";
}

export function getDepositIconStatus(status) {
  if (status === "done") {
    return "success";
  }
  if (status === "n/a") {
    return "muted";
  }
  if (status === "in-process") {
    return "warning";
  }
  return "";
}

export function getTefIconStatus(status) {
  if (status === "approved") {
    return "success";
  }
  if (status === "n/a") {
    return "muted";
  }
  if (status === "warning") {
    return "warning";
  }
  if (status === "declined") {
    return "error";
  }
  return "";
}
export function getTefIconTooltip(status) {
  if (status === "approved") {
    return "Aprobada";
  }
  if (status === "n/a") {
    return "N/A";
  }
  if (status === "warning") {
    return "Advertencia";
  }
  if (status === "declined") {
    return "Declinada";
  }
  return "Pendiente";
}

export function getTransactionIconStatus(status) {
  if (status === "approved") {
    return "Aprobada";
  }
  if (status === "refund") {
    return "Reembolzada";
  }
  if (status === "n/a") {
    return "N/A";
  }
  if (status === "declined") {
    return "Declinada";
  }
  if (status === "cancelled") {
    return "Cancelada";
  }
  if (status === "reversed") {
    return "Reversada";
  }
  return "N/A";
}
