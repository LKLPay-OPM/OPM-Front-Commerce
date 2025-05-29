<script>
  /* svelte */
  import { error } from "@sveltejs/kit";
  import { invalidateAll } from "$app/navigation";
  /* stores */
  import { loggedInUser, redirectUrgentDispersions, toastId } from "$lib/stores";
  /* components */
  import Input from "$lib/components/Input.svelte";
  import DateTitle from "$lib/components/DateTitle.svelte";
  import InfoCard from "$lib/components/InfoCard.svelte";
  import IconInput from "$lib/components/IconInput.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import Select from "$lib/components/Select.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import ButtonGroup from "$lib/components/ButtonGroup.svelte";
  import Table from "$lib/components/dispersions/table/Dispersions.svelte";
  import { onMount } from "svelte";
  import { generatePDF, generateCSV, generateXLSX } from "$lib/hooks/exportDataToFile.js";
  /* utils */
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import { errorCustomMsgToast, successCustomMsgToast } from "$lib/utils/toast.js";
  /* client */
  import { axiosDepositsAndFees } from "$lib/repos/axios";
  /* handlers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";

  export let user;
  export let data;
  // const uid = user.uid;
  let dispersions = data?.dispersions /* ?.dispersions */ ?? [];
  let resume = data?.resume /* ?.dispersions */ ?? [];
  let rate = data?.rate ?? {};
  let iva = 16;
  let search = [];
  let dispersionDetailView = false;
  let notFound = false;
  let loading = false;
  let active = "1";
  let terms = false;
  let termsDepositPreference = false;

  let dateRangeStart,
    dateRangeEnd,
    ticketId,
    modalDateFilter,
    modalClarification,
    modalDetailClarification,
    modalImmediateDeposit,
    modalImmediateDepositPreference;
  let pdfData,
    print = true;
  let rates;
  /* let rateLklPay, rateNatural, ratesBusinessType, rateUrgentDispersion = 0;
  let urgentDepositQty = 0; */

  let clarificationsList = [
    { name: "Opción 1", value: "option1" },
    { name: "Opción 2", value: "option2" },
    { name: "Opción 3", value: "option3" },
    { name: "Opción 4", value: "option4" },
  ];

  let clarification = {
    customer: 123 /* $loggedInUser.uid */,
    description: "",
  };
  let detailClarification = {
    ticket: "",
    description: "",
  };

  let immediateDeposit = {
    availableBalance: data.urgentAvailable ?? 0,
    immediateDepositComission: 0,
    immediateDepositQty: 0,
    toDeposit: 0,
  };

  function handleFilterClick({ detail }) {
    active = detail?.value;
    if (active === "2") {
      immediateDepositPreference();
    }
  }

  const getPercentage = (num, per) => {
    const percentage = (num / 100) * per;
    const total = num - percentage;
    return total;
  };

  const dispersionFound = () => {
    if (dispersions.length <= 0) {
      notFound = true;
    } else {
      notFound = false;
    }
    loading = false;
  };

  const fetchByDateRange = async () => {
    try {
      const response = await axiosDepositsAndFees.post(`/dispersion/date`, {
        start: dateRangeStart,
        end: dateRangeEnd,
      });
      dispersions = response.data.response.dispersions;
    } catch (e) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
    dispersionFound();
  };

  const fetchByTicketId = async () => {
    try {
      const response = await axiosDepositsAndFees.post(`/dispersion`, {
        id: ticketId,
      });
      dispersions = response.data.response.dispersions;
    } catch (e) {
      errorCustomMsgToast(`Ocurrió un error, intenta de nuevo`);
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
    dispersionFound();
  };

  const sortObject = (data) => {
    const dispersionsNew = data.map((element) => {
      return {
        date: element.date.toDate().toLocaleDateString(),
        id: element.id,
        status: element.status,
        total: parseInt(element.total),
      };
    });
    return dispersionsNew;
  };

  const exportDataToPDF = async (dispersions) => {
    generatePDF(dispersions, user);
  };

  const exportDataToExcel = async (dispersions) => {
    const data = sortObject(dispersions);
    generateXLSX(data);
  };

  const exportDataToCSV = async (dispersions) => {
    const data = sortObject(dispersions);
    generateCSV(data);
  };

  const handleClarification = async () => {
    try {
      $toastId = "";
      const response = await axiosDepositsAndFees.post(`/dispersion/urgent`, {
        amount: Number(immediateDeposit.immediateDepositQty),
      });
      successCustomMsgToast("Tus solicitud se procesó con éxito");
    } catch (e) {
      errorCustomMsgToast("Ocurrió un error al procesar tu solicitud, vuelve a intentarlo");
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };
  const handleImmediateDeposit = async () => {
    try {
      $toastId = "";
      const response = await axiosDepositsAndFees.post(`/dispersion/urgent`, {
        amount: Number(immediateDeposit.immediateDepositQty),
      });
      successCustomMsgToast("Tus solicitud se procesó con éxito");
      invalidateAll();
    } catch (e) {
      errorCustomMsgToast("Ocurrió un error al procesar tu solicitud, vuelve a intentarlo");
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
    immediateDeposit.toDeposit = getPercentage(
      immediateDeposit.immediateDepositQty,
      immediateDeposit.immediateDepositComission
    );
    immediateDeposit = {
      availableBalance: data.urgentAvailable,
      immediateDepositQty: 0,
      toDeposit: 0,
    };
  };

  const handleImmediateDepositPreference = async () => {};

  const traditionalDepositPreference = () => {
    active = "1";
  };
  const immediateDepositPreference = () => {
    showModal(modalImmediateDepositPreference);
    active = "2";
  };

  let buttonGroupOptions = [
    { value: "1", name: "Tradicional", click: traditionalDepositPreference },
    { value: "2", name: "Mismo Día", click: immediateDepositPreference },
  ];

  const getClabe = (string) => {
    var pattern = /(\d{3})(\d{11})(\d{4})/;
    return string.replace(pattern, `$1***********$3`);
    // return result;
  };

  const getUrgentComission = () => {
    const urgent = immediateDeposit.immediateDepositQty * (rate.urgent / 100);
    const calc = urgent + urgent * (iva / 100);
    return calc;
  };

  const showModal = (option) => {
    option.show();
  };

  const closeModal = (option) => {
    option.closeModal();
  };

  onMount(async () => {
    dispersionFound();
    if ($redirectUrgentDispersions === true) {
      $redirectUrgentDispersions = false;
      showModal(modalImmediateDeposit);
    }
  });
</script>

<!-- MODAL DEPOSIT PREFERENCE-->
<Modal className={`modal-medium`} bind:this={modalImmediateDepositPreference}>
  <div slot="header">
    <p>Contratar Depósito Mismo Día</p>
  </div>
  <div slot="content">
    <div class="immediate-deposit">
      <div class="error">
        <p>Todas tus ventas acumuladas del día hasta las 6:00pm serán depositadas a las 6:30pm.</p>
      </div>
      <div class="column-element">
        <div class="blue-title">
          <p>Costo Extra por Depósito</p>
        </div>
        <div class="content">
          <p>{rate.immediate}%</p>
        </div>
      </div>
      <div class="terms">
        <div class="terms-checkbox">
          <Checkbox bind:checked={termsDepositPreference} />
        </div>
        <p>
          He Leído, entendido y acepto los
          <a href="/#terms">Términos y Condiciones Generales</a> de OPM, así como su
          <a href="/#privacy">Política de Privacidad</a> y, por lo tanto estoy de acuerdo en el uso y procesamiento de datos
          personales.
        </p>
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalImmediateDepositPreference)}
      label="Cerrar"
      id="buttonCloseModalImmediateDepositPreference"
      type="button"
      className="btn-plain"
      icon=""
    />
    {#if termsDepositPreference}
      <Input
        on:click={closeModal(modalImmediateDepositPreference)}
        on:click={() => handleImmediateDepositPreference()}
        label="Contratar"
        id="buttonSaveModalImmediateDepositPreference"
        type="button"
        className={`
          ${termsDepositPreference ? "btn-success" : "btn-plain disabled"}`}
        icon=""
      />
    {/if}
  </div>
</Modal>
<!-- MODAL IMMEDIATE DEPOSIT -->
<Modal className={`modal-medium`} bind:this={modalImmediateDeposit}>
  <div slot="header">
    <p>Solicitar Depósito Urgente</p>
  </div>
  <div slot="content">
    <div class="immediate-deposit">
      {#if data?.urgentAvailable < 500}
        <div class="error">
          <p>
            El monto mínimo para solicitar es de $500.00 mxn más el costo extra del {immediateDeposit.immediateDepositComission}%
          </p>
        </div>
      {:else}
        <div class="row-element">
          <IconInput
            icon="dollar"
            label="Saldo Disponible"
            id="availableAmountTxtField"
            value={data.urgentAvailable.toFixed(2)}
            disabled={true}
            className="disabled-txt-field"
            type="number"
          />
          <IconInput
            icon="dollar"
            label="Monto Solicitado"
            placeholder="Monto Solicitado"
            id="requestedAmountTxtField"
            bind:value={immediateDeposit.immediateDepositQty}
            className="txt-field normal"
            type="number"
            min="0"
          />
        </div>
        <div class="column-element">
          <div class="blue-title">
            <p>Comisión por disposición urgente (+iva)</p>
          </div>
          <div class="content">
            <p>{rate.urgent} %</p>
          </div>
        </div>
        <div class="column-element">
          <div class="gray-title">
            <p>Monto a Depositar</p>
          </div>
          <div class="content">
            <p>
              {currencyFormatLocal(immediateDeposit.immediateDepositQty - getUrgentComission()) ?? "$0"}
            </p>
          </div>
          <div class="msg__error" class:opacity={immediateDeposit.immediateDepositQty >= 500}>
            <p>El monto mínimo para solicitar es de $500</p>
          </div>
        </div>
        <div class="terms">
          <div class="terms-checkbox">
            <Checkbox bind:checked={terms} />
          </div>
          <p>
            He Leído, entendido y acepto los
            <a href="/#terms">Términos y Condiciones Generales</a> de OPM, así como su
            <a href="/#privacy">Política de Privacidad</a> y, por lo tanto estoy de acuerdo en el uso y procesamiento de
            datos personales.
          </p>
        </div>
      {/if}
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    {#if data.urgentAvailable < 500}
      <Input
        on:click={closeModal(modalImmediateDeposit)}
        label="Entendido"
        id="buttonCloseModalImmediateDeposit"
        type="button"
        className="btn-plain btn-orange"
        icon=""
      />
    {:else if data.urgentAvailable > 500 && immediateDeposit.immediateDepositQty <= data.urgentAvailable && terms}
      <Input
        on:click={closeModal(modalImmediateDeposit)}
        on:click={() => handleImmediateDeposit()}
        label="Solicitar Depósito"
        id="buttonSaveModalImmediateDeposit"
        type="button"
        className={`
            ${
              immediateDeposit.immediateDepositQty > 0 && immediateDeposit.immediateDepositQty >= 500 && terms === true
                ? "btn"
                : "btn-plain disabled"
            }`}
        icon=""
      />
    {/if}
  </div>
</Modal>
<!-- MODAL DISPERSION CLARIFICATION -->
<Modal className={`modal-medium`} bind:this={modalClarification}>
  <div slot="header">
    <p>Solicitar Aclaración sobre saldo a Depositar</p>
  </div>
  <div slot="content">
    <div class="clarifications">
      <div class="title">Cantidad</div>
      <div class="description">
        <p>
          {currencyFormatLocal(data.urgentAvailable)}
        </p>
      </div>
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
      on:click={closeModal(modalClarification)}
      on:click={() => handleClarification()}
      label="Enviar Aclaración"
      id="buttonSaveModalClarification"
      type="button"
      className={`
        ${clarification.description != "" ? "btn" : "btn-plain disabled"}`}
      icon=""
    />
  </div>
</Modal>
<!-- MODAL FETCH BY DATE RANGE -->
<Modal className={`modal-medium`} bind:this={modalDateFilter}>
  <div slot="header">
    <p>Por Fechas</p>
  </div>
  <div slot="content">
    <div class="date-range-input">
      <DatePicker label="Del" id="date-range-start" bind:value={dateRangeStart} />
      <DatePicker label="Al" id="date-range-end" bind:value={dateRangeEnd} />
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalDateFilter)}
      label="Cerrar"
      id="buttonCloseModalUrgentDeposit"
      type="button"
      className="btn-plain"
      icon=""
    />
    <Input
      on:click={closeModal(modalDateFilter)}
      on:click={() => fetchByDateRange()}
      label="Filtrar"
      id="buttonSaveModalUrgentDeposit"
      type="button"
      className={`btn-plain
        ${dateRangeStart != "" && dateRangeEnd != "" ? "" : "disabled"}`}
      icon=""
    />
  </div>
</Modal>

<div class="dispersions">
  {#if !dispersionDetailView}
    <div class="top">
      <div class="top__left">
        <div class="page-title">
          <h1>Depósitos</h1>
        </div>
        <div class="buttons">
          <div class="element">
            {#if !dispersionDetailView}
              <Input
                on:click={showModal(modalDateFilter)}
                label="Filtrar "
                id="openModalDateFilter"
                type="button"
                className="btn-plain"
                icon=""
              />
            {/if}
          </div>
          {#if dispersionDetailView}
            <div class="element">
              <Input
                on:click={() => (dispersionDetailView = false)}
                label="Regresar"
                id="detailsReturnButton"
                type="button"
                className="btn-plain"
                icon=""
              />
            </div>
          {/if}
        </div>
      </div>
      <div class="top__middle">
        <DateTitle />
        <!-- <ButtonGroup
          {active}
          options={buttonGroupOptions}
          on:click={handleFilterClick}
        /> -->
        <!-- <ButtonGroup bind:active options={buttonGroupOptions} /> -->
      </div>
      <div class="top__right">
        <div class="dispersion-search-bar">
          <Input
            placeholder="Buscar por folio"
            id="ticket-id-search"
            bind:value={ticketId}
            className="txt-field normal"
            type="text"
            icon=""
          />
          <Input
            on:click={fetchByTicketId}
            label=""
            id="byTicketId-button"
            type="button"
            className="btn-plain btn-round {ticketId != '' ? '' : 'disabled'}"
            icon="search"
          />
        </div>
        <!-- <div class="export-buttons">
          <Input
            label=""
            id="csv-export"
            type="button"
            className="btn-plain btn-square fill-blue {dispersions.length > 0
              ? ''
              : 'disabled'}"
            icon="csv-fill"
          />
          <Input
            label=""
            id="excel-export"
            type="button"
            className="btn-plain btn-square fill-green {dispersions.length > 0
              ? ''
              : 'disabled'}"
            icon="xls-fill"
          />
          <Input
            label=""
            id="print"
            type="button"
            className="btn-plain btn-square fill-blue {dispersions.length > 0
              ? ''
              : 'disabled'}"
            icon="print"
          />
          <Input
            label=""
            id="pdf-export"
            type="button"
            className="btn-plain btn-square fill-red {dispersions.length > 0
              ? ''
              : 'disabled'}"
            icon="pdf-fill"
          />
          //<Input on:click={exportDataToCSV(dispersions)} label="" id="csv-export" type="button" className="btn-plain btn-square {dispersions.length > 0 ? '' : 'disabled'}" icon="csv-fill"/>
          //<Input on:click={exportDataToExcel(dispersions)} label="" id="excel-export" type="button" className="btn-plain btn-square {dispersions.length > 0 ? '' : 'disabled'}" icon="xls-fill"/>
          //<Input on:click={exportDataToPDF(dispersions)} label="" id="pdf-export" type="button" className="btn-plain btn-square {dispersions.length > 0 ? '' : 'disabled'}" icon="pdf-fill"/>
        </div> -->
      </div>
    </div>
    <div class="middle">
      <div class="card-group">
        <!-- <div class="button">
          <Input
            on:click={showModal(modalClarification)}
            label="Solicitar Aclaración"
            id="aclarationButton"
            type="button"
            className="btn-plain"
            icon=""
          />
        </div> -->
        <div class="element">
          <InfoCard
            className={""}
            title="Saldo a Depositar"
            numData={currencyFormatLocal(resume?.depositBalance ?? 0)}
          />
        </div>
        <div class="button">
          <Input
            on:click={showModal(modalImmediateDeposit)}
            label="Depósito Urgente"
            id="immediateDepositButton"
            type="button"
            className="btn"
            icon=""
          />
        </div>
      </div>
    </div>
  {/if}
  <div class="dispersions-view">
    {#if notFound}
      <div class="message">
        <div class="msg">
          <p>No se encontraron regitros</p>
        </div>
        <div class="description">
          <p>Aquí podrás ver el resumen de tus depósitos</p>
        </div>
      </div>
    {:else}
      {#key search}
        <Table {dispersions} />
      {/key}
    {/if}
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/dispersions/layout.scss";
</style>
