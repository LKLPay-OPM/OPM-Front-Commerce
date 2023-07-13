<script>
  /* components */
  import Icons from "$lib/components/Icons.svelte";
  /* svelte */
  import { goto } from "$app/navigation";
  /* utils */
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  /* exports */
  export let data;

  let transactionsMonth = data?.response?.transactions ?? [];
  let count = data?.response?.count ?? 0;
  let paginationStart = data?.start ?? 0;
  let paginationEnd = data?.end ?? 10;
  let active = data?.filter ?? "month";

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

  const getMonthPeriod = (string) => {
    var pattern = /(\d{2})(\d{2})/; // String pattern replace for date
    const extractMonth = string.replace(pattern, "$2");
    const month = getMonthName(extractMonth);
    let str = string.replace(pattern, `${month} 20$1`);
    return str;
  };

  const goToTransaction = (date) => {
    goto(`/transactions/month/${date}`);
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
                {currencyFormatLocal(month?.IVA)}
              </td>
              <td class="element responsive">
                {currencyFormatLocal(month?.Deposit)}
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

<style lang="scss">
  @import "src/lib/styles/transactions/views/month.scss";
</style>
