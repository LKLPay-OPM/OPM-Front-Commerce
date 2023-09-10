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
  let terminal = data.terminal;

  const filter = data.filter;

  function handleFilterClick({ detail }) {
    const value = detail?.value;
    // active = value;
    goto(`/terminals/${terminal.id}/${value}`);
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
    transactionFound();
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

<div class="transactions">
  <div class="top">
    <div class="top__middle">
      <ButtonGroup active={filter} options={filterByDateOptions} on:click={handleFilterClick} />
    </div>
    <div class="top__right">
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
  @import "src/lib/styles/terminals/transactions/layout.scss";
</style>
