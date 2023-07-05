/* constants */
import { localeParam } from "$lib/constants/locale";

export function currencyFormatLocal(amount) {
  return amount.toLocaleString(localeParam.language, localeParam.currency) + " " + localeParam.currency.currency;
}
