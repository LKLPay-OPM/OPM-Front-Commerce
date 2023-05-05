<script>
  import { isLoggedIn, loggedInUser, redirectBankProfile } from "$lib/stores";
  import { onMount, afterUpdate } from "svelte";
  import Input from "$lib/components/Input.svelte";
  import Icons from "$lib/components/Icons.svelte";
  import ButtonGroup from "$lib/components/ButtonGroup.svelte";
  import noUser from "$lib/assets/no_user.png";

  export let selected;
  export let branches;
  export let branchView = false;
  export let all;
  export let active = "day";

  let pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date

  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
  };

  $: {
    // console.log(all)
    let arr = [];
    branches.map((doc) => {
      doc.transactions.map((el) => {
        arr.push(el);
      });
    });
    all = [...arr];
    // console.log(all)
    // console.log(branchView)
  }

  const getBusinessLineName = (businessLine) => {
    const businessLineArray = {
      travelAgency: { name: "Agencias de Viajes" },
      aggregators: { name: "Agregadoras" },
      insurers: { name: "Aseguradoras" },
      charity: { name: "Beneficencia" },
      collegeAndUniversities: { name: "Colegios y Universidades" },
      fastFood: { name: "Comida Rápida" },
      basicEducation: { name: "Educación Básica" },
      entertainment: { name: "Entretenimiento" },
      parkings: { name: "Estacionamientos" },
      pharmacy: { name: "Farmacias" },
      gasStations: { name: "Gasolineras" },
      hospitals: { name: "Hospitales" },
      hotels: { name: "Hoteles" },
      doctorsAndDentists: { name: "Doctores y Dentistas" },
      miscellaneous: { name: "Miscelánea" },
      others: { name: "Otros" },
      toll: { name: "Peaje" },
      sparePartsAndHardwareStores: { name: "Refacciones y Ferreterías" },
      carRental: { name: "Renta de Autos" },
      restaurants: { name: "Restaurantes" },
      beautySalons: { name: "Salones de Belleza" },
      supermarkets: { name: "Supermercados" },
      telecommunications: { name: "Telecomunicaciones" },
      airTransport: { name: "Transporte Aéreo" },
      landPassengerTransport: { name: "Transaporte Terrestre de Pasajeros" },
    };
    return businessLineArray[businessLine].name;
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
    };
    return monthsArray[month].value;
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

  const fetchByDayButton = (data) => {
    active = "day";
    var pattern = /(\d{2})\/(\d{2})\/(\d{2})/; // String pattern replace for date
    const curr = new Date();
    const today = new Date(curr.setDate(curr.getDate())).setHours(0, 0, 0, 0); // Sets Date to today day at 00:00
    // Dates in dd/MM/YY
    const strToday = new Intl.DateTimeFormat("es-MX", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }).format(today);

    const array = data.filter((date) => date["Transaction Date"] === strToday.replace(pattern, "$3$2$1"));
    return array;
  };

  const fetchByWeekButton = (data) => {
    active = "week";
    var pattern = /(\d{2})\/(\d{2})\/(\d{2})/; // String pattern replace for date
    const curr = new Date();
    const firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 1)).setHours(0, 0, 0, 0);
    const lastDay = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7)).setHours(0, 0, 0, 0);

    const first = new Intl.DateTimeFormat("es-MX", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }).format(firstDay);
    const last = new Intl.DateTimeFormat("es-MX", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }).format(lastDay);

    const array = data.filter(
      (date) =>
        date["Transaction Date"] >= first.replace(pattern, "$3$2$1") &&
        date["Transaction Date"] <= last.replace(pattern, "$3$2$1")
    );
    return array;
  };
  const fetchByMonthButton = (data) => {
    active = "month";
    var pattern = /(\d{2})\/(\d{2})\/(\d{2})/; // String pattern replace for date
    //transactions = [];
    const curr = new Date();
    const currentMonth = new Date(curr.setMonth(curr.getMonth(), 1)).setHours(0, 0, 0, 0); // Sets Date to actual month day 1 at 00:00
    const lastDayOfMonth = new Date(curr.setMonth(curr.getMonth() + 1, 0)).setHours(0, 0, 0, 0); // Sets Date to last day of month at 00:00

    const first = new Intl.DateTimeFormat("es-MX", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }).format(currentMonth);
    const lastDayMonth = new Intl.DateTimeFormat("es-MX", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }).format(lastDayOfMonth);

    const array = data.filter(
      (date) =>
        date["Transaction Date"] >= first.replace(pattern, "$3$2$1") &&
        date["Transaction Date"] <= lastDayMonth.replace(pattern, "$3$2$1")
    );
    return array;
  };

  let buttonGroupOptions = [
    { value: "day", name: "Día", click: fetchByDayButton },
    { value: "week", name: "Semana", click: fetchByWeekButton },
    { value: "month", name: "Mes", click: fetchByMonthButton },
  ];

  onMount(async () => {
    fetchByDayButton();
  });
</script>

<div class="container">
  <div class="element text-center">
    <ButtonGroup bind:active options={buttonGroupOptions} />
  </div>
  {#if !branchView}
    <div class="card-secondary row padding-1">
      <div class="element">
        <div class="title-blue">N° de Ventas</div>
        <div class="description text-center">
          {#if active === "day"}
            {fetchByDayButton(all).length}
          {:else if active === "week"}
            {fetchByWeekButton(all).length}
          {:else if active === "month"}
            {fetchByMonthButton(all).length}
          {/if}
        </div>
      </div>
      <div class="element">
        <div class="title-blue">Monto</div>
        <div class="description text-center">
          {#if active === "day"}
            {fetchByDayButton(all)
              .reduce((prev, curr) => prev + curr.Amount / 100, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "week"}
            {fetchByWeekButton(all)
              .reduce((prev, curr) => prev + curr.Amount / 100, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "month"}
            {fetchByMonthButton(all)
              .reduce((prev, curr) => prev + curr.Amount / 100, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {/if}
        </div>
      </div>
      <div class="element r425">
        <div class="title-blue">Comisión</div>
        <div class="description text-center">
          {#if active === "day"}
            {fetchByDayButton(all)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.035, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "week"}
            {fetchByWeekButton(all)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.035, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "month"}
            {fetchByMonthButton(all)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.035, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {/if}
        </div>
      </div>
      <div class="element r425">
        <div class="title-blue">A Depositar</div>
        <div class="description text-center">
          {#if active === "day"}
            {fetchByDayButton(all)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.965, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "week"}
            {fetchByWeekButton(all)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.965, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "month"}
            {fetchByMonthButton(all)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.965, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {/if}
        </div>
      </div>
    </div>
    <div class="card-container padding-2">
      {#each branches as branch, index}
        <div
          class="card-secondary row padding-1 clickable"
          on:click={() => (selected = branch)}
          on:keypress={(e) => (e.key === "Enter" ? (selected = branch) : "")}
          on:click={() => (branchView = !branchView)}
          on:keypress={(e) => (e.key === "Enter" ? (branchView = !branchView) : "")}
        >
          <div class="element">
            <div class="avatar-container">
              <div class="avatar">
                <img class="avatar-img" alt="imagen" src={branch.avatar ? branch.avatar : noUser} />
              </div>
            </div>
          </div>
          <div class="element-center min-width">
            <div class="title-blue text-left">
              {branch.name}
            </div>
            <div class="description text-left">
              {branch.manager.name}
              {branch.manager.firstLastName}
            </div>
          </div>
          <div class="element-center r425 r540">
            <div class="title-blue text-center">N° de Ventas</div>
            <div class="description text-center">
              {#if active === "day"}
                {fetchByDayButton(branch.transactions).length}
              {:else if active === "week"}
                {fetchByWeekButton(branch.transactions).length}
              {:else if active === "month"}
                {fetchByMonthButton(branch.transactions).length}
              {/if}
            </div>
          </div>
          <div class="element-center r425">
            <div class="title-blue text-center">Monto</div>
            <div class="description text-center">
              {#if active === "day"}
                {fetchByDayButton(branch.transactions)
                  .reduce((prev, curr) => prev + curr.Amount / 100, 0)
                  .toLocaleString(localeParam.language, localeParam.currency)}
              {:else if active === "week"}
                {fetchByWeekButton(branch.transactions)
                  .reduce((prev, curr) => prev + curr.Amount / 100, 0)
                  .toLocaleString(localeParam.language, localeParam.currency)}
              {:else if active === "month"}
                {fetchByMonthButton(branch.transactions)
                  .reduce((prev, curr) => prev + curr.Amount / 100, 0)
                  .toLocaleString(localeParam.language, localeParam.currency)}
              {/if}
            </div>
          </div>
          <div class="element-center r425 r540">
            <div class="title-blue text-center">Comisión</div>
            <div class="description text-center">
              {#if active === "day"}
                {fetchByDayButton(branch.transactions)
                  .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.035, 0)
                  .toLocaleString(localeParam.language, localeParam.currency)}
              {:else if active === "week"}
                {fetchByWeekButton(branch.transactions)
                  .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.035, 0)
                  .toLocaleString(localeParam.language, localeParam.currency)}
              {:else if active === "month"}
                {fetchByMonthButton(branch.transactions)
                  .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.035, 0)
                  .toLocaleString(localeParam.language, localeParam.currency)}
              {/if}
            </div>
          </div>
          <div class="element-center arrow-blue">
            <Icons name={"arrow-fwd"} width="24" height="24" />
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="card-secondary row padding-1">
      <div class="element">
        <div class="title-blue">N° de Ventas</div>
        <div class="description text-center">
          {#if active === "day"}
            {fetchByDayButton(selected.transactions).length}
          {:else if active === "week"}
            {fetchByWeekButton(selected.transactions).length}
          {:else if active === "month"}
            {fetchByMonthButton(selected.transactions).length}
          {/if}
        </div>
      </div>
      <div class="element">
        <div class="title-blue">Monto</div>
        <div class="description text-center">
          {#if active === "day"}
            {fetchByDayButton(selected.transactions)
              .reduce((prev, curr) => prev + curr.Amount / 100, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "week"}
            {fetchByWeekButton(selected.transactions)
              .reduce((prev, curr) => prev + curr.Amount / 100, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "month"}
            {fetchByMonthButton(selected.transactions)
              .reduce((prev, curr) => prev + curr.Amount / 100, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {/if}
        </div>
      </div>
      <div class="element r425 r540 r768">
        <div class="title-blue">Comisión</div>
        <div class="description text-center">
          {#if active === "day"}
            {fetchByDayButton(selected.transactions)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.035, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "week"}
            {fetchByWeekButton(selected.transactions)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.035, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "month"}
            {fetchByMonthButton(selected.transactions)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.035, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {/if}
        </div>
      </div>
      <div class="element r425 r540 r768">
        <div class="title-blue">A Depositar</div>
        <div class="description text-center">
          {#if active === "day"}
            {fetchByDayButton(selected.transactions)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.965, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "week"}
            {fetchByWeekButton(selected.transactions)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.965, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {:else if active === "month"}
            {fetchByMonthButton(selected.transactions)
              .reduce((prev, curr) => prev + (curr.Amount / 100) * 0.965, 0)
              .toLocaleString(localeParam.language, localeParam.currency)}
          {/if}
        </div>
      </div>
    </div>
    <div class="transaction-tables">
      <div id="pdfTable" class="table-container">
        <div class="card-container">
          <table class="table-content">
            <thead>
              <tr>
                <th>Fecha</th>
                <th class="r425 r540 r768">Ticket</th>
                <th>Monto</th>
                <th class="r425 r540 r768">Comisión</th>
                <th class="r425 r540 r768">Depósito</th>
              </tr>
            </thead>
            <tbody>
              {#if active === "day"}
                {#each fetchByDayButton(selected.transactions) as transaction}
                  <tr class="">
                    <td
                      >{getTransactionDate(transaction["Transaction Date"]) +
                        " - " +
                        getTransactionTime(transaction["Transaction Time"])}</td
                    >
                    <td class="r425 r540 r768">{transaction["Transaction Time"]}</td>
                    <td
                      >{parseFloat(transaction.Amount / 100)?.toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                    <td class="r425 r540 r768"
                      >{parseFloat((transaction.Amount / 100) * 0.035)?.toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                    <td class="r425 r540 r768"
                      >{parseFloat((transaction.Amount / 100) * 0.965)?.toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                  </tr>
                {/each}
              {:else if active === "week"}
                {#each fetchByWeekButton(selected.transactions) as transaction}
                  <tr class="">
                    <td
                      >{getTransactionDate(transaction["Transaction Date"]) +
                        " - " +
                        getTransactionTime(transaction["Transaction Time"])}</td
                    >
                    <td class="r425 r540 r768">{transaction["Transaction Time"]}</td>
                    <td
                      >{parseFloat(transaction.Amount / 100)?.toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                    <td class="r425 r540 r768"
                      >{parseFloat((transaction.Amount / 100) * 0.035)?.toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                    <td class="r425 r540 r768"
                      >{parseFloat((transaction.Amount / 100) * 0.965)?.toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                  </tr>
                {/each}
              {:else if active === "month"}
                {#each fetchByMonthButton(selected.transactions) as transaction}
                  <tr class="">
                    <td
                      >{getTransactionDate(transaction["Transaction Date"]) +
                        " - " +
                        getTransactionTime(transaction["Transaction Time"])}</td
                    >
                    <td class="r425">{transaction["Transaction Time"]}</td>
                    <td
                      >{parseFloat(transaction.Amount / 100)?.toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                    <td class="r425"
                      >{parseFloat((transaction.Amount / 100) * 0.035)?.toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                    <td class="r425"
                      >{parseFloat((transaction.Amount / 100) * 0.965)?.toLocaleString(
                        localeParam.language,
                        localeParam.currency
                      )}</td
                    >
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  /* ========================================== */
  .min-width {
    min-width: 12.5rem;
  }
  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .date {
    font-style: normal;
    font-weight: 700;
    font-size: 1.25rem; /* 20px */
    line-height: 1.25rem; /* 20px */
    text-align: center;
    /* Text */
    color: $primary-dark;
  }
  .padding-1 {
    padding: 1rem;
  }

  .padding-2 {
    padding: 2rem;
  }
  .content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: -webkit-fill-available;
  }
  .col {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .row {
    display: grid;
    grid-auto-flow: column;
  }

  .left {
    min-width: 17.5rem; /* 280px */
  }

  .right {
    width: -webkit-fill-available;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .avatar-container {
    display: flex;
    width: 100%;
    justify-content: center;
  }
  .avatar {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
    background-color: $primary-dark;
  }
  .avatar img {
    height: 100%;
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
    justify-content: center;
    cursor: pointer;
  }

  .title-blue {
    font-weight: 700;
    font-size: 20px;
    line-height: 16px;
    text-align: center;
    color: $primary-dark;
    margin: 0rem 0rem 0.5rem 0rem;
  }
  .description {
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: $primary-dark;
    display: flex;
    align-items: center;
  }

  .title {
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    text-align: left;
    color: #fd9053;
    margin: 0rem 0rem 0.5rem 0rem;
  }

  .divider-hor {
    background: linear-gradient(138.32deg, rgba(0, 0, 0, 0.5) 8.26%, rgba(255, 255, 255, 0.5) 91.02%), #eaecf0;
    background-blend-mode: soft-light, normal;
    /* n-stroke */

    border: 1px solid rgba(255, 255, 255, 0.4);
    /* n-icon-1-1-2-in */

    box-shadow: inset -1px -1px 2px #fafbff, inset 1px 1px 2px #a6abbd;
    border-radius: 5px;
    height: 0.5rem; /* 8px */
    width: -webkit-fill-available;
  }

  .text-center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  .text-left {
    display: flex;
    justify-content: left;
    align-items: left;
    text-align: left;
  }

  .element-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* align-items: start; */
  }

  .arrow-blue {
    color: $primary-light;
    cursor: pointer;
  }

  .transaction-tables {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .table-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .table-content {
    /* width: 46.875rem; */
    /* width: 70%; */
    /* border-bottom: 1px solid; */
    border-collapse: collapse;
    margin: 2rem;
    border-spacing: 1rem;
    min-width: 40rem;
  }

  .table-content thead {
    font-family: "Raleway";
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 18px;
    text-align: center;
    /* text-placeholder */
    color: $primary-dark;
    height: 2.375rem;
  }

  .clickable {
    cursor: pointer;
  }

  .table-content td {
    font-family: "Roboto";
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    color: #000000;
    text-align: center;
    border-bottom: 1px solid #8c9fb1;
    padding: 0.625rem 0rem 0.625rem 0rem;
    min-width: 7rem;
  }

  th:first-child {
    text-align: left;
  }
  td:first-child {
    text-align: left;
  }
  .card-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 425px) {
    .r425 {
      display: none;
    }
    .min-width {
      min-width: 10rem;
    }

    .transaction-tables {
      margin: 0 0 2rem 0;
    }

    .container {
      margin: 0 0 2rem 0;
    }
  }

  @media (max-width: 540px) {
    .min-width {
      min-width: 10rem;
    }
    .container {
      margin: 0 0 2rem 0;
    }

    .transaction-tables {
      margin: 0 0 2rem 0;
    }

    .table-container {
      display: block;
      width: 100%;
    }

    .table-content {
      min-width: auto;
      width: -webkit-fill-available;
    }
    .r540 {
      display: none;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    .transaction-tables {
      margin: 0 0 2rem 0;
    }
    .table-container {
      display: block;
      width: 100%;
    }

    .table-content {
      min-width: auto;
      width: -webkit-fill-available;
    }
    .r768 {
      display: none;
    }
  }
</style>
