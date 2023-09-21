<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import Input from "$lib/components/Input.svelte";
  /* repos */
  import { ticketsClient } from "$lib/repos/axios";
  /* utils */
  import {
    errorCustomMsgToast,
    successCustomMsgToast,
  } from "$lib/utils/toast.js";
  /* controllers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";

  export let optionSelected;
  let modalSupport;
  let supportDetails = {
    // user: $loggedInUser.uid,
    description: "",
  };

  const handleSupportRequest = async () => {
    try {
      const response = await ticketsClient.post(
        `/ticket/support`,
        supportDetails
      );
      supportDetails.description = "";
      successCustomMsgToast("Tu petición de soporte técnico ha sido realizada");
    } catch (e) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };

  const showModal = (option) => {
    option.show();
  };

  const closeModal = (option) => {
    option.closeModal();
  };
</script>

<!-- MODAL SUPPORT -->
<Modal className={`modal-medium`} bind:this={modalSupport}>
  <div slot="header">
    <p>Solicitar Asistencia y Soporte</p>
  </div>
  <div slot="content">
    <div class="support">
      <div class="title">
        Describa su problema a continuación, o comuníquese al 800 12341 5672
        para una atención personalizada
      </div>
      <div class="description">
        <p />
      </div>
    </div>
    <div class="support-description">
      <TextArea
        bind:value={supportDetails.description}
        label="Descripción"
        placeholder="¿Qué problema hay con esta transacción?"
        id="supportDescription"
        name="supportDescription"
      />
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalSupport)}
      label="Cerrar"
      id="buttonCloseModalSupport"
      type="button"
      className="btn-plain"
      icon=""
    />
    <Input
      on:click={closeModal(modalSupport)}
      on:click={() => handleSupportRequest()}
      label="Enviar Solicitud"
      id="buttonSaveModalSupport"
      type="button"
      className={`
        ${supportDetails.description != "" ? "btn" : "btn-plain disabled"}`}
      icon=""
    />
  </div>
</Modal>
<div class="element">
  <div
    on:click={showModal(modalSupport)}
    on:keypress={(e) => (e.key === "Enter" ? showModal(modalSupport) : "")}
    class={`option-col ${
      optionSelected === 3 ? "option-selected" : "clickable"
    }`}
  >
    <i>
      <Icons name="detailed-support" width="50" height="50" />
    </i>
    <div class="option-name">Solicitud de Soporte</div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/requests.scss";
</style>
