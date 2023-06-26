<script>
  /* components */
  import Input from "$lib/components/Input.svelte";
  import Icons from "$lib/components/Icons.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  /* navigation */
  import { goto } from "$app/navigation";
  /* utils */
  import { dateToLocalString, timeToLocalString } from "$lib/utils/date.js";
  import { getCardBrand } from "$lib/utils/brands.js";
  import { successCustomMsgToast, errorCustomMsgToast } from "$lib/utils/toast.js";
  import { copyLinkToClipboard } from "$lib/utils/copyToClipboard.js";
  /* constants */
  import { localeParam } from "$lib/constants/locale.js";
  /* stores */
  import { previousPage } from "$lib/stores";
  /* svelte */
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";
  /* client */
  import { axiosDevicesClient, ticketsClient } from "$lib/repos/axios";
  /* controllers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";

  export let data;
  let transaction = data?.response;
  let cardIcon = "";
  let modalClarification;
  let modalCancel;
  let link;
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

  $: {
  }

  const returnToPreviousPage = () => {
    history.back();
  };

  const showModal = (option) => {
    option.show();
  };
  const closeModal = (option) => {
    option.closeModal();
  };
  const handleClarification = async () => {
    try {
      const response = await ticketsClient.post(`/ticket/clarification/transaction`, clarification);
      successCustomMsgToast(`Tu ticket de aclaración se ha generado con éxito`);
      return { ...response.data?.response };
    } catch (err) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(err);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };

  const sendTransactionByEmail = async () => {
    try {
      const response = await axiosDevicesClient.post(`/transaction/detail/${transaction._id}/email`);
      successCustomMsgToast(`Correo enviado con éxito a tu dirección asociada a Lkl Pay`);
      return { ...response.data?.response };
    } catch (err) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(err);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };

  const cancelTransaction = async () => {
    console.log(transaction);
    try {
      const response = await axiosFraudPreventionManagement.post(`/cancel`, { idTransaction: transaction.id });
      cancelData = {
        url: response?.data?.response?.url,
      };
    } catch (err) {
      console.log(err);
    }
  };

  onMount(async () => {});
</script>

<Modal className={`modal-medium`} bind:this={modalClarification}>
  <div slot="header">
    <p>Solicitar Aclaración</p>
  </div>
  <div slot="content">
    <div class="clarifications">
      <div class="title">Recibo N°</div>
      <div class="description">
        <p>{clarification.transaction}</p>
      </div>
      <!-- <Select bind:optionsList={clarificationsList} defaultText={"Elige una opción"} label="Tipo de Aclaración" id="clarificationType" bind:value={clarification.type}/> -->
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
      on:click={() => handleClarification()}
      on:click={closeModal(modalClarification)}
      label="Enviar Aclaración"
      id="buttonSaveModalClarification"
      type="button"
      className={`
        ${clarification.description != "" ? "btn" : "btn-plain disabled"}`}
      icon=""
    />
  </div>
</Modal>

<Modal className={`modal-small`} bind:this={modalCancel}>
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
            <input type="button" id="copy" name="copy" on:click={copyLinkToClipboard(link)} />
          </div>
        </span>
        <textarea readonly bind:this={link} id="link" name="link">{cancelData.url}</textarea>
      </div>
      <div class="column-element">
        <span>Monto</span>
        <p>{cancelData.amount.toLocaleString(localeParam.language, localeParam.currency)}</p>
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
      on:click={closeModal(modalPaymentcancelData)}
      label="Cerrar"
      id="buttonCloseModalImmediateDepositPreference"
      type="button"
      className="btn-success"
      icon=""
    />
  </div>
</Modal>

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
    <b>Recibo #{transaction._id}</b>
    <p>
      {dateToLocalString(transaction["Transaction Date"])}
      {timeToLocalString(transaction["Transaction Time"])}
    </p>
  </div>
  <div class="details__middle">
    <div class="details-left responsive">
      <div class="title">Datos</div>
      <div class="item">
        <b>Referencia</b>
        <p>{transaction["IFD Serial Number"]}</p>
      </div>
      <div class="item">
        <b>TVR</b>
        <p>{transaction?.TVR ?? "N/A"}</p>
      </div>
      <div class="item">
        <b>AID</b>
        <p>{transaction["Terminal Capabilities"] ?? "N/A"}</p>
      </div>
      <div class="item">
        <b>TSI</b>
        <p>{transaction["Additional Terminal Capabilities"] ?? "N/A"}</p>
      </div>
      <div class="item">
        <b>Tipo de Tarjeta</b>
        <p>{getCardBrand(transaction["Application PAN"])}</p>
      </div>
    </div>
    <div class="details-center">
      <div class={`details-card ${getCardBrand(transaction["Application PAN"]).toLowerCase()}`}>
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
                <span>{"**** **** **** " + transaction["Application PAN"].substr(-4)}</span>
              </p>
            </div>
          </div>
          <div class="item">
            <div class="item__title">
              <b>Tipo de Tarjeta</b>
            </div>
            <div class="item__content">
              <p>
                <Icons name={`${getCardBrand(transaction["Application PAN"]).toLowerCase()}`} width="24" height="24" />
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
                  {transaction.Amount?.toLocaleString(localeParam.language, localeParam.currency)}
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
              <p>APROBADA</p>
            </div>
          </div>
          <div class="item">
            <div class="item__title">
              <b>Comisión</b>
            </div>
            <div class="item__content">
              <p>
                {transaction.comission?.toLocaleString(localeParam.language, localeParam.currency)}
              </p>
              <p>{`(3.5%)`}</p>
            </div>
          </div>
          <div class="item">
            <div class="item__title">
              <b>IVA</b>
            </div>
            <div class="item__content">
              <p>
                {transaction.IVA?.toLocaleString(localeParam.language, localeParam.currency)}
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
                {transaction.deposit?.toLocaleString(localeParam.language, localeParam.currency)}
              </p>
            </div>
            <span />
          </div>
        </div>
      </div>
    </div>
    <div class="details-right no-print responsive">
      <div class="title">Reportes</div>
      <div class="export-buttons">
        <Input label="" id="csv-export" type="button" className="btn-plain fill-blue btn-square " icon="csv-fill" />
        <Input label="" id="excel-export" type="button" className="btn-plain fill-green btn-square " icon="xls-fill" />
        <Input label="" id="pdf-export" type="" className="btn-plain fill-red btn-square " icon="pdf-fill" />
      </div>
    </div>
  </div>
  <div class="details__bottom">
    <div class="card-buttons no-print">
      <div class="reverse-button">
        {#if transaction.type === "e-commerce"}
          <Input
            on:click={cancelTransaction}
            label="Cancelar"
            id="reverseTransaction"
            type="button"
            className="border-btn-error"
            icon=""
          />
        {/if}
      </div>
      <div class="clarification-button">
        <Input
          on:click={showModal(modalClarification)}
          label="Aclaración"
          id="transactionClarification"
          type="button"
          className="btn-plain"
          icon=""
        />
      </div>
      <div class="email-button">
        <Input
          on:click={sendTransactionByEmail}
          label="Enviar por e-mail"
          id="emailTransaction"
          type="button"
          className="btn-plain"
          icon=""
        />
      </div>
      <div class="print-button">
        <Input
          on:click={() => window.print()}
          label="Imprimir Recibo"
          id="printTransaction"
          type="button"
          className="btn-plain"
          icon=""
        />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/transactions/detail.scss";

  .details__bottom {
    width: 100%;
    // display: flex;
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
  }
</style>
