<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  /* svelte */
  import { goto } from "$app/navigation";
  /* utils */
  import { getMonthPeriod } from "$lib/utils/date";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  /* exports */
  export let data;

  let transactionsMonth = data?.response?.transactions ?? [];
  let count = data?.response?.count ?? 0;
  let paginationStart = data?.start ?? 0;
  let paginationEnd = data?.end ?? 10;
  let active = data?.filter ?? "month";
  let cardBrand = data?.brand ?? "";
  let startDate = data.startDate ?? "";
  let endDate = data.endDate ?? "";
  let idTicket = data.ticket ?? "";

  const goToTransaction = (date) => {
    const path = `
      /transactions/month/${date}?filter=${active}${startDate != "" ? `&startDate=${startDate}` : ""}${
      endDate != "" ? `&endDate=${endDate}` : ""
    }${idTicket != "" ? `&search=${idTicket}` : ""}&start=${paginationStart}&end=${paginationEnd}&brand=${cardBrand}`;
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
            <th class="title responsive">Comisión</th>
            <th class="title responsive">IVA</th>
            <th class="title responsive">Depósito</th>
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
              <td class="element responsive">
                {currencyFormatLocal(month?.Comission)}
              </td>
              <td class="element responsive">
                {currencyFormatLocal(month?.iva)}
              </td>
              <td class="element responsive">
                {currencyFormatLocal(month?.Deposit)}
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
