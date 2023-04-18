<script>
  /* components */
  import Icons from '$lib/components/Icons.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import TextArea from '$lib/components/TextArea.svelte';
  import Input from '$lib/components/Input.svelte';

  export let optionSelected;
  export let submenu;
  let modalSupport;
  let supportDetails = {
    // user: $loggedInUser.uid,
    description: "",
  };

  const showModal = (option) => {
    option.show();
  };

  const closeModal = (option) => {
    option.closeModal();
  };
</script>
<!-- MODAL SUPPORT -->
<Modal
  className={`modal-medium`}
  wrapperClass={"text-area-wrapper"}
  bind:this={modalSupport}
>
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
<div
  class="element"
  class:hidden={optionSelected !== 0 && optionSelected !== 2}
>
  <i
    class="arrow-blue"
    class:hidden={optionSelected == 0}
    on:click={() => (optionSelected = 0)}
    on:keypress={(e) => (e.key === "Enter" ? (optionSelected = 0) : "")}
  >
    <Icons name="arrow-bwd" width="24" height="24" />
  </i>
  <div
    on:click={showModal(modalSupport)}
    on:keypress={(e) =>
      e.key === "Enter" ? showModal(modalSupport) : ""}
    class={`option-col ${
      optionSelected === 2 ? "option-selected" : ""
    }`}
  >
    <i>
      <Icons name="detailed-support" width="100" height="100" />
    </i>
    <div class="option-name">Solicitud de Soporte</div>
  </div>
</div>
<style lang="scss">
  @import 'src/lib/styles/requests.scss';
</style>