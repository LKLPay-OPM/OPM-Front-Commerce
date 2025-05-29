<script>
  /* components */
  import Input from "$lib/components/Input.svelte";
  import Icons from "$lib/components/Icons.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import Map from "$lib/components/Map.svelte";
  /* utils */
  import { dateToLocalString, timeToLocalString } from "$lib/utils/date.js";
  import { getCardBrand } from "$lib/utils/brands.js";
  import {
    successCustomMsgToast,
    errorCustomMsgToast,
  } from "$lib/utils/toast.js";
  import { copyLinkToClipboard } from "$lib/utils/copyToClipboard.js";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  /* svelte */
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";
  import { axiosFraudPreventionManagementJSON } from "$lib/repos/axios";
  /* controllers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";
  import {
    transactionStatus,
    transactionCancelValidation,
    transactionRefundValidation,
  } from "$lib/handlers/transaction-status.handler";
  /* utils */
  import { formatCardType } from "$lib/utils/format.js";
  import { getTransactionIconStatus } from "$lib/utils/iconClass.js";

  export let data;
  let transaction = data?.response;
  let cardIcon = "";
  let modalClarification;
  let cancelModal;
  let refundModal;
  let modalCancel;
  let link;
  let loading = false;
  let transparent = false;
  let clarification = {
    transaction: transaction._id,
    description: "",
  };

  let cancelData = {
    amount: "",
    url: "",
    description: "",
    email: "",
  };

  let cancel = {
    amount: data?.response?.Amount,
    ["SIC Code"]: data?.response?.["SIC Code"],
    ["Application PAN"]: data?.response?.["Application PAN"],
    expirationDate: "",
    ["ID Transaction"]: data?.response?.["ID Transaction"],
    ["ID Afiliate"]: data?.response?.["ID Afiliate"],
    ["Afiliate Number"]: data?.response?.["Afiliate Number"],
    ["ID Aggregator"]: data?.response?.["ID Aggregator"],
    authorization: data?.response?.authorization,
    POS: data?.response?.POS,
    ["ID Terminal"]: data?.response?.["ID Terminal"],
    originalElements: data?.response?.originalElements,
    email: data?.response?.["Cardholder Email"],
    ["Cardholder Name"]: data?.response?.["Cardholder Name"],
    ["Cardholder Phone"]: data?.response?.["Cardholder Phone"],
    ["Transaction Date"]: data?.response?.["Transaction Date"],
    ["Transaction Time"]: data?.response?.["Transaction Time"],
    ["Points BBVA"]: data?.response?.["Points BBVA"],
    MSI: data?.response?.MSI,
    commerce: data?.response?.commerce,
    commerceName: data?.response?.commerceName ?? "",
    /* For the later version */
    description: "Link de Cancelación",
    transactionId: data?.response?.transaction,
  };

  const returnToPreviousPage = () => {
    history.back();
  };

  const showModal = (option) => {
    option.show();
  };
  const closeModal = (option) => {
    option.closeModal();
  };
  /* Función cancelar transacción */
  const cancelTransaction = async () => {
    cancelModal.closeModal();
    loading = true;
    try {
      const response = await axiosFraudPreventionManagementJSON.post(
        `/link/cancel`,
        cancel,
      );
      cancelData = {
        amount: response?.data?.response?.amount,
        url: response?.data?.response?.url,
        description: response?.data?.response?.description,
        email: response?.data?.response?.email,
      };
      // formSuccess(link);
      modalCancel.show();
    } catch (err) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(err);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    } finally {
      loading = false;
    }
  };

  const getPercentage = (total, commission) => {
    return ((commission * 100) / total).toFixed(2);
  };

  const refundTransaction = async () => {
    console.log(data.response.transaction);
    loading = true;
    try {
      const response = await axiosFraudPreventionManagementJSON.post(
        `/e/refund`,
        {
          transactionId: data.response.transaction,
          // card: data.response["Application PAN"],
        },
      );
      refundModal.closeModal();
      successCustomMsgToast(`La devolución se realizó con éxito`);
    } catch (err) {
      console.log("refundTransaction:", err);
      refundModal.closeModal();
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(err);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    } finally {
      loading = false;
    }
  };

  const removeBackdrop = async () => {
    transparent = true;
    setTimeout(() => {
      transparent = false;
    }, 3000);
  };
</script>

<!-- Modal Cancel -->
<Modal
  id="modalCancelLinkData"
  bind:transparent
  className={`modal-small`}
  bind:this={modalCancel}
>
  <div slot="header">
    <div class="svg">
      <p>Datos de Cancelación</p>
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
            <input
              type="button"
              id="copy"
              name="copy"
              on:click={copyLinkToClipboard(link, "modalCancelLinkData")}
            />
          </div>
        </span>
        <textarea readonly bind:this={link} id="link" name="link"
          >{cancelData.url}</textarea
        >
      </div>
      <div class="column-element">
        <span>Monto</span>
        <p>{currencyFormatLocal(cancelData.amount)}</p>
      </div>
      <div class="column-element">
        <span>Concepto</span>
        <p>{cancelData.description}</p>
      </div>
      <div class="column-element">
        <span>E-Mail</span>
        <p>{cancelData.email}</p>
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalCancel)}
      label="Cerrar"
      id="buttonCloseModalImmediateDepositPreference"
      type="button"
      className="btn-success"
      icon=""
    />
  </div>
</Modal>

<!-- Modal Confirm Cancel -->
<Modal
  id="modalConfirmCancel"
  bind:transparent
  className={`modal-small`}
  bind:this={cancelModal}
>
  <div slot="header">
    <div class="svg">
      <p>Cancelación</p>
    </div>
  </div>
  <div slot="content">
    <div class="thin-divider" />
    <div class="modal-content">
      <div class="column-element"></div>
      <div class="column-element">
        <p style="text-align:center;">
          ¿Deseas solicitar una cancelación de la transacción?
        </p>
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={cancelTransaction}
      label="Sí, aceptar"
      id="buttonAcceptModalConfirmCancel"
      type="button"
      className="btn-success"
      icon=""
    />
    <Input
      on:click={cancelModal.closeModal()}
      label="No, cerrar"
      id="buttonCloseModalConfirmCancel"
      type="button"
      className="border-btn-error"
      icon=""
    />
  </div>
</Modal>
<!-- Modal Confirm Refund -->
<Modal
  id="modalConfirmRefund"
  bind:transparent
  className={`modal-small`}
  bind:this={refundModal}
>
  <div slot="header">
    <div class="svg">
      <p>Devolución</p>
    </div>
  </div>
  <div slot="content">
    <div class="thin-divider" />
    <div class="modal-content">
      <div class="column-element"></div>
      <div class="column-element">
        <p style="text-align:center;">
          ¿Deseas solicitar una devolución de la transacción?
        </p>
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={refundTransaction}
      label="Sí, aceptar"
      id="buttonAcceptModalConfirmRefund"
      type="button"
      className="btn-success"
      icon=""
    />
    <Input
      on:click={refundModal.closeModal()}
      label="No, cerrar"
      id="buttonCloseModalConfirmRefund"
      type="button"
      className="border-btn-error"
      icon=""
    />
  </div>
</Modal>

{#if loading}
  <Loader />
{:else}
  <div class="return no-print">
    <Input
      on:click={returnToPreviousPage}
      label="Regresar"
      id="detailsReturnButton"
      type="button"
      className="btn-plain"
      icon=""
    />
  </div>
  <div class="transaction-details">
    <div class="details__top">
      <b>Recibo #{transaction["ID Transaction"]}</b>
      <b
        >{transaction.commerceName ? transaction.commerceName : ""}{transaction
          .branchInfo?.branchName
          ? ` - Sucursal ${transaction.branchInfo.branchName}`
          : ""}</b
      >
      <p>
        {dateToLocalString(transaction["Transaction Date"])}
        {timeToLocalString(transaction["Transaction Time"])}
      </p>
    </div>
    <div class="details__middle">
      <div class="details-left responsive">
        <div class="section">
          <div class="title">Datos</div>
          <div class="item">
            <b>Referencia</b>
            <p>{transaction.reference ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>TVR</b>
            <p>{transaction["ID Terminal"] ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>AID</b>
            <p>{transaction["Terminal Capabilities"] ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>Autorización</b>
            <p>{transaction.authorization ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>Tipo de Tarjeta</b>
            <p>{transaction.scheme?.toUpperCase() ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>Estaus</b>
            <p>
              {getTransactionIconStatus(transaction.transactionStatus) ?? "N/A"}
            </p>
          </div>
          <div class="item">
            <b>Medio de Pago</b>
            <p>
              <i class="icon tooltip">
                <Icons
                  name={transaction.type === "tpv"
                    ? "terminal"
                    : transaction.type === "e-commerce"
                      ? "qr-code"
                      : "terminal"}
                  width="24"
                  height="24"
                />
                <span class="tooltiptext"
                  >{transaction.type === "tpv"
                    ? "Terminal Punto de Venta"
                    : transaction.type === "e-commerce"
                      ? "Link de Pago"
                      : ""}</span
                >
              </i>
            </p>
          </div>
        </div>
      </div>
      <div class="details-center">
        <div class={`details-card ${transaction.scheme.replace(/ /g, "")}`}>
          <div class="details-card__top">
            <b>Detalle de Venta</b>
          </div>
          <div class="details-card__middle">
            <div class="item">
              <div class="item__title">
                <b>Tarjeta Utilizada</b>
              </div>
              <div class="item__content first">
                <p>
                  <span
                    >{`${transaction["Application PAN"].substr(0, 4)} ${transaction[
                      "Application PAN"
                    ].substr(
                      4,
                      2,
                    )}** **** ${transaction["Application PAN"].substr(-4)}`}</span
                  >
                </p>
              </div>
            </div>
            <div class="item">
              <div class="item__title">
                <b>Tipo de Tarjeta</b>
              </div>
              <div class="item__content">
                <p>
                  <Icons
                    name={`${getCardBrand(transaction.scheme).toLowerCase()}`}
                    width="32"
                    height="32"
                  />
                </p>
              </div>
            </div>
            <div class="item">
              <div class="item__title">
                <b>Total de la Venta</b>
              </div>
              <div class="item__content last">
                <p>
                  <span>
                    {currencyFormatLocal(transaction.Amount)}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="details-card__bottom">
            <div class="item">
              <div class="item__title">
                <b>Estatus</b>
              </div>
              <div class="item__content first">
                <p>{transactionStatus(transaction.transactionStatus)}</p>
              </div>
            </div>
            <div class="item">
              <div class="item__title">
                <b>Comisión</b>
              </div>
              <div class="item__content">
                <p>
                  {currencyFormatLocal(
                    transaction.comission + transaction.fixedComission,
                  )}
                </p>
                {#if transaction.type === "e-commerce"}
                  <p>
                    {`(${getPercentage(transaction.Amount, transaction.comission)}% + ${currencyFormatLocal(
                      transaction.fixedComission,
                    )})`}
                  </p>
                {:else}
                  <p>
                    {`(${getPercentage(transaction.Amount, transaction.comission)}%)`}
                  </p>
                {/if}
              </div>
            </div>
            <div class="item">
              <div class="item__title">
                <b>IVA</b>
              </div>
              <div class="item__content">
                <p>
                  {currencyFormatLocal(transaction.iva)}
                </p>
                <p>{`(16%)`}</p>
              </div>
              <span />
            </div>
            <div class="item">
              <div class="item__title">
                <b>Total a Depositar</b>
              </div>
              <div class="item__content last">
                <p>
                  {currencyFormatLocal(transaction.toDeposit)}
                </p>
              </div>
              <span />
            </div>
          </div>
        </div>
      </div>
      <div class="details-right responsive">
        <div class="section">
          <div class="title">Relevante</div>
          <div class="item">
            <b>Código de Respuesta</b>
            <p>{transaction["ISO CODE RESPONSE"] ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>Descripción</b>
            <p>{transaction["ISO CODE DESCRIPTION"] ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>ID Agregador</b>
            <p>{transaction["ID Aggregator"] ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>ID Afiliado</b>
            <p>{transaction["ID Afiliate"] ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>Institución</b>
            <p>{transaction.bank.toUpperCase() ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>Procesador</b>
            <p>{transaction.processor.toUpperCase() ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>Tipo</b>
            <p>{formatCardType(transaction["Card Type"]) ?? "N/A"}</p>
          </div>
          <div class="item">
            <b>Marca</b>
            <p>{transaction.bankProduct.toUpperCase() ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="details__bottom">
      <div class="container__map">
        <Map lat={transaction.latitude} lon={transaction.longitude} />
      </div>
      <div class="card-buttons no-print">
        {#if transactionCancelValidation(transaction.transactionStatus, transaction["Transaction Date"], transaction.type)}
          <div class="reverse-button">
            <Input
              on:click={cancelModal.show()}
              label="Cancelar"
              id="reverseTransaction"
              type="button"
              className="border-btn-error"
              icon=""
            />
          </div>
        {:else if transactionRefundValidation(transaction.transactionStatus, transaction["Transaction Date"], transaction.type)}
          <div class="reverse-button">
            <Input
              on:click={refundModal.show()}
              label="Devolución"
              id="refundTransaction"
              type="button"
              className="border-btn-error"
              icon=""
            />
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @import "src/lib/styles/transactions/detail.scss";

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
  .details__bottom {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    .card-buttons {
      width: 100%;
      height: 2.5rem; /* 40px */
      display: flex;
      margin-top: 2rem; /* 32px */
      gap: 1rem; /* 16px */
      justify-content: center;
      .reverse-button {
        display: flex;
        width: 6rem; /* 80px */
      }
      .clarification-button {
        display: flex;
        width: 6rem; /* 80px */
      }
      .email-button {
        display: flex;
        width: 7.5rem; /* 120px */
      }
      .print-button {
        display: flex;
        width: 7.5rem; /* 120px */
      }
    }

    .container__map {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
  }

  .icon {
    color: $grey;
    &.tooltip {
      position: relative;
      font-weight: 500;
      font-size: 0.8125rem;
      line-height: 1.25rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      .tooltiptext {
        visibility: hidden;
        width: fit-content;
        background-color: #555;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 5px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 280%;
        margin-left: -100px;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .tooltiptext::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
      }
      &:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
      }
    }
  }
</style>
