<script>
  /* svelte */
  import { error } from "@sveltejs/kit";
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
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import {
    successCustomMsgToast,
    errorCustomMsgToast,
  } from "$lib/utils/toast.js";
  /* stores */
  import { previousPage } from "$lib/stores";
  /* client */
  import { axiosDevicesClient } from "$lib/repos/axios";
  /* controllers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";

  import { onMount } from "svelte";

  export let data;
  let dispersion = data?.response;
  let cardIcon = "";
  let modalDetailClarification;
  let detailClarification = {
    ticket: "",
    description: "",
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
  const handleClarification = () => {};

  const sendDispersionByEmail = async () => {
    try {
      const response = await axiosDevicesClient.post(
        `/transaction/detail/${transaction._id}/email`
      );
      successCustomMsgToast(
        `Correo enviado con éxito a tu dirección asociada a Lkl Pay`
      );
      return { ...response.data?.response };
    } catch (e) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };

  const getPercentage = (total, commission) => {
    return ((commission * 100) / total).toFixed(2);
  };

  onMount(async () => {});
</script>

<!-- MODAL DISPERSION DETAIL CLARIFICATION -->
<Modal className={`modal-medium`} bind:this={modalDetailClarification}>
  <div slot="header">
    <p>Solicitar Aclaración</p>
  </div>
  <div slot="content">
    <div class="clarifications">
      <div class="title">Recibo N°</div>
      <div class="description">
        <p>{detailClarification.ticket}</p>
      </div>
    </div>
    <!-- <div class="clarifications-select">
      <Select bind:optionsList={clarificationsList} defaultText={"Elige una opción"} label="Tipo de Aclaración" id="clarificationDetailType" bind:value={detailClarification.type}/>
    </div> -->
    <div class="clarification-description">
      <TextArea
        bind:value={detailClarification.description}
        label="Descripción"
        placeholder="¿Qué problema hay con esta transacción?"
        id="clarificationDetailDescription"
        name="clarificationDescription"
      />
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalDetailClarification)}
      on:click={() => handleClarification()}
      label="Enviar Aclaración"
      id="buttonSaveModalDetailClarification"
      type="button"
      className={`${
        detailClarification.description != "" ? "btn" : "btn-plain disabled"
      }`}
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
<div class="dispersion-details">
  <div class="details__top">
    <b class="title">Recibo #{dispersion.id}</b>
    <p>
      <!-- a las {timeToLocalString(dispersion.time)} -->
      {dateToLocalString(dispersion.date)}
    </p>
  </div>
  <div class="details__middle">
    <div class="details-left hide">
      <div class="section">
        <div class="title">Datos</div>
        <div class="item">
          <b>Tipo de Depósito</b>
          <p style="text-transform:capitalize;">{dispersion.type ?? "N/A"}</p>
        </div>
        <div class="item">
          <b>Referencia</b>
          <p>{dispersion.reference ?? "N/A"}</p>
        </div>
        <div class="item">
          <b>Rastreo</b>
          <p>{dispersion.tracking ?? "N/A"}</p>
        </div>
      </div>
    </div>
    <div class="details-center">
      <div class="details-card card-primary">
        <div class="details-card__top">
          <b>Detalle de Depósito</b>
        </div>
        <div class="details-card__middle">
          <div class="item">
            <b>Cuenta CLABE</b>
            <p>{dispersion?.clabe}</p>
          </div>
          <div class="item">
            <b>Total Depositado</b>
            <p>
              {currencyFormatLocal(dispersion?.deposit)}
            </p>
          </div>
        </div>
        <div class="details-card__bottom">
          <div class="item">
            <b>Total Ventas</b>
            <p>
              {currencyFormatLocal(dispersion?.balance)}
            </p>
            <span />
          </div>
          <div class="item">
            <b>Comisión</b>
            <p>
              {currencyFormatLocal(dispersion?.comission)}
            </p>
            <span
              >{`(${getPercentage(
                dispersion.balance,
                dispersion.comission
              )}%)`}</span
            >
          </div>
          <div class="item">
            <b>IVA</b>
            <p>{currencyFormatLocal(dispersion?.iva)}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="details-right hide no-print">
      <div class="title">Reportes</div>
      <div class="export-buttons">
        <Input
          label=""
          id="csv-export"
          type="button"
          className="btn-plain btn-square fill-blue"
          icon="csv-fill"
        />
        <Input
          label=""
          id="excel-export"
          type="button"
          className="btn-plain btn-square fill-green"
          icon="xls-fill"
        />
        <Input
          id="print"
          type="button"
          className="btn-plain btn-square fill-blue"
          icon="print"
        />
        <Input
          label=""
          id="pdf-export"
          type="button"
          className="btn-plain btn-square fill-red"
          icon="pdf-fill"
        />
      </div>
    </div> -->
  </div>
  <!-- <div class="details__bottom">
    <div class="card-buttons no-print">
      <div class="clarification-button">
        <Input
          on:click={() => (detailClarification.ticket = dispersion.id)}
          on:click={showModal(modalDetailClarification)}
          label="Aclaración"
          id="transactionClarification"
          type="button"
          className="btn-plain"
          icon=""
        />
      </div>
      <div class="email-button">
        <Input
          on:click={sendDispersionByEmail}
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
  </div> -->
</div>

<style lang="scss">
  @import "src/lib/styles/dispersions.scss";

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
  }

  /* MEDIA */
  /* Small & Medium Screen */
  @media (max-width: $md) {
    .top {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .top__left * .element {
      width: 15rem;
    }

    .middle * .card {
      width: 100%;
    }

    .table-container {
      display: block;
      width: 100%;
      padding: 0 1rem;
    }

    .card-container {
      padding: 2rem 2rem;
    }

    .transaction-tables {
      margin: auto;
    }

    .table-content {
      min-width: auto;
      width: -webkit-fill-available;
      margin: 0;
    }

    .date-range-input {
      display: block;
    }

    .return {
      margin: 1rem 0rem 1rem 1rem;
    }

    .details__middle .details-card {
      min-width: auto;
    }

    .details__middle {
      grid-template-columns: unset;
      .details-left {
        text-align: center;
      }
    }

    .details__bottom {
      .card-buttons {
        height: auto !important;
        display: grid !important;
        grid-template:
          "c d e" 1fr
          "a a a" auto;
        .reverse-button {
          grid-column: 1 / 4;
          grid-row: 2;
          height: 2.5rem;
          width: 100% !important;
        }
        .clarification-button {
          height: 2.5rem;
        }
      }
    }

    .message {
      min-height: 10rem;
      margin: 0 1rem;
    }
  }

  /* Large Screen */
  @media (min-width: $md) and (max-width: $lg) {
    .top {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .top__left * .element {
      width: 15rem;
    }

    .middle * .card {
      width: 100%;
    }

    .table-container {
      display: block;
      width: 100%;
    }

    .card-container {
      padding: 2rem 2rem;
    }

    .transactions-view {
      margin: 0rem 0rem 4rem 0rem;
    }

    .transaction-tables {
      margin: auto;
    }

    .table-content {
      min-width: auto;
      width: -webkit-fill-available;
      margin: 0;
    }

    .date-range-input {
      display: block;
    }

    .return {
      margin: 0rem 0rem 1rem 0rem;
    }

    .details__middle .details-card {
      min-width: auto;
    }

    .details__middle {
      grid-template:
        "a b" auto
        "a b" auto
        "c c" auto;
      .details-left {
        text-align: left;
      }
      .details-right {
        grid-column: 1 / 3;
        grid-row: 2;
      }
    }

    .details__bottom {
      .card-buttons {
        height: auto !important;
        display: grid !important;
        grid-template:
          "c d e" 1fr
          "a a a" auto;
        .reverse-button {
          grid-column: 1 / 4;
          grid-row: 2;
          height: 2.5rem;
          width: 100% !important;
        }
        .clarification-button {
          height: 2.5rem;
        }
      }
    }

    .message {
      min-height: 10rem;
      margin: 0 1rem;
    }

    /* .top__left {
    min-width: 15rem;
  }
  .middle * .card {
    width: auto;
  }
  .details__middle {
    gap: 1rem;
  }

  .details-right .export-buttons {
    flex-direction: column;
  }

  .message {
    margin: 0;
  } */
    /* .responsive {
    display: none;
  } */
  }
</style>
