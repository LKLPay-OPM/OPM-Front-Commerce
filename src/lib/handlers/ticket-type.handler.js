export function ticketTypeHandler(type) {
  if (type === "transaction") {
    return "Aclaración en Transacción";
  }
  if (type === "rolls") {
    return "Solicitud de Rollos";
  }
  if (type === "terminals") {
    return "Solicitud de Terminales";
  }
  if (type === "support") {
    return "Solicitud de Soporte";
  }
  if (type === "data-update") {
    return "Solicitud de Cambio de Datos";
  }
  if (type === "chargeback") {
    return "Solicitud de Contracargo";
  }
  if (type === "dispersion") {
    return "Aclaración de Dispersión";
  }
  if (type === "balance") {
    return "Aclaración de Saldo a Dispersar";
  }
  return "N/A";
}

export function ticketPathHandler(type) {
  if (type === "rolls") {
    return "rolls";
  }
  if (type === "terminals") {
    return "terminals";
  }
  return "tickets";
}
