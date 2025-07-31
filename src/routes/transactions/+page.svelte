<script>
  /* svelte */
  import { error } from "@sveltejs/kit";
  // import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { invalidateAll } from "$app/navigation";
  import { isLoggedIn, loggedInUser } from "$lib/stores";
  /* components */
  import Card from "$lib/components/Card.svelte";
  import PageLoader from "$lib/components/PageLoader.svelte";
  import Container from "$lib/components/Container.svelte";
  import DateTitle from "$lib/components/DateTitle.svelte";
  import RedirectLogin from "$lib/components/RedirectLogin.svelte";
  import CardContainer from "$lib/components/CardContainer.svelte";
  import AlignContainer from "$lib/components/AlignContainer.svelte";
  import EmptyTransactionsMessage from "$lib/components/transaction/EmptyTransactionsMessage.svelte";
  import TransactionTable from "$lib/components/transaction/TransactionTable.svelte";
  import TransactionMenu from "$lib/components/transaction/TransactionMenu.svelte";
  /* utils */
  import { getStringDate } from "$lib/utils/date";
  import { currencyFormatLocal } from "$lib/utils/currencyFormatLocal";
  /* client */
  import { axiosDevicesClient } from "$lib/repos/axios";
  /* controllers */
  import { appErrorResponseHandler } from "$lib/handlers/error.handler";

  /* dynamic vars */
  export let data;

  $: transactions = data.transactions ?? [];
  $: terminals = data.terminals ?? [];
  $: resume = data.summary ?? [];

  let filter = data.filter ?? "day";
  let start = data.start;
  let end = data.end;
  let pageSelected = 1;
  let dateStart = data.dateStart;
  let dateEnd = data.dateEnd;
  let selectedTerminal = data.serialNumber;
  let loading = false;
  let tableLoading = false;

  async function handlePagination({ detail }) {
    tableLoading = true;
    window.history.replaceState(history.state, '', `?filter=${filter}${dateStart != "" ? `&dateStart=${dateStart}`:""}${dateEnd != "" ? `&dateEnd=${dateEnd}`:""}&start=${start}&end=${end}`)
    await invalidateAll();
    tableLoading = false;
  }

  onMount(async () => {
    if (!$isLoggedIn) await goto("/login");
    loading = false;
  });
</script>

{#if $isLoggedIn}
  {#if loading}
    <PageLoader />
  {:else}
    {#key transactions}
      <TransactionMenu bind:filter {terminals} {dateStart} {selectedTerminal} {dateEnd} {start} {end}/>
      <Container>
        <!-- <AlignContainer cols="1">
          <DateTitle />
        </AlignContainer>
        <div class="subtitle">
          <p>Tu Información al día de hoy</p>
        </div> -->
        <CardContainer>
          <Card title="Nº Ventas" value={resume.Sold ?? "0"} />
          <Card title="Monto Total" value={currencyFormatLocal(resume?.Amount ?? 0)} />
          <Card title="Comisión" value={currencyFormatLocal(resume?.Comission ?? 0)} />
          <Card title="IVA" value={currencyFormatLocal(resume.iva ?? 0)} />
        </CardContainer>
        {#if transactions.length <= 0}
          <EmptyTransactionsMessage />
        {:else}
          <TransactionTable
            {transactions}
            bind:count={data.total}
            bind:start
            bind:end
            bind:selected={pageSelected}
            on:pagination={handlePagination}
            bind:loading={tableLoading}
          />
        {/if}
      </Container>
    {/key}
  {/if}
{:else}
  <RedirectLogin />
{/if}

<style lang="scss">
  .subtitle {
    margin: 0.5rem 0rem;
    p {
      font-style: normal;
      font-weight: 700;
      font-size: 16px;
      line-height: 20px;
      text-align: center;
      /* text-placeholder */
      color: $primary-dark;
    }
  }
</style>
