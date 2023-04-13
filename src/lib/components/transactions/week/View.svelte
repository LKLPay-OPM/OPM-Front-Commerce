<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  /* css */
  import "$lib/styles/transactions.scss";
  /* svelte */
  import { goto } from "$app/navigation";
  /* exports */
  export let data;
  let transactionsWeek = data?.response?.transactions ?? [];
  let count = data?.response?.count ?? 0;
  let paginationStart = data?.start ?? 0;
  let paginationEnd = data?.end ?? 10;
  let active = data?.filter ?? "day";

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

  const goToTransaction = (date) => {
    goto(`/transactions/week/${date}`);
  };
</script>

<div class="transaction-tables">
  <div id="pdfTable" class="table-container">
    <div class="card-container">
      <table class="table-content">
        <thead>
          <tr>
            <th class="title">Día</th>
            <th class="title">N° Ventas</th>
            <th class="title">Monto</th>
            <th class="title responsive">Comisión</th>
            <th class="title responsive">IVA</th>
            <th class="title responsive">Depósito</th>
          </tr>
        </thead>
        <tbody>
          {#each transactionsWeek as day}
            <tr
              class="clickable"
              on:click={() => goToTransaction(day.date)}
              on:keypress={(e) =>
                e.key === "Enter" ? () => goToTransaction(day.date) : ""}
            >
              <td class="element">{day.day} - {getTransactionDate(day.date)}</td
              >
              <td class="element">{day.sold}</td>
              <td class="element">
                {day.sales.toLocaleString(
                  localeParam.language,
                  localeParam.currency
                )}
              </td>
              <td class="element responsive">
                {day.comission.toLocaleString(
                  localeParam.language,
                  localeParam.currency
                )}
              </td>
              <td class="element responsive" />
              <td class="element responsive">
                {day.deposit.toLocaleString(
                  localeParam.language,
                  localeParam.currency
                )}
              </td>
              <i class="arrow arrow-blue">
                <Icons name="arrow-fwd" width="24" height="24" />
              </i>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
