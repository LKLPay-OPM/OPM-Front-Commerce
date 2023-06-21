<script>
  /* components */
  import Pagination from "$lib/components/Pagination.svelte";
  import Icons from "$lib/components/Icons.svelte";
  /* svelte */
  import { goto } from "$app/navigation";
  /* utils */
  import { timeToLocalString, dateToLocalString } from "$lib/utils/date";
  /* exports */
  export let data;
  let transactions = data?.response?.transactions ?? [];
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
    goto(`?filter=${active ?? "day"}&start=${paginationStart}&end=${paginationEnd}`);
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
</script>

<div class="transaction-tables">
  <div id="pdfTable" class="table-container">
    <div class="card-container">
      <table class="table-content">
        <thead>
          <tr>
            <th>Fecha</th>
            <th class="responsive">N° Ticket</th>
            <th>Monto</th>
            <th class="responsive">Comisión</th>
            <th class="responsive">IVA</th>
            <th class="responsive">Depósito</th>
            <th class="responsive">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {#each transactions as transaction}
            <tr class="clickable number" on:click={() => goto(`/transactions/detail?ticket=${transaction?._id}`)}>
              <td
                >{dateToLocalString(transaction["Transaction Date"]) +
                  " - " +
                  timeToLocalString(
                    transaction["Transaction Time"]
                  )}<!-- {transaction.date?.toDate().getDate()} {getMonthName(transaction.date?.toDate().getMonth())} {transaction.date?.toDate().getFullYear()} - {transaction.date?.toDate().toLocaleTimeString()} --></td
              >
              <td class="responsive">{transaction?.id}</td>
              <td>{transaction.Amount?.toLocaleString(localeParam.language, localeParam.currency)}</td>
              <td class="responsive"
                >{transaction.comission?.toLocaleString(localeParam.language, localeParam.currency)}</td
              >
              <td class="responsive">{transaction.IVA?.toLocaleString(localeParam.language, localeParam.currency)}</td>
              <td class="responsive"
                >{transaction.deposit?.toLocaleString(localeParam.language, localeParam.currency)}</td
              >
              <td class="responsive">
                <i class="icon tooltip">
                  <Icons
                    name={transaction.type === "tpv"
                      ? "terminal"
                      : transaction.type === "e-commerce"
                      ? "qr-code"
                      : "terminal"}
                    width="24"
                    height="24"
                  />
                  <span class="tooltiptext"
                    >{transaction.type === "tpv"
                      ? "Terminal Punto de Venta"
                      : transaction.type === "e-commerce"
                      ? "Link de Pago"
                      : ""}</span
                  >
                </i>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if count > 10}
        <Pagination bind:paginationStart bind:paginationEnd bind:count on:pagination={handleFilterClick} />
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/transactions/tables/day.scss";
</style>
