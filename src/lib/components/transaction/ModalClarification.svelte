<script>
  /* components */
  import Modal from "$lib/components/Modal.svelte";
  import Select from "$lib/components/Select.svelte";
  import Input from "$lib/components/Input.svelte";
  import TextArea from "$lib/components/TextArea.svelte";

  let modalClarification;

  let clarificationsList = [
    { name: "Opción 1", value: "option1" },
    { name: "Opción 2", value: "option2" },
    { name: "Opción 3", value: "option3" },
    { name: "Opción 4", value: "option4" },
  ];

  let clarification = {
    type: "",
    description: "",
  };

  function showModal(option) {
    option.show();
  }

  function closeModal(option) {
    option.closeModal();
  }

  function handleClarification() {
    console.log("this button is working");
  }
</script>

<Modal
  className={`modal-medium`}
  wrapperClass={"text-area-wrapper"}
  bind:this={modalClarification}
>
  <div slot="header">
    <p>Solicitar Aclaración</p>
  </div>
  <div slot="content">
    <div class="clarifications-select">
      <Select
        bind:optionsList={clarificationsList}
        defaultText={"Elige una opción"}
        label="Tipo de Aclaración"
        id="clarificationType"
        bind:value={clarification.type}
      />
    </div>
    <div class="clarification-description">
      <TextArea
        bind:value={clarification.description}
        label="Descripción"
        placeholder="¿Qué problema hay con esta transacción?"
        id="clarificationDescription"
        name="clarificationDescription"
      />
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalClarification)}
      label="Cerrar"
      id="buttonCloseModalUrgentDeposit"
      type="button"
      className="btn-plain"
      icon=""
    />
    <Input
      on:click={closeModal(modalClarification)}
      on:click={() => handleClarification()}
      label="Enviar Aclaración"
      id="buttonSaveModalUrgentDeposit"
      type="button"
      className={`btn-plain
        ${clarification.description != "" ? "" : "disabled"}`}
      icon=""
    />
  </div>
</Modal>

<style></style>
