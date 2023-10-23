/* consts */
import { emailPattern, passwordPattern } from "$lib/constants/pattern";

export const checkFileSize = (file) => {
  if (!file?.size) return false;
  var size = file.size / 1024 / 1024;
  const isValid = size < 5;
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

export function onlyDecimals(e) {
  const valor = e.target.value;
  return (e.target.value = valor.replace(/[^0-9]/g, ""));
}

export function onlyNumbers(e) {
  const valor = e.target.value;
  return (e.target.value = valor.replace(/[^0-9]/g, ""));
}
export function ccValidation(e) {
  const inputValue = e.target.value.replace(/[^0-9]\b\s/g, ""); // se eliminan todos los espacios encontrados
  if (inputValue !== "") {
    const result = inputValue.match(/[^0-9].{1,4}/g).join(" "); // se agrega un espacio cada 4 caracteres y se usa join(" ") para quitar las comas
    e.target.value = result; // el valor del input será la cadena modificada
  }
  // const valor = e.target.value;
  // return e.target.value = valor.replace(/[^0-9]\s/g, '');
}

export function verifyStringLength(string, length) {
  return string.length === length;
}
