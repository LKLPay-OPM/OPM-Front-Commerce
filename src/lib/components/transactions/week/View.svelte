<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  /* utils */
  import { getMonthName, dateToLocalStringShort } from "$lib/utils/date";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  /* svelte */
  import { goto } from "$app/navigation";
  import { createFilterUrl } from "$lib/utils/string";
  /* exports */
  export let data;
  let transactionsWeek = data?.response?.transactions ?? [];
  let count = data?.response?.count ?? 0;
  let paginationStart = data?.start ?? 0;
  let paginationEnd = data?.end ?? 10;
  let active = data?.filter ?? "week";
  let cardBrand = data?.brand ?? "";
  let startDate = data.startDate ?? "";
  let endDate = data.endDate ?? "";
  let idTicket = data.ticket ?? "";
  let innerWidth = 0,
    innerHeight = 0;

  function handleFilterClick({ detail }) {
    // const value = detail?.value;
    // active = value;
    const url = `?filter=${active}${createFilterUrl(data.filters)}`;
    goto(url);
    // goto(`?filter=${active}&start=${paginationStart}&end=${paginationEnd}`);
  }

  const goToTransaction = (date) => {
    const path = `/transactions/week/${date}?filter=${active}${createFilterUrl(data.filters)}`;
    goto(path);
  };
</script>

<svelte:window bind:innerWidth bind:innerHeight />
<div class="transaction-tables">
  <div id="pdfTable" class="table-container">
    <div class="card-primary">
      <table class="table-content">
        <thead>
          <tr>
            <th class="title">Día</th>
            <th class="title">N° Ventas</th>
            <th class="title">Monto</th>
          </tr>
        </thead>
        <tbody>
          {#each transactionsWeek as day}
            <tr
              class="clickable"
              on:click={() => goToTransaction(day.date)}
              on:keypress={(e) => (e.key === "Enter" ? () => goToTransaction(day.date) : "")}
            >
              <td class="element">{innerWidth <= 540 ? "" : `${day.day} - `}{dateToLocalStringShort(day.date)}</td>
              <td class="element">{day.sold}</td>
              <td class="element">{currencyFormatLocal(day.sales)}</td>
              <i class="responsive arrow arrow-blue">
                <Icons name="arrow-fwd" width="24" height="24" />
              </i>
            </tr>
          {/each}
        </tbody>
      </table>
      <!-- {#if count > 10}
        <Pagination bind:paginationStart bind:paginationEnd bind:count on:pagination={handleFilterClick} />
      {/if} -->
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/transactions/views/week.scss";
</style>
