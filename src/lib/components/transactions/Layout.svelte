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
  import FilterFeedback from "$lib/components/transactions/FilterFeedback.svelte";
  /*  */
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import {
    generatePDF,
    generateCSV,
    generateXLSX,
  } from "$lib/hooks/exportDataToFile.js";
  /* icons */
  import Icons from "$lib/components/Icons.svelte";
  /* Constants */
  import { filterByDateOptions } from "$lib/constants/filter";
  /* utils */
  import { getIndex } from "$lib/utils/indexes";
  import { createFilterUrl } from "$lib/utils/string";
  import { getStringDate, parseSlashDate, stringDateToDatePickerFormat } from "$lib/utils/date";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import {
    errorCustomMsgToast,
    successCustomMsgToast,
  } from "$lib/utils/toast.js";
  /* handlers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";
  /* axios */
  import { axiosDevicesClient } from "$lib/repos/axios";
  /* variables */
  export let data;
  // $:console.log(data)
  let active = data.filters?.filter;
  let branches = data.branches;
  let terminals = data.terminals;
  let transactionStatus = data.transactionStatus;
  let status = data.filters?.status ?? "";
  let transactionType = data.transactionType;
  let paginationStart = data.filters?.start ?? 0;
  let paginationEnd = data.filters?.end ?? 10;
  let startDate = data.filters?.startDate ?? "";
  let endDate = data.filters?.endDate ?? "";
  let idTicket = data.filters?.ticketId ?? "";
  let count = data.response?.count ?? 0;
  let terminal = data.filters?.terminal;
  let type = data.filters?.type;
  let branch = data.filters?.branch;
  let cardBrand = data.filters?.brand;
  let indexSelect = {
    branch: getIndex(branches, branch),
    terminal: getIndex(terminals, terminal),
    type: getIndex(transactionType, type),
    status: getIndex(transactionStatus, status),
  }
  

  const filter = data.filters.filter;

  function handleFilterClick({ detail }) {
    const value = detail?.value;
    // active = value;
    goto(`/transactions/${value}`);
  }

  let transactions = data.response?.transactions ?? [];
  let resume = data.response?.resume;
  let transactionsWeek = [];
  let transactionDetailView = false;
  let notFound = false;
  let loading = false;

  let dateRangeStart = stringDateToDatePickerFormat(startDate) ?? "",
    dateRangeEnd = stringDateToDatePickerFormat(endDate) ?? "",
    ticketId = "",
    modalDateFilter,
    modalClarification;
  let pdfData,
    print = true;

  $: {
    transactionFound();
    if (transactions) {transactionsWeek = transactions;}
  }

  /* let clarificationsList = [
    { name: "Opción 1", value: "option1" },
    { name: "Opción 2", value: "option2" },
    { name: "Opción 3", value: "option3" },
    { name: "Opción 4", value: "option4" },
  ]; */

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

  const fetchByDateRange = async () => {
    paginationStart = 0;
    paginationEnd = 10;
    if (dateRangeStart != "" && dateRangeEnd != "") {active = "range";}
    /* const start = getStringDate(new Date(parseSlashDate(dateRangeStart))) ?? "";
    const end = getStringDate(new Date(parseSlashDate(dateRangeEnd))) ?? ""; */
    const stringValues = {active, startDate: dateRangeStart, endDate: dateRangeEnd, idTicket, paginationStart, paginationEnd, cardBrand, type, branch, terminal, status}
    const path = `/transactions/${active}?filter=${active}${createFilterUrl(stringValues)}`;
    await goto(path);
  };

  const fetchByTicketId = async () => {
    paginationStart = 0;
    paginationEnd = 10;
    await goto(
      `/transactions/id?filter=id&search=${ticketId}&start=${paginationStart}&end=${paginationEnd}`
    );
  };

  const cleanFilters = () => {
    dateRangeStart = "";
    dateRangeEnd = "";
    cardBrand = "";
    indexSelect = {
      branch: 0,
      terminal: 0,
      type: 0,
      status: 0,
    }
  };

  const exportDataToPDF = async (transactions) => {};

  const exportDataToExcel = async () => {
    const start = startDate;
    const end = endDate;
    try {
      if (active === "day") {
        startDate = transactions[0]["Transaction_Date"];
        endDate = transactions[0]["Transaction_Date"];
      }
      if (active === "week") {
        startDate = transactions[0].date;
        endDate = "999999";
      } else if (active === "month") {
        if (transactions.length > 1) {
          startDate = `${transactions[transactions.length - 1]._id}01`;
          endDate = "999999";
        } else {
          startDate = `${transactions[transactions.length - 1]._id}01`;
          endDate = `${transactions[transactions.length - 1]._id}99`;
        }
      }
      // window.open(url, '_blank').focus();
      const excel = axiosDevicesClient
        .get(
          `/transaction/report/transactionsReport?startDate=${startDate}&endDate=${endDate}&brand=${cardBrand}`,
          { responseType: "blob" }
        )
        .then((response) => {
          // create file link in browser's memory
          const href = URL.createObjectURL(response.data);

          // create "a" HTML element with href to file & click
          const link = document.createElement("a");
          link.href = href;
          link.setAttribute("download", `Reporte de ventas ${startDate}-${endDate}.xlsx`); //or any other extension
          document.body.appendChild(link);
          link.click();

          // clean up "a" element & remove ObjectURL
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        });
    } catch (e) {
      const handler = await appErrorResponseHandler(e);
      const code = handler?.code ?? 500;
      const message = handler?.message ?? "¡Algo salió mal!";
      throw new error(code, message);
    }
  };

  const exportDataToCSV = async (transactions) => {};

  const handleClarification = () => {};

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
        <DatePicker
          label="Del"
          id="date-range-start"
          bind:value={dateRangeStart}
        />
        <DatePicker label="Al" id="date-range-end" bind:value={dateRangeEnd} />
      </div>
      <p>Sucursales</p>
      <div style="padding: 1rem 0;">
        <Select bind:optionsList={branches} defaultText={""} label="" id="selectFilterByBranches" bind:value={branch} index={indexSelect.branch}/>
      </div>
      <p>Terminales</p>
      <div style="padding: 1rem 0;">
        <Select bind:optionsList={terminals} defaultText={""} label="" id="selectFilterByTerminals" bind:value={terminal} index={indexSelect.terminal}/>
      </div>
      <p>Tipo de Transacción</p>
      <div style="padding: 1rem 0;">
        <Select bind:optionsList={transactionType} defaultText={""} label="" id="selectFilterByTypes" bind:value={type} index={indexSelect.type}/>
      </div>
      <p>Estatus de Transacción</p>
      <div style="padding: 1rem 0;">
        <Select bind:optionsList={transactionStatus} defaultText={""} label="" id="selectFilterByStatus" bind:value={status} index={indexSelect.status}/>
      </div>
      <p>Marca</p>
      <div class="input-cards">
        <div class={`icon__container`} class:selected={cardBrand === "mastercard"}>
          <i
            on:click={() => (cardBrand == "mastercard" ? cardBrand = "" : cardBrand = "mastercard")}
            on:keypress={(e) => e.key === "Enter" ? () => (cardBrand == "mastercard" ? cardBrand = "" : cardBrand = "mastercard") : ""}
          >
            <Icons name="mastercard" width="50" height="30" />
          </i>
        </div>
        <div class={`icon__container`} class:selected={cardBrand === "visa"}>
          <i
            on:click={() => (cardBrand == "visa" ? cardBrand = "" : cardBrand = "visa")}
            on:keypress={(e) => e.key === "Enter" ? () => (cardBrand == "visa" ? cardBrand = "" : cardBrand = "visa") : ""}
          >
            <Icons name="visa" width="50" height="30" />
          </i>
        </div>
        <div class={`icon__container`} class:selected={cardBrand === "amex"}>
          <i
            on:click={() => (cardBrand == "amex" ? cardBrand = "" : cardBrand = "amex")}
            on:keypress={(e) => e.key === "Enter" ? () => (cardBrand == "amex" ? cardBrand = "" : cardBrand = "amex") : ""}
          >
            <Icons name="amex" width="25" height="25" />
          </i>
        </div>
        <div
          class={`icon__container`} class:selected={cardBrand === "other"}
        >
          <i
            on:click={() => (cardBrand == "other" ? cardBrand = "" : cardBrand = "other")}
            on:keypress={(e) => e.key === "Enter" ? () => (cardBrand == "other" ? cardBrand = "" : cardBrand = "other") : ""}
          >
            <Icons name="bank-card-line" width="25" height="25" />
          </i>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    <Input
      on:click={cleanFilters}
      label="Limpiar Filtros"
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
      className={`btn`}
      icon=""
    />
  </div>
</Modal>

<div class="transactions">
  <div class="top">
    <div class="top__left">
      <div class="page-title">
        <h1>Mis Ventas</h1>
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
      <ButtonGroup
        active={filter}
        options={filterByDateOptions}
        on:click={handleFilterClick}
      />
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
        {#if transactions.length > 0}
          <!-- <Input
            on:click={exportDataToCSV(transactions)}
            label=""
            id="csv-export"
            type="button"
            className="btn-plain btn-square fill-blue {transactions?.length > 0
              ? ''
              : 'disabled'}"
            icon="csv-fill"
          /> -->
          <Input
            on:click={exportDataToExcel}
            label=""
            id="excel-export"
            type="button"
            className="btn-plain btn-square fill-green {transactions?.length > 0
              ? ''
              : 'disabled'}"
            icon="xls-fill"
          />
          <!-- <Input
            label=""
            id="print"
            type="button"
            className="btn-plain btn-square fill-blue {transactions?.length > 0
              ? ''
              : 'disabled'}"
            icon="print"
          />
          <Input
            label=""
            id="pdf-export"
            type="button"
            className="btn-plain btn-square fill-red {transactions?.length > 0
              ? ''
              : 'disabled'}"
            icon="pdf-fill"
          /> -->
        {/if}
      </div>
    </div>
  </div>
  <div class="middle">
    <div class="card-group">
      <div class="element">
        <InfoCard
          className={""}
          title="Monto Total"
          numData={currencyFormatLocal(resume?.amount ?? 0)}
        />
      </div>
      <div class="element">
        <InfoCard
          className={""}
          title="Comisión"
          numData={currencyFormatLocal(resume?.Comission ?? 0)}
        />
      </div>
      {#if (typeof resume?.Tips != "undefined" && resume?.Tips > 0) || typeof resume?.Tips != "undefined"}
        <div class="element">
          <InfoCard
            className={""}
            title="Propinas"
            numData={currencyFormatLocal(resume?.Tips ?? 0)}
          />
        </div>
      {/if}
      <div class="element">
        <InfoCard
          className={""}
          title="Depósito"
          numData={currencyFormatLocal(resume?.Deposit ?? 0)}
        />
      </div>
    </div>
  </div>
  <div class="transactions-view">
    <FilterFeedback filters={data.filters} {branches} {terminals} {indexSelect}/> 
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

  .icon__container {
    cursor: pointer;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-content: center;
    border-radius: 4px;
    &.selected {
      background: rgb(0, 0, 0, 0.2);
    }
  }
</style>
