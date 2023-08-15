<script>
  /* svelte */
  import { error } from "@sveltejs/kit";
  import { page } from "$app/stores";
  /* components */
  import Input from "$lib/components/Input.svelte";
  import InfoCard from "$lib/components/InfoCard.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import DateTitle from "$lib/components/DateTitle.svelte";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import Select from "$lib/components/Select.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import ButtonGroup from "$lib/components/ButtonGroup.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import ViewDay from "$lib/components/transactions/day/Table.svelte";
  import ViewWeek from "$lib/components/transactions/week/View.svelte";
  import ViewMonth from "$lib/components/transactions/month/View.svelte";
  /*  */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { generatePDF, generateCSV, generateXLSX } from "$lib/hooks/exportDataToFile.js";
  /* icons */
  import Icons from "$lib/components/Icons.svelte";
  /* Constants */
  import { filterByDateOptions } from "$lib/constants/filter";
  /* utils */
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import { getStringDate, parseSlashDate } from "$lib/utils/date";
  import { errorCustomMsgToast, successCustomMsgToast } from "$lib/utils/toast.js";
  /* handlers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";
  /* axios */
  import { axiosDevicesClient } from "$lib/repos/axios";
  /* variables */
  export let data;
  let active = data.filter;
  let paginationStart = data.start ?? 0;
  let paginationEnd = data.end ?? 10;
  let startDate = data.startDate ?? "";
  let endDate = data.endDate ?? "";
  let idTicket = data.ticketId ?? "";
  let count = data.response?.count ?? 0;

  const filter = data.filter;

  function handleFilterClick({ detail }) {
    const value = detail?.value;
    // active = value;
    goto(`/transactions/${value}`);
  }

  export let user;
  const dbCollection = "users-client";
  const uid = user.uid;
  let transactions = data.response?.transactions ?? [];
  let resume = data.response?.resume;
  let transactionsWeek = [];
  let transactionsMonth = [];
  let selectedTransaction = {};
  let transactionToArray = [];
  let transactionDetailView = false;
  let notFound = false;
  let notFoundMessage = "No se encontraron registros";
  let loading = false;
  let date = new Date();
  let toggleWeek = "";
  let toggleWeekDetails = "";
  let selectedDay;

  let dateRangeStart = "",
    dateRangeEnd = "",
    ticketId = "",
    modalDateFilter,
    modalClarification,
    cardBrand = "",
    cardIcon = "";
  let pdfData,
    print = true,
    dayView = false,
    monthView = false;

  $: {
    console.log("Layout", data)
    transactionFound();
    /* if (active === "day") {
      transactionFound();
    } else {
      notFound = false;
    } */
    if (transactions) {
      transactionsWeek = transactions;
    }
  }
  let clarificationsList = [
    { name: "Opción 1", value: "option1" },
    { name: "Opción 2", value: "option2" },
    { name: "Opción 3", value: "option3" },
    { name: "Opción 4", value: "option4" },
  ];

  let clarification = {
    ticket: "",
    description: "",
  };

  const transactionFound = () => {
    if (count <= 0) {
      notFound = true;
    } else {
      notFound = false;
    }
    loading = false;
  };

  let das = {
    url: $page.url.pathname,
    active,
    paginationStart,
    paginationEnd,
  };

  const fetchByCardBrand = async (cardBrand) => {
    paginationStart = 0;
    paginationEnd = 10;
    const path = `
      /transactions/${active}?filter=${active}${startDate != "" ? `&startDate=${startDate}` : ""}${endDate != "" ? `&endDate=${endDate}` : ""}${idTicket != "" ? `&search=${idTicket}` : ""}&start=${paginationStart}&end=${paginationEnd}&brand=${cardBrand}`;
    await goto(path);
  };

  const fetchByDateRange = async () => {
    paginationStart = 0;
    paginationEnd = 10;
    const start = getStringDate(new Date(parseSlashDate(dateRangeStart)));
    const end = getStringDate(new Date(parseSlashDate(dateRangeEnd)));
    await goto(
      `/transactions/range?filter=range&startDate=${start}&endDate=${end}&start=${paginationStart}&end=${paginationEnd}`
    );
  };

  const fetchByTicketId = async () => {
    paginationStart = 0;
    paginationEnd = 10;
    await goto(`/transactions/id?filter=id&search=${ticketId}&start=${paginationStart}&end=${paginationEnd}`);
  };

  const exportDataToPDF = async (transactions) => {};

  const exportDataToExcel = async (transactions) => {};

  const exportDataToCSV = async (transactions) => {};

  const handleClarification = () => {
    console.log(clarification);
  };

  const showModal = (option) => {
    option.show();
  };

  const closeModal = (option) => {
    option.closeModal();
  };

  onMount(async () => {});
</script>

<!-- MODAL TRANSACTION CLARIFICATION -->
<Modal className={`modal-medium`} bind:this={modalClarification}>
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
    <!-- <p>Por Fechas</p> -->
  </div>
  <div slot="content">
    <div class="modal-range">
      <p>Fechas</p>
      <div class="date-range-input">
        <DatePicker label="Del" id="date-range-start" bind:value={dateRangeStart} />
        <DatePicker label="Al" id="date-range-end" bind:value={dateRangeEnd} />
      </div>
      <p>Marca</p>
      <div class="input-cards">
        <i on:click={() => fetchByCardBrand("mastercard")} on:keypress={(e) => (e.key === "Enter" ? () => fetchByCardBrand("mastercard") : "")}>
          <Icons name="mastercard" width="50" height="30" />
        </i>
        <i on:click={() => fetchByCardBrand("visa")} on:keypress={(e) => (e.key === "Enter" ? () => fetchByCardBrand("visa") : "")}>
          <Icons name="visa" width="50" height="30" />
        </i>
        <i on:click={() => fetchByCardBrand("amex")} on:keypress={(e) => (e.key === "Enter" ? () => fetchByCardBrand("amex") : "")}>
          <Icons name="amex" width="25" height="25" />
        </i>
        <i on:click={() => fetchByCardBrand("other")} on:keypress={(e) => (e.key === "Enter" ? () => fetchByCardBrand("other") : "")}>
          <Icons name="bank-card-line" width="25" height="25" />
        </i>
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={closeModal(modalDateFilter)}
      label="Cerrar"
      id="buttonCloseModalDateRange"
      type="button"
      className="btn-plain"
      icon=""
    />
    <Input
      on:click={closeModal(modalDateFilter)}
      on:click={() => fetchByDateRange()}
      label="Filtrar"
      id="buttonSaveModalDateRange"
      type="button"
      className={`
        ${dateRangeStart != "" && dateRangeEnd != "" ? "btn" : "btn-plain disabled"}`}
      icon=""
    />
  </div>
</Modal>

<div class="transactions">
  <div class="top">
    <div class="top__left">
      <div class="page-title">
        <h1>Ventas</h1>
      </div>
      <div class="buttons">
        <div class="element">
          {#if !transactionDetailView}
            <Input
              on:click={showModal(modalDateFilter)}
              label="Filtrar"
              id="openModalDateFilter"
              type="button"
              className="btn-plain fill-blue"
              icon=""
            />
          {/if}
        </div>
        {#if transactionDetailView}
          <div class="element">
            <Input
              on:click={() => (transactionDetailView = false)}
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
      <ButtonGroup active={filter} options={filterByDateOptions} on:click={handleFilterClick} />
    </div>
    <div class="top__right">
      <div class="transaction-search-bar">
        <Input
          placeholder="Buscar por ticket"
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
      <div class="export-buttons">
        <Input
          on:click={exportDataToCSV(transactions)}
          label=""
          id="csv-export"
          type="button"
          className="btn-plain btn-square fill-blue {transactions?.length > 0 ? '' : 'disabled'}"
          icon="csv-fill"
        />
        <Input
          on:click={exportDataToExcel(transactions)}
          label=""
          id="excel-export"
          type="button"
          className="btn-plain btn-square fill-green {transactions?.length > 0 ? '' : 'disabled'}"
          icon="xls-fill"
        />
        <Input
          label=""
          id="print"
          type="button"
          className="btn-plain btn-square fill-blue {transactions?.length > 0 ? '' : 'disabled'}"
          icon="print"
        />
        <Input
          label=""
          id="pdf-export"
          type="button"
          className="btn-plain btn-square fill-red {transactions?.length > 0 ? '' : 'disabled'}"
          icon="pdf-fill"
        />
        <!-- <Input on:click={exportDataToCSV(transactions)} label="" id="csv-export" type="button" className="btn-plain btn-square {transactions?.length > 0 ? '' : 'disabled'}" icon="csv-fill"/> -->
        <!-- <Input on:click={exportDataToExcel(transactions)} label="" id="excel-export" type="button" className="btn-plain btn-square {transactions?.length > 0 ? '' : 'disabled'}" icon="xls-fill"/> -->
        <!-- <Input on:click={exportDataToPDF(transactions)} label="" id="pdf-export" type="button" className="btn-plain btn-square {transactions?.length > 0 ? '' : 'disabled'}" icon="pdf-fill"/> -->
      </div>
    </div>
  </div>
  <div class="middle">
    <div class="card-group">
      <div class="element">
        <InfoCard className={""} title="Monto Total" numData={currencyFormatLocal(resume?.Amount ?? 0)} />
      </div>
      <div class="element">
        <InfoCard className={""} title="Comisión" numData={currencyFormatLocal(resume?.Comission ?? 0)} />
      </div>
      {#if (typeof resume?.Tips != "undefined" && resume?.Tips > 0) || typeof resume?.Tips != "undefined"}
        <div class="element">
          <InfoCard className={""} title="Propinas" numData={currencyFormatLocal(resume?.Tips ?? 0)} />
        </div>
      {/if}
      <div class="element">
        <InfoCard className={""} title="Saldo a Depositar" numData={currencyFormatLocal(resume?.Deposit ?? 0)} />
      </div>
    </div>
  </div>
  <div class="transactions-view">
    {#if notFound}
      <div class="message card-primary">
        <div class="msg">
          <p>No se encontraron registros</p>
        </div>
        <div class="description">
          <p>Aquí podrás ver el resumen de tus ventas realizadas</p>
        </div>
      </div>
    {:else}
      <slot />
    {/if}
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/transactions/layout.scss";
</style>
