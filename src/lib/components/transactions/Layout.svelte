<script>
  /* components */
  import Input from "$lib/components/Input.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import Select from "$lib/components/Select.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import ButtonGroup from "$lib/components/ButtonGroup.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import ViewDay from "$lib/components/transactions/day/Table.svelte";
  import ViewWeek from "$lib/components/transactions/week/View.svelte";
  import ViewMonth from "$lib/components/transactions/month/View.svelte";
  /*  */
  // import { linkSelected } from "$lib/";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { generatePDF, generateCSV, generateXLSX } from "$lib/hooks/exportDataToFile.js";
  /* icons */
  import Icons from "$lib/components/Icons.svelte";
  /* Constants */
  import { filterByDateOptions } from "$lib/constants/filter";
  /* variables */
  export let data;
  let active = data.filter;
  let paginationStart = data.start;
  let paginationEnd = data.end;
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
    transactionFound();
    /* if (active === "day") {
      transactionFound();
    } else {
      notFound = false;
    } */
    if (data.response.transactions) {
      transactionsWeek = data.response.transactions;
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

  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
  };

  const transactionFound = () => {
    if (transactions?.length <= 0) {
      notFound = true;
    } else {
      notFound = false;
    }
    loading = false;
  };

  const fetchWeekDayTransactions = async (id) => {
    try {
      const response = await axiosDevicesClient.get(
        `/transaction/${id}`
        // { params: { filter, start, end } }
      );
      transactions = response.transactions;
      // return {response: response.data?.response };
    } catch (err) {
      console.error(err);
      throw new error(500, "Something went wrong!");
    }
  };

  const fetchByDateRange = async () => {};

  const fetchByTicketId = async () => {};

  const sortObject = (data) => {
    const transactionsNew = data.map((element) => {
      //value = Math.round((e.target.value) * 100) / 100
      return {
        date: getTransactionDate(element["Transaction Date"]),
        id: element["Transaction Time"],
        total: parseInt(element.Amount) / 100,
        commission: (element.Amount * 0.035) / 100,
        deposit: (element.Amount * 0.965) / 100,
        card: "MasterCard",
      };
    });
    return transactionsNew;
  };

  const exportDataToPDF = async (transactions) => {
    //alert("PDF")
    // console.log(transactions)
    generatePDF(transactions, user);
  };

  const exportDataToExcel = async (transactions) => {
    // alert("Excel")
    const data = sortObject(transactions);
    // console.log(data)
    generateXLSX(data);
  };

  const exportDataToCSV = async (transactions) => {
    // alert("CSV")
    const data = sortObject(transactions);
    // console.log(data)
    generateCSV(data);
  };

  const getMonthName = (month) => {
    const monthsArray = {
      "01": { value: "Enero" },
      "02": { value: "Febrero" },
      "03": { value: "Marzo" },
      "04": { value: "Abril" },
      "05": { value: "Mayo" },
      "06": { value: "Junio" },
      "07": { value: "Julio" },
      "08": { value: "Agosto" },
      "09": { value: "Septiembre" },
      "10": { value: "Octubre" },
      "11": { value: "Noviembre" },
      "12": { value: "Diciembre" },
      0: { value: "Enero" },
      1: { value: "Febrero" },
      2: { value: "Marzo" },
      3: { value: "Abril" },
      4: { value: "Mayo" },
      5: { value: "Junio" },
      6: { value: "Julio" },
      7: { value: "Agosto" },
      8: { value: "Septiembre" },
      9: { value: "Octubre" },
      10: { value: "Noviembre" },
      11: { value: "Diciembre" },
    };
    return monthsArray[month].value;
  };
  const getMonthPeriod = (string) => {
    var pattern = /(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, "$2");
    const month = getMonthName(extractMonth);
    let str = string.replace(pattern, `${month} 20$1`);
    // let str = string.replace(pattern, `$3 de ${month} del 20$1`)
    // console.log(str)
    return str;
  };

  const handleClarification = () => {
    console.log(clarification);
  };

  const getTransactionDate = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, "$2");
    const month = getMonthName(extractMonth);
    let str = string.replace(pattern, `$3 de ${month}`);
    // let str = string.replace(pattern, `$3 de ${month} del 20$1`)
    // console.log(str)
    return str;
  };

  const getTransactionTime = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    let str = string.replace(pattern, `$1:$2:$3`);
    // console.log(str)
    return str;
  };

  const dateToLocalString = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, "$2");
    const month = getMonthName(extractMonth);
    let str = string.replace(pattern, `$3 de ${month} del 20$1`);
    return str;
    // de {getMonthName(selectedTransaction.date?.toDate().getMonth())} del {selectedTransaction.date?.toDate().getFullYear()}
  };
  const timeToLocalString = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    let str = string.replace(pattern, `a las $1:$2`);
    return str;
    // a las {selectedTransaction.date?.toDate().toLocaleTimeString()}
  };

  const handleTableState = (id) => {
    // console.log(id)
    document.getElementById(id).classList.toggle("hidden");
  };
  const handleToggleWeek = (id) => {
    if (toggleWeek === id) {
      toggleWeek = "";
      toggleWeekDetails = "";
    } else {
      toggleWeek = id;
    }
  };
  const handleToggleWeekDetails = (id) => {
    console.log(id);
    if (toggleWeekDetails === id) {
      toggleWeekDetails = "";
    } else {
      toggleWeekDetails = id;
    }
  };

  const getWeekDay = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    const d = new Date(string.replace(pattern, "$2-$3-20$1"));
    let index = d.getDay();
    // console.log(index)
    const days = {
      0: { name: "Domingo" },
      1: { name: "Lunes" },
      2: { name: "Martes" },
      3: { name: "Miércoles" },
      4: { name: "Jueves" },
      5: { name: "Viernes" },
      6: { name: "Sábado" },
    };
    return days[index].name;
  };

  const getCardBrand = (cc) => {
    console.log(cc.substring(0, 4));
    let amex = new RegExp("^3[47][0-9]{13}$");
    let visa = new RegExp("^4[0-9]{12}(?:[0-9]{3})?$");
    let cup1 = new RegExp("^62[0-9]{14}[0-9]*$");
    let cup2 = new RegExp("^81[0-9]{14}[0-9]*$");

    let mastercard = new RegExp("^5[1-5][0-9]{2}$");
    let mastercard2 = new RegExp("^2[2-7][0-9]{2}$");

    let disco1 = new RegExp("^6011[0-9]{12}[0-9]*$");
    let disco2 = new RegExp("^62[24568][0-9]{13}[0-9]*$");
    let disco3 = new RegExp("^6[45][0-9]{14}[0-9]*$");

    let diners = new RegExp("^3[0689][0-9]{12}[0-9]*$");
    let jcb = new RegExp("^35[0-9]{14}[0-9]*$");

    if (visa.test(cc)) {
      cardIcon = "visa";
      return "VISA";
    }
    if (amex.test(cc)) {
      cardIcon = "amex";
      return "AMEX";
    }
    if (mastercard.test(cc.substring(0, 4)) || mastercard2.test(cc.substring(0, 4))) {
      cardIcon = "master-card";
      return "MASTERCARD";
    }
    if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
      cardIcon = "bank-card-line";
      return "DISCOVER";
    }
    if (diners.test(cc)) {
      cardIcon = "bank-card-line";
      return "DINERS";
    }
    if (jcb.test(cc)) {
      cardIcon = "bank-card-line";
      return "JCB";
    }
    if (cup1.test(cc) || cup2.test(cc)) {
      cardIcon = "bank-card-line";
      return "CHINA_UNION_PAY";
    }
    return undefined;
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
        <i
          on:click={() => (cardBrand = "MasterCard")}
          on:keypress={(e) => (e.key === "Enter" ? (cardBrand = "MasterCard") : "")}
        >
          <Icons name="master-card" width="50" height="30" />
        </i>
        <i on:click={() => (cardBrand = "Visa")} on:keypress={(e) => (e.key === "Enter" ? (cardBrand = "Visa") : "")}>
          <Icons name="visa" width="50" height="30" />
        </i>
        <i on:click={() => (cardBrand = "AMEX")} on:keypress={(e) => (e.key === "Enter" ? (cardBrand = "AMEX") : "")}>
          <Icons name="amex" width="25" height="25" />
        </i>
        <i on:click={() => (cardBrand = "Other")} on:keypress={(e) => (e.key === "Enter" ? (cardBrand = "Other") : "")}>
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
      className={`btn-plain
        ${dateRangeStart != "" && dateRangeEnd != "" && cardBrand != "" ? "" : "disabled"}`}
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
      <div class="date">
        <p class="number">
          {date.getDate()} de {getMonthName(date.getMonth())} del {date.getFullYear()}
        </p>
      </div>
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
      <div class="card">
        <div><p>Monto Total</p></div>
        <div>
          <span>{resume?.Amount?.toLocaleString(localeParam.language, localeParam.currency) ?? "$0.00"} </span>
        </div>
      </div>
      <div class="card">
        <div><p>Comisión</p></div>
        <div>
          <span>{resume?.Comission?.toLocaleString(localeParam.language, localeParam.currency) ?? "$0.00"} </span>
        </div>
      </div>
      <div class="card">
        <div><p>Propinas</p></div>
        <div>
          <span>
            {resume?.Tips?.toLocaleString(localeParam.language, localeParam.currency) ?? "$0.00"}
          </span>
        </div>
      </div>
      <div class="card">
        <div><p>Saldo a Depositar</p></div>
        <div>
          <span>
            {resume?.Deposit?.toLocaleString(localeParam.language, localeParam.currency) ?? "$0.00"}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div class="transactions-view">
    {#if notFound}
      <div class="message card-container">
        <div class="msg">
          <p>No has realizado ventas el día de hoy</p>
        </div>
        <div class="description">
          <p>Aquí podrás ver el resumen de tus últimas ventas realizadas</p>
        </div>
      </div>
    {:else}
      <slot />
      <!-- {#if filter === "day"}
        <ViewDay
          bind:transactions
          bind:count
          bind:paginationStart
          bind:paginationEnd
          bind:active
        />
      {:else if filter === "week"}
        <ViewWeek
          bind:transactionsWeek={transactions}
          bind:count
          bind:paginationStart
          bind:paginationEnd
          bind:active
        />
      {:else if filter === "month"}
        <ViewMonth
          bind:transactionsMonth
          bind:transactions
          bind:count
          bind:paginationStart
          bind:paginationEnd
          bind:active
        />
      {/if} -->
    {/if}
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/transactions.scss";
</style>
