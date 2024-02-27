<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  /* exports */
  export let data;
  /* imports */
  import { goto } from "$app/navigation";
  /* utils */
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import { getIconStatusClass } from "$lib/utils/iconClass.js";
  import { getMonthPeriod, getTransactionTime, dateToLocalStringShort } from "$lib/utils/date";

  let resume = data?.response?.resume;
  let yearMonth = data?.response?.yearMonth;
  let transactions = data?.response?.transactions ?? [];
  let count = data?.response?.count ?? 0;
  let paginationStart = data?.start ?? 0;
  let paginationEnd = data?.end ?? 10;

  function handleFilterClick({ detail }) {
    // const value = detail?.value;
    // active = value;
    goto(`?start=${paginationStart}&end=${paginationEnd}`);
  }

  const returnToMonthView = () => {
    goto("/transactions/month");
  };
</script>

<div id={`pdfTable-${yearMonth}`} class="table-container">
  <div class="card-primary">
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
          <th class="responsive">IVA</th>
          <th>Depósito</th>
          <th class="responsive">Tipo</th>
        </tr>
      </thead>
      <thead style="height:1.5rem">
        <tr>
          <th class="responsive" />
          <th class="responsive" />
          <th class="amount">
            {currencyFormatLocal(resume?.Amount)}
          </th>
          <th class="amount">
            {currencyFormatLocal(resume?.Comission)}
          </th>
          <th class="responsive amount">
            {currencyFormatLocal(resume?.iva)}
          </th>
          <th class="amount">
            {currencyFormatLocal(resume?.Deposit)}
          </th>
          <th />
        </tr>
      </thead>
      <tbody class="inside">
        {#each transactions as transaction}
          <tr class="clickable number" on:click={() => goto(`/transactions/detail?ticket=${transaction?._id}`)}>
            <td class="responsive"
              >{dateToLocalStringShort(transaction["Transaction Date"]) +
                " - " +
                getTransactionTime(transaction["Transaction Time"])}</td
            >
            <td class="responsive">{transaction?.["ID Transaction"]}</td>
            <td>{currencyFormatLocal(transaction.Amount)}</td>
            <td>{currencyFormatLocal(transaction.comission)}</td>
            <td class="responsive">{currencyFormatLocal(transaction?.iva)}</td>
            <td>{currencyFormatLocal(transaction.toDeposit)}</td>
            <td class="responsive">
              <i class={`icon ${getIconStatusClass(transaction.transactionStatus)} tooltip`}>
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

<style lang="scss">
  @import "src/lib/styles/transactions/tables/month.scss";
</style>
