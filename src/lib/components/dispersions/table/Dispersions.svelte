<script>
  /* svelte */
  import { goto } from "$app/navigation";
  /* utils */
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";

  export let dispersions;
</script>

<!-- on:click={() => goto(`/dispersions/detail?ticket=${dispersion?._id}`)} -->
<div class="dispersion-tables">
  <div id="pdfTable" class="table-container">
    <div>
      {#each dispersions as dispersion}
        <div class="card-primary table-container table">
          <div class="date">
            <p class="day-month">{dispersion?.day}<span>{dispersion?.month}</span></p>
            <span class="vertical-line-divider" />
            <p class="weekday">{dispersion?.dayName}</p>
          </div>
          <table class="table-content">
            <thead>
              <tr>
                <th class="responsive hide">Folio</th>
                <th>Saldo</th>
                <th>Tipo</th>
                <th class="responsive hide">Comisión</th>
                <th class="responsive hide">IVA</th>
                <th class="responsive hide">Interés</th>
                <th class="responsive hide">Depósito</th>
              </tr>
            </thead>
            <tbody>
              {#each dispersion?.dispersion as type}
                <tr class="clickable-table-row" on:click={() => goto(`/dispersions/detail?id=${type?.id}`)}>
                  <td class="responsive hide">{type.id}</td>
                  <td>{currencyFormatLocal(type.balance)}</td>
                  <td style="text-transform:capitalize;">{type.type}</td>
                  <td class="responsive hide">{currencyFormatLocal(type.commission)}</td>
                  <td class="responsive hide">{currencyFormatLocal(type.iva)}</td>
                  <td class="responsive hide">{currencyFormatLocal(type.interest)}</td>
                  <td class="responsive hide">{currencyFormatLocal(type.deposit)}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/lib/styles/dispersions/table.scss";
</style>
