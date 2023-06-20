/* consts */
import { emailPattern, passwordPattern } from "$lib/constants/pattern";

export function validateEmail(text = "") {
  if (text.match(emailPattern)) return true;
  return false;
}

export function validatePassword(text = "") {
  if (text.match(passwordPattern)) return true;
  return false;
}

export function selectText(input) {
  input.select();
};
