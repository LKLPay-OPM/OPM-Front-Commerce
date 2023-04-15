<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  /* exports */
  export let data;
  /* imports */
  import { goto } from "$app/navigation";

  let resume = data?.response?.resume;
  let yearMonth = data?.response?.yearMonth;
  let transactions = data?.response?.transactions ?? [];

  $: {
    console.log(data.response);
  }

  const localeParam = {
    language: "es-MX",
    currency: {
      style: "currency",
      currency: "MXN",
    },
  };

  function handleFilterClick({ detail }) {
    // const value = detail?.value;
    // active = value;
    goto(
      `?filter=${active ?? "day"}&start=${paginationStart}&end=${paginationEnd}`
    );
  }

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

  const getTransactionDate = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, "$2");
    const month = getMonthName(extractMonth);
    let str = string.replace(pattern, `$3 de ${month}`);
    return str;
  };

  const getTransactionTime = (string) => {
    var pattern = /(\d{2})(\d{2})(\d{2})/; // String pattern replace for date
    let str = string.replace(pattern, `$1:$2:$3`);
    return str;
  };

  const getMonthPeriod = (string) => {
    var pattern = /(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, "$2");
    const month = getMonthName(extractMonth);
    return string.replace(pattern, `${month} 20$1`);
  };

  const returnToMonthView = () => {
    goto("/transactions/month");
  };
</script>

<div id={`pdfTable-${yearMonth}`} class="table-container">
  <div class="card-container">
    <div class="row">
      <div class="title">
        <i
          class="arrow-blue clickable"
          on:click={returnToMonthView}
          on:keypress={(e) => (e.key === "Enter" ? returnToMonthView : "")}
        >
          <Icons name="arrow-bwd" width="24" height="24" />
        </i>
        {getMonthPeriod(yearMonth)}
      </div>
    </div>
    <table class="table-content">
      <thead style="height:1.5rem">
        <tr>
          <th class="responsive">Fecha</th>
          <th class="responsive">Ticket</th>
          <th>Ventas</th>
          <th>Comisión</th>
          <th>IVA</th>
          <th>Depósito</th>
        </tr>
      </thead>
      <thead style="height:1.5rem">
        <tr>
          <th class="responsive" />
          <th class="responsive" />
          <th>
            {resume?.Amount?.toLocaleString(
              localeParam.language,
              localeParam.currency
            )}
          </th>
          <th>
            {resume?.Comission?.toLocaleString(
              localeParam.language,
              localeParam.currency
            )}
          </th>
          <th class="responsive">
            {resume?.IVA?.toLocaleString(
              localeParam.language,
              localeParam.currency
            )}
          </th>
          <th>
            {resume?.Deposit?.toLocaleString(
              localeParam.language,
              localeParam.currency
            )}
          </th>
        </tr>
      </thead>
      <tbody class="inside">
        {#each transactions as transaction}
          <tr
            class="clickable number"
            on:click={() =>
              goto(`/transactions/detail?ticket=${transaction?._id}`)}
          >
            <td class="responsive"
              >{getTransactionDate(transaction["Transaction Date"]) +
                " - " +
                getTransactionTime(transaction["Transaction Time"])}</td
            >
            <td class="responsive">{transaction["Transaction Time"]}</td>
            <td
              >{parseFloat(transaction.Amount / 100)?.toLocaleString(
                localeParam.language,
                localeParam.currency
              )}</td
            >
            <td
              >{parseFloat((transaction.Amount / 100) * 0.035)?.toLocaleString(
                localeParam.language,
                localeParam.currency
              )}</td
            >
            <td class="responsive">
              {transaction?.IVA?.toLocaleString(
                localeParam.language,
                localeParam.currency
              )}
            </td>
            <td
              >{parseFloat((transaction.Amount / 100) * 0.965)?.toLocaleString(
                localeParam.language,
                localeParam.currency
              )}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>
    <!-- {#if count > 10}
      <Pagination
        bind:paginationStart
        bind:paginationEnd
        bind:count
        on:pagination={handleFilterClick}
      />
    {/if} -->
  </div>
</div>
<style lang="scss">
  @import 'src/lib/styles/transactions.scss';
</style>