/* svelte */
import { browser } from "$app/environment";
import { toastMsg, toastType, toastShown } from "$lib/stores";
/* utils */
import { errorCustomMsgToast, successCustomMsgToast } from "$lib/utils/toast.js";
import Toast from "$lib/components/Toast.svelte";
export function copyLinkToClipboard(data, id) {
  if (browser) {
    try {
      navigator.clipboard.writeText(`${data.value}`);
      /* toastMsg.update(() => "Enlace copiado con éxito");
      toastType.update(() => "error");
      toastShown.update(() => true); */
      successCustomMsgToast(`Enlace copiado con éxito`, id);
      // <Toast toastType="error" text={"Enlace copiado con éxito"} />;
    } catch (err) {
      try {
        const area = data;
        area.select();
        document.execCommand("copy");
        /* toastMsg.update(() => "Enlace copiado con éxito");
        toastType.update(() => "error");
        toastShown.update(() => true); */
        // <Toast toastType="error" text={"Enlace copiado con éxito"} />;
        successCustomMsgToast(`Enlace copiado con éxito`, id);
      } catch (error) {
        console.error(err);
        errorCustomMsgToast(`Ocurrió un error al copiar el enlace`);
      }
    }
  }
}
