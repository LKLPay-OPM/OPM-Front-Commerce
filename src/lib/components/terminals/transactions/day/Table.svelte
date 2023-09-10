<script>
  /* components */
  import Pagination from "$lib/components/Pagination.svelte";
  import Icons from "$lib/components/Icons.svelte";
  /* svelte */
  import { goto } from "$app/navigation";
  /* utils */
  import { timeToLocalString, dateToLocalString } from "$lib/utils/date";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import { getIconStatusClass } from "$lib/utils/iconClass";
  /* exports */
  export let data;
  let transactions = data?.response?.transactions ?? [];
  let count = data?.response?.count ?? 0;
  let paginationStart = data?.start ?? 0;
  let paginationEnd = data?.end ?? 10;
  let active = data?.filter ?? "day";

  function handleFilterClick({ detail }) {
    // const value = detail?.value;
    // active = value;
    goto(`?filter=${active ?? "day"}&start=${paginationStart}&end=${paginationEnd}`);
  }
</script>

<div class="transaction-tables">
  <div id="pdfTable" class="table-container">
    <div class="card-primary">
      <table class="table-content">
        <thead>
          <tr>
            <th class="">Hora</th>
            <th class="sm">N° Ticket</th>
            <th>Monto</th>
            <th class="">Comisión</th>
            <th class="sm md">IVA</th>
            <th class="">Depósito</th>
            <th class="sm">Tipo</th>
          </tr>
        </thead>
        <tbody>
          {#each transactions as transaction}
            <tr class="clickable number" on:click={() => goto(`/transactions/detail?ticket=${transaction?._id}`)}>
              <td class="">{timeToLocalString(transaction["Transaction Time"])}</td>
              <td class="sm">{transaction?.["ID Transaction"]}</td>
              <td>{currencyFormatLocal(transaction.Amount)}</td>
              <td class="">{currencyFormatLocal(transaction.comission)}</td>
              <td class="sm md">{currencyFormatLocal(transaction.iva)}</td>
              <td class="">{currencyFormatLocal(transaction.toDeposit)}</td>
              <td class="sm">
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
</div>

<style lang="scss">
  @import "src/lib/styles/transactions/tables/day.scss";
</style>
