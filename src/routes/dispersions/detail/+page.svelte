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
  let selectedDispersion = data?.response;
  let cardIcon = "";
  let modalDetailClarification;
  let detailClarification = {
    ticket: "",
    description: "",
  };

  $: {
    console.log(selectedDispersion);
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
      label="Cerrar"
      id="buttonCloseModalDetailClarification"
      type="button"
      className="btn-plain"
      icon=""
    />
    <Input
      on:click={closeModal(modalDetailClarification)}
      on:click={() => handleClarification()}
      label="Enviar Aclaración"
      id="buttonSaveModalDetailClarification"
      type="button"
      className={`btn-plain
        ${detailClarification.description != "" ? "" : "disabled"}`}
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
<div class="dispersion-details">
  <div class="details__top">
    <b>Recibo #{selectedDispersion.id}</b>
    <p>
      <!-- {dateToLocalString(selectedDispersion.date)} a las {timeToLocalString(selectedDispersion.time)} -->
    </p>
  </div>
  <div class="details__middle">
    <div class="details-left hide">
      <div class="title">Datos</div>
      <div class="item">
        <b>Tipo de Depósito</b>
        <p>{selectedDispersion.type}</p>
      </div>
      <div class="item">
        <b>Referencia</b>
        <p>{selectedDispersion.reference}</p>
      </div>
      <div class="item">
        <b>Rastreo</b>
        <p>{selectedDispersion.tracking}</p>
      </div>
    </div>
    <div class="details-center">
      <div class="details-card">
        <div class="details-card__top">
          <b>Detalle de Depósito</b>
        </div>
        <div class="details-card__middle">
          <div class="item">
            <b>Cuenta CLABE</b>
            <!-- <p>{getClabe(selectedDispersion.clabe)}</p> -->
          </div>
          <div class="item">
            <b>Total Depositado</b>
            <p>
              <!-- {selectedDispersion.dispersion?.toLocaleString(localeParam.language, localeParam.currency)} -->
            </p>
          </div>
        </div>
        <div class="details-card__bottom">
          <div class="item">
            <b>Ventas</b>
            <p>{selectedDispersion.transactions}</p>
            <!-- <span>{`(${(selectedDispersion.commission/selectedDispersion.total)*100}%)`}</span> -->
          </div>
          <div class="item">
            <b>Total Ventas</b>
            <p>
              <!-- {selectedDispersion.total?.toLocaleString(localeParam.language, localeParam.currency)} -->
            </p>
            <span />
          </div>
          <div class="item">
            <b>Comisión</b>
            <p>
              <!-- {selectedDispersion.commission?.toLocaleString(localeParam.language, localeParam.currency)} -->
            </p>
            <!-- <span>(4.06%)</span> -->
          </div>
        </div>
      </div>
      <div class="card-buttons">
        <div class="clarification-button">
          <Input
            on:click={() => (detailClarification.ticket = selectedDispersion.id)}
            on:click={showModal(modalDetailClarification)}
            label="Aclaración"
            id="clarificationDispersionDetail"
            type="button"
            className="btn-plain"
            icon=""
          />
        </div>
        <div class="email-button">
          <Input label="Enviar por e-mail" id="emailDispersion" type="button" className="btn-plain" icon="" />
        </div>
        <div class="print-button">
          <Input label="Imprimir Recibo" id="printDispersion" type="button" className="btn-plain" icon="" />
        </div>
      </div>
    </div>
    <div class="details-right hide">
      <div class="title">Reportes</div>
      <div class="export-buttons">
        <Input label="" id="csv-export" type="button" className="btn-plain btn-square fill-blue" icon="csv-fill" />
        <Input label="" id="excel-export" type="button" className="btn-plain btn-square fill-green" icon="xls-fill" />
        <Input id="print" type="button" className="btn-plain btn-square fill-blue" icon="print" />
        <Input label="" id="pdf-export" type="button" className="btn-plain btn-square fill-red" icon="pdf-fill" />
        <!-- <Input on:click={
              () => {
                dispersionToArray.push(selectedDispersion)
                exportDataToCSV(dispersionToArray)
                dispersionToArray = [];
              }
            } label="" id="csv-export" type="button" className="btn-plain btn-square " icon="csv-fill"/>
            <Input on:click={
              () => {
                dispersionToArray.push(selectedDispersion)
                exportDataToCSV(dispersionToArray)
                dispersionToArray = [];
              }
            } label="" id="excel-export" type="button" className="btn-plain btn-square " icon="xls-fill"/>
            <Input on:click={
              () => {
                dispersionToArray.push(selectedDispersion)
                exportDataToCSV(dispersionToArray)
                dispersionToArray = [];
              }
            } label="" id="pdf-export" type="button" className="btn-plain btn-square " icon="pdf-fill"/>
           -->
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/dispersions.scss";
</style>
