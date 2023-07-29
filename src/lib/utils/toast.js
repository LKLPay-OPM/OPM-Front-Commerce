import Toastify from "toastify-js";
import { danger, success } from "$lib/constants/colors";

export const toast = (text, color, id) => {
  return Toastify({
    text,
    duration: 3000,
    close: false,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    selector: id,
    style: {
      background: color,
      color: "white",
    },
  });
};

export const tryAgainErrorToast = (id = "") => {
  toast("Ocurrió un error, intenta de nuevo", danger, id).showToast();
};

export const successCustomMsgToast = (msg, id = "") => {
  toast(msg, success, id).showToast();
};
export const errorCustomMsgToast = (msg, id = "") => {
  toast(msg, danger, id).showToast();
};
