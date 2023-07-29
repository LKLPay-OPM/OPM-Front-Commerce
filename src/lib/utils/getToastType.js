/* utils */
import { errorCustomMsgToast, successCustomMsgToast, tryAgainErrorToast } from "$lib/utils/toast.js";

export const getToastType = (type, text) => {
  if (type === "error") {
    if (text != "") {
      errorCustomMsgToast(`${text}`);
    }
    tryAgainErrorToast();
  } else {
    successCustomMsgToast(`${text}`);
  }
};
