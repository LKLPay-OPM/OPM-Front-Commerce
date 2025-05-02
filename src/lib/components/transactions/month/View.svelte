<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  /* svelte */
  import { goto } from "$app/navigation";
  /* utils */
  import { getMonthPeriod } from "$lib/utils/date";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  import { createFilterUrl } from "$lib/utils/string";
  /* exports */
  export let data;

  let transactionsMonth = data?.response?.transactions ?? [];
  let count = data?.response?.count ?? 0;
  let paginationStart = data?.filters.start ?? 0;
  let paginationEnd = data?.filters.end ?? 10;
  let active = data?.filters.filter ?? "month";
  let cardBrand = data?.filters.brand ?? "";
  let startDate = data.filters.startDate ?? "";
  let endDate = data.filters.endDate ?? "";
  let idTicket = data.filters.ticket ?? "";

  const goToTransaction = (date) => {
    const path = `/transactions/month/${date}?filter=${active}${createFilterUrl(data.filters)}`;
    goto(path);
  };
</script>

<div class="transaction-tables">
  <div id="pdfTable" class="table-container">
    <div class="card-primary">
      <table class="table-content">
        <thead>
          <tr>
            <th class="title">Día</th>
            <th class="title">N° Ventas</th>
            <th class="title">Vendido</th>
          </tr>
        </thead>
        <tbody>
          {#each transactionsMonth as month}
            <tr
              class="clickable"
              on:click={() => goToTransaction(month._id)}
              on:keypress={(e) => (e.key === "Enter" ? () => goToTransaction(month._id) : "")}
            >
              <td class="element">{getMonthPeriod(month._id)}</td>
              <td class="element">{month?.Sold ?? 0}</td>
              <td class="element">
                {currencyFormatLocal(month?.Amount)}
              </td>
              <i class="responsive arrow arrow-blue">
                <Icons name="arrow-fwd" width="24" height="24" />
              </i>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/transactions/views/month.scss";
</style>
