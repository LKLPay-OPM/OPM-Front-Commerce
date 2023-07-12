<script>
  /* svelte */
  import { goto } from "$app/navigation";

  export let dispersions;
</script>

<!-- on:click={() => goto(`/dispersions/detail?ticket=${dispersion?._id}`)} -->
<div class="dispersion-tables">
  <div id="pdfTable" class="table-container">
    <div>
      {#each dispersions as dispersion}
        <div class="card-primary table-container table">
          <div class="date">
            <p class="day-month">{dispersion.day}<span>{dispersion.month}</span></p>
            <span class="vertical-line-divider" />
            <p class="weekday">{dispersion.dayName}</p>
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
                <th class="responsive hide">Saldo Final</th>
              </tr>
            </thead>
            <tbody>
              <tr class="clickable-table-row" on:click={() => goto(`/dispersions/detail?ticket=${dispersion?._id}`)}>
                <td class="responsive hide">123</td>
                <td>$1000</td>
                <td>Inmediata</td>
                <td class="responsive hide" />
                <td class="responsive hide"> - </td>
                <td class="responsive hide" />
                <td class="responsive hide" />
                <td class="responsive hide" />
              </tr>
              <tr class="clickable-table-row" on:click={() => goto(`/dispersions/detail?ticket=${dispersion?._id}`)}>
                <td class="responsive hide">124</td>
                <td>$0</td>
                <td>Tradicional</td>
                <td class="responsive hide" />
                <td class="responsive hide"> - </td>
                <td class="responsive hide" />
                <td class="responsive hide" />
                <td class="responsive hide" />
              </tr>
              <tr class="clickable-table-row" on:click={() => goto(`/dispersions/detail?ticket=${dispersion?._id}`)}>
                <td class="responsive hide">125</td>
                <td>$0</td>
                <td>Urgente</td>
                <td class="responsive hide" />
                <td class="responsive hide"> - </td>
                <td class="responsive hide" />
                <td class="responsive hide" />
                <td class="responsive hide" />
              </tr>
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
