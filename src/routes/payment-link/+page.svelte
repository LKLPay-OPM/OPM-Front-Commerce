<script>
  /* stores */
  import { sessionUser } from "$lib/stores";
  /* components */
  import Input from "$lib/components/Input.svelte";
  import IconInput from "$lib/components/IconInput.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Icons from "$lib/components/Icons.svelte";
  /* utils */
  import { validateEmail } from "$lib/utils/input";
  import { tryAgainErrorToast, successCustomMsgToast, errorCustomMsgToast } from "$lib/utils/toast.js";
  import { formatDecimals } from "$lib/utils/format.js";
  import { copyLinkToClipboard } from "$lib/utils/copyToClipboard.js";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  /* controllers */
  import { ProfileController } from "$lib/controllers/profile/profile.controller";
  import { PaymentLinkController } from "$lib/controllers/payment-links/payment-link.controller";

  let token = $sessionUser?.token;
  let refreshToken = $sessionUser?.refreshToken;
  let modalPaymentLinkData;
  let link;
  let loading = false;
  let transparent = false;

  let input = {
    amount: 0,
    email: "",
    description: "",
  };

  let linkData = {
    amount: "",
    url: "",
    description: "",
    email: "",
  };

  $: validation = input.amount > 0 && validateEmail(input.email) != "";

  const formSuccess = (link) => {
    // successCustomMsgToast("Se ha generado el link de pago con éxito");
    linkData = {
      amount: link?.response?.amount ?? "",
      url: link?.response?.url ?? "",
      description: link?.response?.description ?? "",
      email: link?.response?.email ?? "",
    };

    input = {
      amount: 0,
      email: "",
      description: "",
    };
  };

  const showModal = (option) => {
    option.show();
  };

  const closeModal = (option) => {
    option.closeModal();
  };

  const generateLink = async () => {
    loading = true;
    try {
      const { response } = await ProfileController.getProfile();
      input.commerceName = response?.businessName ?? response?.name ?? "";
      const link = await PaymentLinkController.generate(input);
      formSuccess(link);
      showModal(modalPaymentLinkData);
    } catch (e) {
      tryAgainErrorToast();
    } finally {
      loading = false;
    }
  };
</script>

<Modal id="modalPaymentLinkData" className={`modal-small`} bind:this={modalPaymentLinkData}>
  <div slot="header">
    <div class="svg">
      <p>Recibo Generado</p>
      <span><Icons name="success-circle" width="24" height="24" /></span>
    </div>
  </div>
  <div slot="content">
    <div class="thin-divider" />
    <div class="modal-content">
      <div class="column-element">
        <span class="copy-link">
          Enlace
          <div class="copy-link__icon">
            <label for="copy">
              <Icons name="file-copy" width="16" height="16" />
            </label>
            <input type="button" id="copy" name="copy" on:click={copyLinkToClipboard(link, "modalPaymentLinkData")} />
          </div>
        </span>
        <textarea readonly bind:this={link} id="link" name="link">{linkData.url}</textarea>
      </div>
      <div class="column-element">
        <span>Monto</span>
        <p>{currencyFormatLocal(linkData.amount)}</p>
      </div>
      <div class="column-element">
        <span>Concepto</span>
        <p>{linkData.description}</p>
      </div>
      <div class="column-element">
        <span>E-Mail</span>
        <p>{linkData.email}</p>
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalPaymentLinkData)}
      label="Cerrar"
      id="buttonCloseModalImmediateDepositPreference"
      type="button"
      className="btn-success"
      icon=""
    />
  </div>
</Modal>

{#if loading}
  <Loader text="Generando Link de pago y QR, por favor espere..." />
{:else}
  <div class="container">
    <div class="description">
      <p>Genera un recibo y acepta pagos a distancia y sin tarjeta presente</p>
    </div>
    <div class="form-container">
      <div class="card-primary">
        <div class="description">
          <p>Ingresa los datos y genera un enlace</p>
        </div>
        <div class="divider-hor" />
        <form class="form" on:submit|preventDefault={generateLink}>
          <input type="hidden" id="token" name="token" value={token} />
          <input type="hidden" id="refreshToken" name="refreshToken" value={refreshToken} />
          <IconInput
            on:format={(value) => {
              if (value.detail.includes(".") && value.detail.match(/^[0-9]+(\.{1})?(([0-9]{3})?)$/g)) {
                input.amount = formatDecimals(Number(value.detail));
              }
            }}
            icon="dollar"
            label="Monto"
            id="amount"
            bind:value={input.amount}
            className="txt-field normal fill-blue"
            type="number"
            name="amount"
            min="0"
            step=".01"
            decimal={true}
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
              type={`${validation ? "submit" : "button"}`}
            />
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .svg {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    span {
      color: $secondary-dark;
    }
  }

  .thin-divider {
    width: 100%;
    border: 1px solid $grey;
    margin: 0 0 10px 0;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    .column-element {
      display: flex;
      flex-direction: column;
      margin: 0 0 10px 0;
      span {
        font-weight: 600;
        color: $primary-dark;
        font-size: 1.125rem;
        &.copy-link {
          display: flex;
        }
        .copy-link__icon {
          color: $primary-dark;
          label {
            cursor: pointer;
          }
          input {
            display: none;
          }
          &:hover {
            color: $primary-light;
          }
        }
      }
      p,
      textarea {
        font-weight: 400;
        color: $primary-dark;
        font-size: 0.875;
        word-wrap: break-word;
      }

      textarea {
        resize: none;
        border: none;
        outline: none;
        overflow: hidden;
        height: 3rem;

        &::selection {
          color: $primary-light;
          background: transparent;
        }
      }
    }
  }

  .modal-buttons {
    width: 100%;
    height: 2.5rem;
  }
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
      .card-primary {
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

  /* Dark Mode */
  :global(body.dark-mode) {
    .form-container {
      .card-primary {
        .description {
          p {
            color: $font-dark-primary;
          }
        }
      }
    }

    .container {
      .description {
        color: $font-dark-primary;
      }
    }

    .modal-content {
      .column-element {
        span {
          color: $font-dark-primary;
          .copy-link__icon {
            color: $font-dark-primary;
            &:hover {
              color: $primary-light;
            }
          }
        }
        p,
        textarea {
          color: $font-dark-primary;
          background: $background-dark-secondary;
          &::selection {
            color: $primary-light;
            background: transparent;
          }
        }
      }
    }
  }
</style>
