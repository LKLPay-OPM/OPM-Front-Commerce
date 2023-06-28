/* utils */
import { errorCustomMsgToast, successCustomMsgToast } from "$lib/utils/toast.js";
export function copyLinkToClipboard(data) {
  try {
    navigator.clipboard.writeText(`${data.value}`);
    successCustomMsgToast(`Enlace copiado con éxito`);
  } catch (err) {
    try {
      const area = data;
      area.select();
      document.execCommand("copy");
      successCustomMsgToast(`Enlace copiado con éxito`);
    } catch (error) {
      console.error(err);
      errorCustomMsgToast(`Ocurrió un error al copiar el enlace`);
    }
  }
}
