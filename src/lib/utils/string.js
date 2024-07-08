/* utils */
import { getStringDate, parseSlashDate } from "$lib/utils/date";

/**
 * Función para contar texto y agregar 3 puntos al final
 * @param {string} text
 * @param {number} end
 */
export function cutString(text, end) {
  if (text.length <= end) {
    return text;
  }
  return `${text.slice(0, end)}...`;
}

export function cutEmail(email) {
  const regex = new RegExp(".*(?=[@])");
  return email.match(regex);
}

export function createFilterUrl(str) {
  // console.log(str)
  // {active, dateRangeStart, dateRangeEnd, idTicket, paginationStart, paginationEnd, cardBrand, type, branch, terminal, status}
  // let string = `/transactions/${str.active}?filter=${str.active}`
  let string = "";
  if(str.startDate) string += `&startDate=${getStringDate(new Date(parseSlashDate(str.startDate)))}`;
  if(str.endDate) string += `&endDate=${getStringDate(new Date(parseSlashDate(str.endDate)))}`;
  if(str.idTicket) string += `&search=${str.idTicket}`;
  if(str.cardBrand) string += `&brand=${str.cardBrand}`;
  if(str.type && str.type != "all") string += `&type=${str.type}`;
  if(str.branch && str.branch != "all") string += `&branch=${str.branch}`;
  if(str.terminal && str.terminal != "all") string += `&terminal=${str.terminal}`;
  if(str.status && str.status != "all") string += `&status=${str.status}`;
  if(str.paginationStart) string += `&start=${str.paginationStart}&end=${str.paginationEnd}`;

  // console.log(string)
  return string;
}
