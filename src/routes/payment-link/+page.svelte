<script>
  /* svelte */
  import { enhance } from "$app/forms";
  /* stores */
  import { sessionUser } from "$lib/stores";
  /* components */
  import Input from "$lib/components/Input.svelte";
  import IconInput from "$lib/components/IconInput.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import Loader from "$lib/components/Loader.svelte";
  /* utils */
  import { validateEmail } from "$lib/utils/input-validation.js";
  import { tryAgainErrorToast, successCustomMsgToast } from "$lib/utils/toast.js";

  // export let form;
  // export let data;

  let token = $sessionUser?.token;
  let refreshToken = $sessionUser?.refreshToken;
  let loading = false;

  let input = {
    amount: 0,
    email: "",
    description: "",
  };

  $: validation = input.amount > 0 && validateEmail(input.email) != "";
  $: {
    // console.log(form, data)
  }

  const formSuccess = () => {
    successCustomMsgToast("Se ha generado el link de pago con éxito");
    input = {
      amount: 0,
      email: "",
      description: "",
    };
  };
</script>

{#if loading}
  <Loader text="Generando Link de pago y QR, por favor espere..." />
{:else}
  <div class="container">
    <div class="description">
      <p>Genera un recibo y acepta pagos a distancia y sin tarjeta presente</p>
    </div>
    <div class="form-container">
      <div class="card-container">
        <div class="description">
          <p>Ingresa los datos y genera un enlace</p>
        </div>
        <div class="divider-hor" />
        <form
          class="form"
          method="POST"
          use:enhance={({ form, data, action, cancel }) => {
            loading = true;
            return async ({ result }) => {
              // `result` is an `ActionResult` object
              if (result.type === "error") {
                loading = false;
                tryAgainErrorToast();
              } else {
                loading = false;
                formSuccess();
              }
            };
          }}
        >
          <input type="hidden" id="token" name="token" value={token} />
          <input type="hidden" id="refreshToken" name="refreshToken" value={refreshToken} />

          <IconInput
            icon="dollar"
            label="Monto"
            id="amount"
            bind:value={input.amount}
            className="txt-field normal fill-blue"
            type="number"
            name="amount"
            min="0"
          />
          <Input
            bind:value={input.email}
            label="Correo Electrónico"
            placeholder="email@dominio.com"
            id="email"
            className="txt-field normal fill-blue"
            type="text"
            name="email"
          />
          <TextArea
            bind:value={input.description}
            label="Concepto (Opcional)"
            placeholder="Describe el concepto de la transacción"
            id="description"
            name="description"
            className="fill-blue"
          />
          <div class="btn-layout">
            <Input
              label="Generar Enlace"
              id="btnGenerateLink"
              className={`${validation ? "btn-success" : "btn-plain disabled"}`}
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    .description {
      display: grid;
      justify-items: center;
      align-items: center;
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.25rem;
      color: $primary-dark;
      text-align: center;
      p {
        max-width: 15rem;
      }
    }
    .form-container {
      .card-container {
        .description {
          display: grid;
          justify-items: center;
          align-items: center;
          p {
            font-size: 1.25rem;
            text-align: center;
            font-weight: 700;
            line-height: 1.25rem;
            color: $primary-dark;
            padding: 1rem 0;
            max-width: 12rem;
          }
        }
      }
    }
  }
  .form-container {
    width: 100%;
    height: 100%;
    margin: 2rem 0;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .form {
    min-width: 20rem;
    padding: 1rem 1rem;
  }

  .btn-layout {
    display: flex;
    justify-content: center;
    height: 2.375rem;
    width: 100%;
    margin-bottom: 1.125rem;
    margin-top: 1.125rem;
  }
</style>
