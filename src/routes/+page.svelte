<script>
  /* svelte */
  import { error } from "@sveltejs/kit";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { isLoggedIn, linkSelected, toastId } from "$lib/stores";
  /* components */
  import Loader from "$lib/components/Loader.svelte";
  import Dashboard from "$lib/components/Dashboard.svelte";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Input from "$lib/components/Input.svelte";
  import FileInput from "$lib/components/inputs/FileInput.svelte";
  /* utils */
  import { checkFileSize } from "$lib/utils/validations.js";
  import { tryAgainErrorToast, successCustomMsgToast } from "$lib/utils/toast.js";
  /* clients */
  import { profilesFormDataClient } from "$lib/repos/axios";
  /* handlers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler.js";

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

  const handleUpdate = async () => {
    let formData = new FormData();
    Object.keys({ ...userData }).forEach((key) => {
      formData.append(key, userData[key]);
    });
    try {
      $toastId = "";
      console.log(userData);
      const response = await profilesFormDataClient.patch(`/onboarding/aggregator`, formData);
      successCustomMsgToast("Tus datos se procesaron con éxito");
    } catch (e) {
      successCustomMsgToast("Ocurrió un error al procesar tus datos, intenta de nuevo más tarde");
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };

  const openModal = (option) => {
    option.show();
  };

  const closeModal = (option) => {
    option.closeModal();
  };

  onMount(async () => {
    if (!$isLoggedIn) {
      await goto("/login");
    } else {
      if (!modalValidation) {
        $toastId = "modalUserData";
        modalUserData.show();
      }
    }
    loading = false;
    $linkSelected = "Inicio";
  });
</script>

<!-- MODAL UPDATE USER DATA -->
<Modal id="modalUserData" className={`modal-medium`} bind:this={modalUserData}>
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
          label="Carátula de Estado de Cuenta"
          id="bankStatement"
          bind:file={userData.bankStatement}
          className={`btn-plain ${
            userData.bankStatement === ""
              ? ""
              : checkFileSize(userData.bankStatement)
              ? "btn-success"
              : "border-btn-error"
          }`}
          accept="image/jpeg, image/png, application/pdf"
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
          userData.bankStatement != "" &&
          checkFileSize(userData.ineFront) &&
          checkFileSize(userData.ineBack) &&
          checkFileSize(userData.bankStatement)
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
