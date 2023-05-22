export const formatDecimals = (num, decimals) => num.toLocaleString('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})