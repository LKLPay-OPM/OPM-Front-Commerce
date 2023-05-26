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
        <div class="card-container table-container table">
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
  @import "src/lib/styles/dispersions.scss";

  .date {
    padding: 1rem;
    display: grid;
    position: relative;
    border-radius: 14px;
    z-index: 1;
    p {
      font-size: 1.125rem;
      font-weight: 700;
      color: $primary-dark;
      text-align: center;
      &.day-month {
        display: flex;
        flex-direction: column;
        font-size: 2rem;
        justify-content: center;
        & span {
          font-size: 1rem;
        }
      }
      &.weekday {
        display: flex;
        flex-direction: column;
        font-size: 1rem;
        justify-content: center;
      }
    }
    .vertical-line-divider {
      content: "";
      width: 2px;
      height: 1.5rem;
      text-align: center;
      background-color: rgb(0 0 0 / 20%);
      margin: auto;
    }

    &::before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: -1;
      border-radius: 14px;
      transform: translate(-50%, -50%);
      // background: linear-gradient(to bottom, $primary-accent-dark, $primary-light);
      background: linear-gradient($primary-light, $primary-accent-dark, $background-light-secondary);
    }
    &::after {
      content: "";
      position: absolute;
      width: calc(100% - 5px);
      height: calc(100% - 5px);
      top: 50%;
      left: 50%;
      z-index: -1;
      border-radius: 12px;
      transform: translate(-50%, -50%);
      background-color: $background-light-secondary;
    }
  }

  .table-content {
    margin-top: 0;
  }

  .table-container {
    &.table {
      padding: 1rem;
      margin: 0 0 1.25rem 0;
    }
  }
  /* .content {
    display: grid;
    .table {
      margin-inline: auto;
      .title {
        font-size: 1.125rem;
        font-weight: 700;
        color: $primary-dark;
      }
      .details {
        font-size: 0.875rem;
        font-weight: 500;
        color: $primary-dark;
      }
    }
  } */

  @media (max-width: 540px) {
    .date {
      grid-auto-flow: column;
    }
  }

  @media (min-width: 768px) and (max-width: 1023px) {
  }
</style>
