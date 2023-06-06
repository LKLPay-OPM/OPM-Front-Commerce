export function getMonthName(month) {
  const monthsArray = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return monthsArray[month];
}

export const dateToLocalString = (string) => {
  var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
  const extractMonth = string.replace(pattern, "$2");
  const month = getMonthName(Number(extractMonth) - 1);
  let str = string.replace(pattern, `$3 de ${month} del 20$1`);
  return str;
};
export const dateToLocalStringShort = (string) => {
  var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
  const extractMonth = string.replace(pattern, "$2");
  const month = getMonthName(Number(extractMonth) - 1);
  let str = string.replace(pattern, `$3 de ${month}`);
  return str;
};
export const timeToLocalString = (string) => {
  var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
  let str = string.replace(pattern, `a las $1:$2`);
  return str;
};