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
  let str = string.replace(pattern, `$1:$2`);
  return str;
};

function getTimeEllapsed(time) {
  const formatter = new Intl.RelativeTimeFormat("es-MX");

  console.log(time);
  if (time < 60) {
    return "Hace un momento";
  }
  if (time < 3600) {
    const minutes = Math.floor(time / 60);
    return formatter.format(minutes * -1, "minute");
  }
  if (time < 86400) {
    const hours = Math.floor(time / 3600);
    return formatter.format(hours * -1, "hour");
  }
  if (time < 604800) {
    const days = Math.floor(time / 86400);
    return formatter.format(days * -1, "day");
  }
  const weeks = Math.floor(time / 604800);
  return formatter.format(weeks * -1, "week");
}

/**
 * Formatear la fecha a "Hace un momento", "Hace un mes", etc
 * @param {Date} date
 */
export function getPastRelativeTime(date) {
  const current = new Date();
  const difference = current - date;
  const calc = Math.floor(difference / 1000);
  return getTimeEllapsed(calc);
}

export function getDayFromDateString(string) {
  return string.substr(-2);
}

export function validateSameDay(date) {
  const d = new Date();
  const today = d.getDate();
  if (today === Number(getDayFromDateString(date))) return true;
  else return false;
}
