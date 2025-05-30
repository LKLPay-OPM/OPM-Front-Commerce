export const formatDecimals = (num, decimals) => num.toLocaleString('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatCardType = (string) => {
  if (string === "credit") {
    return "CRÉDITO";
  }
  if (string === "debit") {
    return "DÉBITO";
  }
  if (string === "international") {
    return "INTERNACIONAL";
  }
  return "N/A";
};
