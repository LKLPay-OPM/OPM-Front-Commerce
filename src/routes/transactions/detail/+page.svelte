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
  /* constants */
  import { localeParam } from "$lib/constants/locale.js";
  /* stores */
  import { previousPage } from "$lib/stores";

  import { onMount } from "svelte";

  export let data;
  let transaction = data?.response;
  let cardIcon = "";
  let modalClarification;
  let clarification = {
    ticket: "",
    description: "",
  };

  $: {
    console.log(transaction);
    // console.log(previousPage);
  }
  const returnToPreviousPage = () => {
    // console.log($previousPage);
    // goto($previousPage);
    history.back();
  };

  const showModal = (option) => {
    option.show();
  };
  const closeModal = (option) => {
    option.closeModal();
  };
  const handleClarification = () => {
    console.log(clarification);
  };
  onMount(async () => {
    console.log($previousPage);
  });
</script>

<Modal className={`modal-medium`} wrapperClass={"text-area-wrapper"} bind:this={modalClarification}>
  <div slot="header">
    <p>Solicitar Aclaración</p>
  </div>
  <div slot="content">
    <div class="clarifications">
      <div class="title">Recibo N°</div>
      <div class="description">
        <p>{clarification.ticket}</p>
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
      on:click={closeModal(modalClarification)}
      label="Cerrar"
      id="buttonCloseModalClarification"
      type="button"
      className="btn-plain"
      icon=""
    />
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

<div class="return">
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
    <b>Recibo #{transaction["Transaction Time"]}</b>
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
        <p>{transaction?.TVR}</p>
      </div>
      <div class="item">
        <b>AID</b>
        <p>{transaction["Terminal Capabilities"]}</p>
      </div>
      <div class="item">
        <b>TSI</b>
        <p>{transaction["Additional Terminal Capabilities"]}</p>
      </div>
      <div class="item">
        <b>Tipo de Tarjeta</b>
        <p>{getCardBrand(transaction["Application PAN"])}</p>
      </div>
    </div>
    <div class="details-center">
      <div class="details-card">
        <div class="details-card__top">
          <b>Detalle de Venta</b>
        </div>
        <div class="details-card__middle">
          <div class="item">
            <div class="item__title">
              <b>Tarjeta Utilizada</b>
            </div>
            <div class="item__content">
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
              {#if getCardBrand(transaction["Application PAN"]) === "MASTERCARD"}
                <p><Icons name="mastercard" width="24" height="24" /></p>
              {:else if getCardBrand(transaction["Application PAN"]) === "VISA"}
                <Icons name="visa" width="50" height="30" />
              {:else if getCardBrand(transaction["Application PAN"]) === "AMEX"}
                <Icons name="amex" width="25" height="25" />
              {:else if getCardBrand(transaction["Application PAN"]) !== "MASTERCARD" || getCardBrand(transaction["Application PAN"]) !== "VISA" || getCardBrand(transaction["Application PAN"]) !== "AMEX"}
                <Icons name="bank-card-line" width="25" height="25" />
              {/if}
            </div>
          </div>
          <div class="item">
            <div class="item__title">
              <b>Total de la Venta</b>
            </div>
            <div class="item__content">
              <p>
                {(transaction.Amount / 100)?.toLocaleString(localeParam.language, localeParam.currency)}
              </p>
            </div>
          </div>
        </div>
        <div class="details-card__bottom">
          <div class="item">
            <div class="item__title">
              <b>Estatus</b>
            </div>
            <div class="item__content">
              <p>APROBADA</p>
            </div>
          </div>
          <div class="item">
            <div class="item__title">
              <b>Comisión</b>
            </div>
            <div class="item__content">
              <p>
                {((transaction.Amount / 100) * 0.035)?.toLocaleString(localeParam.language, localeParam.currency)}
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
                {((transaction.Amount / 100) * 0.035 * 0.16)?.toLocaleString(
                  localeParam.language,
                  localeParam.currency
                )}
              </p>
              <p>{`(16%)`}</p>
            </div>
            <span />
          </div>
          <div class="item">
            <div class="item__title">
              <b>Total a Depositar</b>
            </div>
            <div class="item__content">
              <p>
                {((transaction.Amount / 100) * 0.965)?.toLocaleString(localeParam.language, localeParam.currency)}
              </p>
            </div>
            <span />
          </div>
        </div>
      </div>
      <div class="card-buttons">
        <div class="reverse-button">
          <Input
            on:click={() => (clarification.ticket = transaction["Transaction Time"])}
            on:click={showModal(modalClarification)}
            label="Aclaración"
            id="reverseTransaction"
            type="button"
            className="btn-plain"
            icon=""
          />
        </div>
        <div class="email-button">
          <Input label="Enviar por e-mail" id="emailTransaction" type="button" className="btn-plain" icon="" />
        </div>
        <div class="print-button">
          <Input label="Imprimir Recibo" id="printTransaction" type="button" className="btn-plain" icon="" />
        </div>
      </div>
    </div>
    <div class="details-right responsive">
      <div class="title">Reportes</div>
      <div class="export-buttons">
        <Input label="" id="csv-export" type="button" className="btn-plain fill-blue btn-square " icon="csv-fill" />
        <Input label="" id="excel-export" type="button" className="btn-plain fill-green btn-square " icon="xls-fill" />
        <Input label="" id="pdf-export" type="button" className="btn-plain fill-red btn-square " icon="pdf-fill" />
      </div>
    </div>
  </div>
</div>
<style lang="scss">
  @import 'src/lib/styles/transactions.scss';
</style>