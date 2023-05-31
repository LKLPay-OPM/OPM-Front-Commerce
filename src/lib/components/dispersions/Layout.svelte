<script>
  /* stores */
  import { loggedInUser, redirectUrgentDispersions } from "$lib/stores";
  /* components */
  import Input from "$lib/components/Input.svelte";
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
  import { getMonthName, timeToLocalString, dateToLocalString } from "$lib/utils/date.js";

  export let user;
  export let data;
  // const uid = user.uid;
  let dispersions = data?.dispersions /* ?.dispersions */ ?? [];
  let resume = data?.resume /* ?.dispersions */ ?? [];
  let selectedDispersion = {};
  let dispersionToArray = [];
  let dispersionDetailView = false;
  let notFound = false;
  let notFoundMessage = "No se encontraron registros";
  let loading = false;
  let date = new Date();
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
    availableBalance: resume.depositBalance ?? 0,
    immediateDepositCommission: 0,
    immediateDepositQty: 0,
    toDeposit: 0,
  };

  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
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

  const fetchByDayButton = async () => {
    // active = "day";
    dispersionDetailView = false;
    // selectedDispersion = {};
    loading = true;
    // dispersions = [...$loggedInUser.dispersions];
    dispersions = [];
    if (dispersions.length <= 0) {
      dispersions.push(
        {
          date: "230222",
          time: "183033",
          type: "Inmediata",
          id: "123",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
          reference: 6326701,
          tracking: "IACH2GJ05YW9MV",
          clabe: "646180173742378227",
          transactions: 37,
        },
        {
          date: "230223",
          time: "093021",
          type: "Tradicional",
          id: "124",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
          reference: 6326701,
          tracking: "IACH2GJ05YW9MV",
          clabe: "646180173742378227",
          transactions: 37,
        },
        {
          date: "230223",
          time: "130638",
          type: "Urgente",
          id: "125",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
          reference: 6326701,
          tracking: "IACH2GJ05YW9MV",
          clabe: "646180173742378227",
          transactions: 37,
        },
        {
          date: "230223",
          time: "183033",
          type: "Inmediata",
          id: "126",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
          reference: 6326701,
          tracking: "IACH2GJ05YW9MV",
          clabe: "646180173742378227",
          transactions: 37,
        },
        {
          date: "230224",
          time: "093021",
          type: "Tradicional",
          id: "127",
          total: 1000,
          commission: 35,
          dispersion: 965,
          afterDispersion: 0,
          reference: 6326701,
          tracking: "IACH2GJ05YW9MV",
          clabe: "646180173742378227",
          transactions: 37,
        }
      );
      // console.log($loggedInUser.dispersions)
      // console.log(dispersions)
    }
    dispersionFound();
  };

  const fetchByDateRange = async () => {
    active = "range";
    dispersionDetailView = false;
    // selectedDispersion = {};
    loading = true;
    // dispersions = [...$loggedInUser.dispersions];
    if (dispersions.length <= 0) {
      dispersions.push(
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        },
        {
          date: Date.now(),
          id: "123",
          total: 1000,
          commission: 30,
          dispersion: 970,
          afterDispersion: 0,
        }
      );
    }
    dispersionFound();
    // console.log(dispersions)
  };

  const fetchByTicketId = async () => {
    active = "ticket";
    dispersionDetailView = false;
    // selectedDispersion = {};
    loading = true;
    // dispersions = [...$loggedInUser.dispersions];
    if (dispersions.length <= 0) {
      dispersions.push({
        date: Date.now(),
        id: "123",
        total: 1000,
        commission: 30,
        dispersion: 970,
        afterDispersion: 0,
      });
    }
    dispersionFound();
    // console.log(dispersions)
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

  const handleClarification = () => {
    console.log(clarification);
  };
  const handleImmediateDeposit = () => {
    immediateDeposit.toDeposit = getPercentage(
      immediateDeposit.immediateDepositQty,
      immediateDeposit.immediateDepositCommission
    );
    immediateDeposit = {
      availableBalance: resume.depositBalance,
      immediateDepositQty: 0,
      toDeposit: 0,
    };
  };

  const handleImmediateDepositPreference = () => {};

  const traditionalDepositPreference = () => {
    active = "1";
  };
  const immediateDepositPreference = () => {
    showModal(modalImmediateDepositPreference);
    active = "2";
  };

  let buttonGroupOptions = [
    { value: "1", name: "Tradicional", click: traditionalDepositPreference },
    { value: "2", name: "Inmediato", click: immediateDepositPreference },
  ];

  const getClabe = (string) => {
    var pattern = /(\d{3})(\d{11})(\d{4})/;
    return string.replace(pattern, `$1***********$3`);
    // return result;
  };

  const showModal = (option) => {
    option.show();
  };

  const closeModal = (option) => {
    option.closeModal();
  };

  onMount(async () => {
    // await fetchDBRates();
    // await fetchByDayButton();
    if ($redirectUrgentDispersions === true) {
      $redirectUrgentDispersions = false;
      showModal(modalImmediateDeposit);
    }
  });
</script>

<!-- MODAL DEPOSIT PREFERENCE-->
<Modal className={`modal-medium`} bind:this={modalImmediateDepositPreference}>
  <div slot="header">
    <p>Contratar Depósito Inmediato</p>
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
          <p>{immediateDeposit.immediateDepositCommission}%</p>
        </div>
      </div>
      <div class="terms">
        <div class="terms-checkbox">
          <Checkbox bind:checked={termsDepositPreference} />
        </div>
        <p>
          He Leído, entendido y acepto los
          <a href="/#terms">Términos y Condiciones Generales</a> de LklPay, así como su
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
      {#if immediateDeposit.availableBalance < 500}
        <div class="error">
          <p>
            El monto mínimo para solicitar es de $500.00 mxn más el costo extra del {immediateDeposit.immediateDepositCommission}%
          </p>
        </div>
      {:else}
        <div class="row-element">
          <!-- <p>{immediateDeposit.availableBalance.toLocaleString(localeParam.language, localeParam.currency)}</p> -->
          <IconInput
            icon="dollar"
            label="Saldo Disponible"
            id="availableAmountTxtField"
            value={immediateDeposit.availableBalance}
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
            <p>Comisión por disposición inmediata</p>
          </div>
          <div class="content">
            <p>{immediateDeposit.immediateDepositCommission} %</p>
          </div>
        </div>
        <div class="column-element">
          <div class="gray-title">
            <p>Monto a Depositar</p>
          </div>
          <div class="content">
            <p>
              ${(immediateDeposit.immediateDepositQty * .013).toFixed(2) ?? "$0"}
            </p>
          </div>
        </div>
        <div class="terms">
          <div class="terms-checkbox">
            <Checkbox bind:checked={terms} />
          </div>
          <p>
            He Leído, entendido y acepto los
            <a href="/#terms">Términos y Condiciones Generales</a> de LklPay, así como su
            <a href="/#privacy">Política de Privacidad</a> y, por lo tanto estoy de acuerdo en el uso y procesamiento de
            datos personales.
          </p>
        </div>
      {/if}
    </div>
  </div>
  <div class="modal-buttons" slot="footer">
    {#if immediateDeposit.availableBalance < 500}
      <Input
        on:click={closeModal(modalImmediateDeposit)}
        label="Entendido"
        id="buttonCloseModalImmediateDeposit"
        type="button"
        className="btn-plain btn-orange"
        icon=""
      />
    {:else}
      <Input
        on:click={closeModal(modalImmediateDeposit)}
        label="Cerrar"
        id="buttonCloseModalImmediateDeposit"
        type="button"
        className="btn-plain"
        icon=""
      />
      {#if immediateDeposit.availableBalance > 500 && terms}
        <Input
          on:click={closeModal(modalImmediateDeposit)}
          on:click={() => handleImmediateDeposit()}
          label="Solicitar Depósito"
          id="buttonSaveModalImmediateDeposit"
          type="button"
          className={`btn-plain
            ${
              immediateDeposit.immediateDepositQty > 0 && immediateDeposit.immediateDepositQty > 500 && terms === true
                ? ""
                : "disabled"
            }`}
          icon=""
        />
      {/if}
    {/if}
  </div>
</Modal>
<!-- MODAL DISPERSION CLARIFICATION -->
<Modal className={`modal-medium`} bind:this={modalClarification}>
  <div slot="header">
    <p>Solicitar Aclaración</p>
  </div>
  <div slot="content">
    <div class="clarifications">
      <div class="title">Cantidad</div>
      <div class="description">
        <p>
          {immediateDeposit.availableBalance?.toLocaleString(localeParam.language, localeParam.currency)}
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
        <div class="date">
          <p>
            {date.getDate()} de {getMonthName(date.getMonth())} del {date.getFullYear()}
          </p>
        </div>
        <ButtonGroup {active} options={buttonGroupOptions} on:click={handleFilterClick} />
        <!-- <ButtonGroup bind:active options={buttonGroupOptions} /> -->
      </div>
      <div class="top__right">
        <div class="dispersion-search-bar">
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
            label=""
            id="csv-export"
            type="button"
            className="btn-plain btn-square fill-blue {dispersions.length > 0 ? '' : 'disabled'}"
            icon="csv-fill"
          />
          <Input
            label=""
            id="excel-export"
            type="button"
            className="btn-plain btn-square fill-green {dispersions.length > 0 ? '' : 'disabled'}"
            icon="xls-fill"
          />
          <Input
            label=""
            id="print"
            type="button"
            className="btn-plain btn-square fill-blue {dispersions.length > 0 ? '' : 'disabled'}"
            icon="print"
          />
          <Input
            label=""
            id="pdf-export"
            type="button"
            className="btn-plain btn-square fill-red {dispersions.length > 0 ? '' : 'disabled'}"
            icon="pdf-fill"
          />
          <!-- <Input on:click={exportDataToCSV(dispersions)} label="" id="csv-export" type="button" className="btn-plain btn-square {dispersions.length > 0 ? '' : 'disabled'}" icon="csv-fill"/> -->
          <!-- <Input on:click={exportDataToExcel(dispersions)} label="" id="excel-export" type="button" className="btn-plain btn-square {dispersions.length > 0 ? '' : 'disabled'}" icon="xls-fill"/> -->
          <!-- <Input on:click={exportDataToPDF(dispersions)} label="" id="pdf-export" type="button" className="btn-plain btn-square {dispersions.length > 0 ? '' : 'disabled'}" icon="pdf-fill"/> -->
        </div>
      </div>
    </div>
    <div class="middle">
      <div class="card-group">
        <div class="button">
          <Input
            on:click={showModal(modalClarification)}
            label="Solicitar Aclaración"
            id="aclarationButton"
            type="button"
            className="btn-plain"
            icon=""
          />
        </div>
        <div class="card">
          <div><p>Saldo a Depositar</p></div>
          <div>
            <span>{resume.depositBalance?.toLocaleString(localeParam.language, localeParam.currency) ?? "$0"}</span>
          </div>
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
      <div class="not-found">
        <b>
          {notFoundMessage}
        </b>
      </div>
    {:else}
      <Table bind:dispersions />
    {/if}
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/dispersions.scss";
</style>
