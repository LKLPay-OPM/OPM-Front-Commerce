<script>
  /* svelte */
  import { goto } from "$app/navigation";
  import { createEventDispatcher } from "svelte";
  /* components */
  import Transaction from "$lib/components/transaction/Transaction.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import Loader from "$lib/components/loaders/TableLoader.svelte";
  /* variables */
  export let transactions = [];
  export let start = 0;
  export let end = 10;
  export let count = 0;
  export let loading = false;

  const dispatch = createEventDispatcher();

  function handleFilterClick({ detail }) {
    dispatch("pagination");
  }
</script>

<div class="transactions-view">
  <div class="transaction-tables">
    <div class="table-container">
      <table class="table-content">
        {#if loading}
          <Loader />
        {/if}
        <thead class:opacity={loading}>
          <tr>
            <th class="text-center">Fecha</th>
            <th class="text-center">N° de Serie</th>
            <th class="text-center">N° de Recibo</th>
            <th class="text-center">Monto Total</th>
            <th class="text-center">Comisión</th>
            <th class="text-center">IVA</th>
            <th class="text-center">Tipo</th>
            <th class="text-center">Autorización</th>
            <th class="text-center">Estatus Depósito</th>
          </tr>
        </thead>
        <tbody class:opacity={loading}>
          {#each transactions as transaction}
            <Transaction {transaction} />
          {/each}
        </tbody>
      </table>
      {#if count > 10}
        <Pagination
          bind:paginationStart={start}
          bind:paginationEnd={end}
          bind:count
          on:pagination={handleFilterClick}
        />
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .opacity {
    opacity: 0;
    pointer-events: none;
  }
  .transactions-view {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .transaction-tables {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .table-container {
    width: 100%;
    gap: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }

  .table-content {
    /* width: 46.875rem; */
    position: relative;
    // min-height: 200px;
    width: 70%;
    border-spacing: 0;
    padding: 32px;
    background: #f3f3f3;
    box-shadow: 2px 2px 4px rgba(114, 142, 171, 0.1), -6px -6px 20px #ffffff, 4px 4px 20px rgba(111, 140, 176, 0.41);
    border-radius: 10px;

    thead {
      font-family: "Raleway";
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 18px;
      text-align: left;
      /* text-placeholder */
      color: #8c9fb1;
      height: 2.375rem;
    }

    th {
      padding: 0.5rem 0.5rem;
    }
  }

  .text-center {
    text-align: center;
  }
</style>
