<script>
  /* lib */
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";
  import { invalidateAll } from "$app/navigation";
  /* components */
  import Loader from "$lib/components/Loader.svelte";
  import SimpleButton from "$lib/components/buttons/Simple.svelte";
  import TextNumberInput from "$lib/components/inputs/TextNumberInput.svelte";
  /* repos */
  import { profilesClient } from "$lib/repos/axios";
  /* handlers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";
  /* utils */
  import { errorCustomMsgToast, successCustomMsgToast } from "$lib/utils/toast";

  /* props */
  export let data;

  /**
   * @type {boolean}
   */
  let loading = true;
  /**
   * @type {boolean}
   */
  let buttonLoading = false;

  let settings = {
    tpvPasscode: data.settings.tpvPasscode ?? "",
  };

  let errors = {
    tpvPasscode: null,
  };

  const runValidations = () => {
    let hasErrors = false;
    if (typeof settings.tpvPasscode === "undefined" || settings.tpvPasscode.length !== 6) {
      errors.tpvPasscode = "La longitud debe de ser de 6 dígitos";
      hasErrors = true;
    }
    return hasErrors
  };

  const resetErrors = () => {
    errors = {
      tpvPasscode: null,
    };
  };

  const sendData = async () => {
    buttonLoading = true;
    resetErrors();
    try {
      const hasErrors = runValidations();
      if (hasErrors) throw new error(400, "Error de validaciones");
      await profilesClient.patch("/user/updateProfile", settings);
      successCustomMsgToast(`Configuración guardada correctamente`);
      await invalidateAll();
    } catch (e) {
      console.error(e);
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    } finally {
      buttonLoading = false;
    }
  };

  onMount(() => {
    loading = false;
  });
</script>

{#if loading}
  <Loader />
{:else}
  <section class="container">
    <h2>Configuración</h2>
    <div class="settings-inputs">
      <div>
        <TextNumberInput
          className="simple left"
          name="tpvPasscode"
          bind:value={settings.tpvPasscode}
          label="Contraseña para la TPV"
          placeholder="Ej. 123456"
        />
        {#if errors.tpvPasscode !== null}
          <small class="error-input">{errors.tpvPasscode}</small>
        {/if}
      </div>
    </div>
    <div>
      <SimpleButton loading={buttonLoading} on:click={sendData}>Guardar</SimpleButton>
    </div>
  </section>
{/if}

<style lang="scss">
  .container {
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h2 {
    color: $primary-dark;
    font-size: 1.5rem;
  }

  .settings-inputs {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
    margin-top: 1rem;
  }

  .error-input {
    color: $red;
  }
</style>
