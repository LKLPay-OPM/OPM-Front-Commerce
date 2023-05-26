/* consts */
import { emailPattern, passwordPattern } from "$lib/constants/pattern";

export const checkFileSize = (file) => {
  var size = file.size / 1024 / 1024;
  const isValid = size < 5
  return isValid;
};

export function validateEmail(text = "") {
  if (text.match(emailPattern)) return true;
  return false;
}

export function validatePassword(text = "") {
  if (text.match(passwordPattern)) return true;
  return false;
}

export function onlyDecimals(e){
  const valor = e.target.value;
  return e.target.value = valor.replace(/[^0-9]/g, '');
}