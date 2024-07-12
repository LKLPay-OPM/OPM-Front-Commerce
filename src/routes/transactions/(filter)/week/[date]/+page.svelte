<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  /* utils */
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import { getIconStatusClass } from "$lib/utils/iconClass";
  import { dateToLocalStringShort, getTransactionTime } from "$lib/utils/date";

  /* exports */
  export let data;
  /* imports */
  import { goto } from "$app/navigation";

  let resume = data?.response?.resume;
  let day = data?.response?.day;
  let transactions = data?.response?.transactions ?? [];
  let count = data?.response?.count ?? 0;
  let paginationStart = data?.filters.start ?? 0;
  let paginationEnd = data?.filters.end ?? 10;

  function handleFilterClick({ detail }) {
    // const value = detail?.value;
    // active = value;
    data.filters.paginationEnd = paginationEnd;
    data.filters.paginationStart = paginationStart;
    const url = `?filter=${data.filters.filter}${createFilterUrl(data.filters)}`;
    goto(url);
    // goto(`?start=${paginationStart}&end=${paginationEnd}`);
  }

  const returnToWeekView = () => {
    goto("/transactions/week");
  };
</script>

<div id={`pdfTable-${data.date}`} class="table-container">
  <div class="card-primary">
    <div class="row">
      <div class="title">
        <i
          class="arrow-blue"
          on:click={returnToWeekView}
          on:keypress={(e) => (e.key === "Enter" ? returnToWeekView : "")}
        >
          <Icons name="arrow-bwd" width="24" height="24" />
        </i>
        {day} - {dateToLocalStringShort(data.date)}
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
          <th class="responsive">Tipo</th>
        </tr>
      </thead>
      <thead style="height:1.5rem">
        <tr>
          <th class="responsive" />
          <th class="responsive" />
          <th class="amount">{currencyFormatLocal(resume?.Amount)}</th>
          <th class="amount">{currencyFormatLocal(resume?.Comission)}</th>
          <th class="amount">{currencyFormatLocal(resume?.iva)}</th>
          <th class="amount">{currencyFormatLocal(resume?.Deposit)}</th>
          <th class="responsive" />
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
            <td>{currencyFormatLocal(transaction?.Amount)}</td>
            <td>{currencyFormatLocal(transaction?.comission)}</td>
            <td>{currencyFormatLocal(transaction?.iva)}</td>
            <td>{currencyFormatLocal(transaction?.toDeposit)}</td>
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
  @import "src/lib/styles/transactions/tables/week.scss";
</style>
