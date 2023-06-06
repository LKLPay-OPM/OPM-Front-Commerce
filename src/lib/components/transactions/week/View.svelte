<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  /* utils */
  import { getMonthName, dateToLocalStringShort } from "$lib/utils/date";
  /* svelte */
  import { goto } from "$app/navigation";
  /* exports */
  export let data;
  let transactionsWeek = data?.response?.transactions ?? [];
  let count = data?.response?.count ?? 0;
  let paginationStart = data?.start ?? 0;
  let paginationEnd = data?.end ?? 10;
  let active = data?.filter ?? "day";

  $: {
    console.log({ data });
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
    goto(`?filter=${active ?? "day"}&start=${paginationStart}&end=${paginationEnd}`);
  }

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
              on:keypress={(e) => (e.key === "Enter" ? () => goToTransaction(day.date) : "")}
            >
              <td class="element">{day.day} - {dateToLocalStringShort(day.date)}</td>
              <td class="element">{day.sold}</td>
              <td class="element">
                {day.sales?.toLocaleString(localeParam.language, localeParam.currency)}
              </td>
              <td class="element responsive">
                {day.comission?.toLocaleString(localeParam.language, localeParam.currency)}
              </td>
              <td class="element responsive">
                {day.iva?.toLocaleString(localeParam.language, localeParam.currency)}
              </td>
              <td class="element responsive">
                {day.deposit?.toLocaleString(localeParam.language, localeParam.currency)}
              </td>
              <i class="arrow arrow-blue">
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
  @import "src/lib/styles/transactions.scss";
</style>
