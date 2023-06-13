<script>
  /* svelte */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { isLoggedIn, linkSelected } from "$lib/stores";
  /* components */
  import Loader from "$lib/components/Loader.svelte";
  import Dashboard from "$lib/components/Dashboard.svelte";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Input from "$lib/components/Input.svelte";
  import FileInput from "$lib/components/inputs/FileInput.svelte";
  /* utils */
  import { checkFileSize } from "$lib/utils/validations.js";

  export let data;

  /* dynamic vars */
  let loading = true;
  let user = data?.user;
  let modalUserData;

  let modalValidation = user?.name || user?.clabe;
  let userData = {
    name: "",
    firstLastName: "",
    secondLastName: "",
    ineBack: "",
    ineFront: "",
    clabe: "",
    bankStatement: "",
  };

  const handleUpdate = () => {};

  const openModal = (option) => {
    option.show();
  };

  const closeModal = (option) => {
    option.closeModal();
  };

  onMount(async () => {
    if (!$isLoggedIn) await goto("/login");
    loading = false;
    $linkSelected = "Inicio";
    if (!modalValidation) {
      modalUserData.show();
    }
  });
</script>

<!-- MODAL UPDATE USER DATA -->
<Modal className={`modal-medium`} bind:this={modalUserData}>
  <div slot="header">
    <p>No olvides completar tus datos</p>
  </div>
  <div slot="content">
    <div class="element">
      <div class="row">
        <Input
          placeholder="Nombre"
          label="Nombre (s)"
          id="name"
          bind:value={userData.name}
          className="txt-field-slim normal blue"
          type="text"
        />
      </div>
      <div class="row">
        <Input
          placeholder="Primer Apellido"
          label="Primer Apellido"
          id="firstLastName"
          bind:value={userData.firstLastName}
          className="txt-field-slim normal blue"
          type="text"
        />
        <Input
          placeholder="Segundo Apellido"
          label="Segundo Apellido"
          id="secondLastName"
          bind:value={userData.secondLastName}
          className="txt-field-slim normal blue"
          type="text"
        />
      </div>
      <div style="margin: 1rem 0 0 0;" class="row">
        <FileInput
          label="INE Frente"
          id="IneFront"
          bind:file={userData.ineFront}
          className={`btn-plain ${
            userData.ineFront === "" ? "" : checkFileSize(userData.ineFront) ? "btn-success" : "border-btn-error"
          }`}
          accept="image/jpeg, image/png, application/pdf"
        />
        <FileInput
          label="INE Vuelta"
          id="IneBack"
          bind:file={userData.ineBack}
          className={`btn-plain ${
            userData.ineBack === "" ? "" : checkFileSize(userData.ineBack) ? "btn-success" : "border-btn-error"
          }`}
          accept="image/jpeg, image/png, application/pdf"
        />
      </div>
      <div class="row">
        <Input
          placeholder="CLABE"
          label="CLABE"
          id="CLABE"
          bind:value={userData.clabe}
          className="txt-field-slim normal blue"
          type="text"
        />
      </div>
      <div style="margin: 1rem 0 0 0;" class="row">
        <FileInput
          label="Estado de Cuenta"
          id="bankStatement"
          bind:file={userData.bankStatement}
          className={`btn-plain ${
            userData.bankStatement === ""
              ? ""
              : checkFileSize(userData.bankStatement)
              ? "btn-success"
              : "border-btn-error"
          }`}
          accept="application/pdf"
        />
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={() => handleUpdate()}
      on:click={modalUserData.closeModal()}
      label="Enviar Cambio"
      id="buttonSaveModalName"
      type="button"
      className={`
        ${
          userData.name != "" &&
          userData.firstLastName != "" &&
          userData.ineFront != "" &&
          userData.ineBack != "" &&
          checkFileSize(userData.ineFront) &&
          checkFileSize(userData.ineBack)
            ? "btn"
            : "btn-plain disabled"
        }`}
      icon=""
    />
  </div>
</Modal>

{#if $isLoggedIn}
  {#if loading}
    <Loader />
  {:else}
    <Dashboard bind:data />
  {/if}
{:else}
  <RedirectLogin />
{/if}

<style lang="scss">
  .row {
    display: grid;
    grid-auto-flow: column;
    gap: 1rem;
  }

  .modal-buttons {
    width: 70%;
    height: 2.5rem; /* 40px */
    display: flex;
    justify-content: center;
    flex-direction: row;
    gap: 1rem;
  }
</style>
